# 🧪 Exemples de Tests de Sécurité

## 📌 Comment Tester les Protections

### 1️⃣ **Brute Force Protection (authLimiter)**

Tentez plus de 5 connexions en 15 minutes:

```bash
# Test 1-5: OK
for i in {1..5}; do
  curl -X POST http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"WrongPass123"}'
  sleep 1
done

# Test 6: BLOQUÉ - 429 Too Many Requests
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"WrongPass123"}'
```

**Résultat attendu**: 
```json
{
  "error": "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.",
  "protection": "Rate limiting (authLimiter - 5 tentatives/15min)"
}
```

---

### 2️⃣ **Input Validation (Zod)**

Essayez une validation échouée:

```bash
# Email invalide
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"ValidPass123"}'

# Mot de passe trop court
curl -X POST http://localhost:3001/auth/register/candidate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"short","name":"John"}'
```

**Résultat attendu**:
```json
{
  "error": "Données invalides",
  "details": {
    "fieldErrors": {
      "email": ["Email invalide"],
      "password": ["Minimum 8 caractères"]
    }
  },
  "protection": "Input validation - Zod schema validation"
}
```

---

### 3️⃣ **IDOR Protection - Accès à une Offre d'Autrui**

Supposons que candidat1 a le token1, et candidat2 a le token2:

```bash
# Candidat1 essaie de voir l'offre de candidat2
# Cette route n'a pas de protection IDOR (voir PUBLIC)
curl -X GET http://localhost:3001/offers/123 \
  -H "Authorization: Bearer $TOKEN1"

# ✓ OK - Les offres sont publiques pour les candidats
```

Mais si une route était protégée (exemple imagé):

```bash
# Entreprise1 essaie de voir les matchs de l'offre d'entreprise2
curl -X GET http://localhost:3001/matches/999 \
  -H "Authorization: Bearer $COMPANY1_TOKEN"

# ✗ BLOQUÉ - 403 Forbidden - L'offre appartient à une autre entreprise
```

**Résultat attendu**:
```json
{
  "error": "Pas votre offre",
  "protection": "IDOR prevention - Ownership verification. This offer belongs to another company"
}
```

---

### 4️⃣ **XSS Prevention (Sanitization)**

Essayez d'injecter du HTML/JavaScript:

```bash
curl -X POST http://localhost:3001/reviews/candidate/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COMPANY_TOKEN" \
  -d '{
    "score": 5,
    "comment": "Great! <script>alert(\"XSS\")</script>"
  }'
```

**Résultat attendu**: Le script est échappé/supprimé:
```json
{
  "id": 1,
  "comment": "Great! &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
}
```

Les balises script sont supprimées ou échappées ✓

---

### 5️⃣ **CSRF Protection (Content-Type)**

Envoyez une requête POST sans Content-Type JSON:

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: text/plain" \
  -d '{"email":"test@test.com","password":"ValidPass123"}'
```

**Résultat attendu**:
```json
{
  "error": "Content-Type invalide",
  "protection": "CSRF protection - Content-Type must be application/json"
}
```

---

### 6️⃣ **JWT Expiration**

Un token JWT avec expiration courte (7 jours):

```bash
# Utiliser un vieux token expiré
curl -X GET http://localhost:3001/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.EXPIRED_TOKEN_HERE"
```

**Résultat attendu**:
```json
{
  "error": "Token invalide ou expiré",
  "protection": "JWT signature invalid or expired - Protection contre usurpation"
}
```

---

### 7️⃣ **Role-Based Access Control (RBAC)**

Un candidat essaie de créer une offre:

```bash
curl -X POST http://localhost:3001/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{
    "title": "Senior Dev",
    "description": "...",
    "stack": ["Node.js"],
    "location": "Paris",
    "contractType": "CDI"
  }'
```

**Résultat attendu**:
```json
{
  "error": "Réservé aux entreprises",
  "protection": "Role-based access control (RBAC) - Privilege escalation prevention"
}
```

---

### 8️⃣ **Missing Authentication**

Une requête sans token:

```bash
curl -X GET http://localhost:3001/me
```

**Résultat attendu**:
```json
{
  "error": "Token manquant",
  "protection": "Authentication required - Authorization header missing"
}
```

---

### 9️⃣ **Invalid Token Format**

Un token avec un mauvais format:

```bash
curl -X GET http://localhost:3001/me \
  -H "Authorization: $INVALID_TOKEN"

# ou

curl -X GET http://localhost:3001/me \
  -H "Authorization: Bearer"
```

**Résultat attendu**:
```json
{
  "error": "Format Authorization invalide",
  "protection": "Token format must be 'Bearer <token>' - Protection contre injection"
}
```

---

### 🔟 **Parameter Injection (ID Validation)**

Essayez d'injecter un ID négatif ou invalide:

```bash
# ID négatif
curl -X GET http://localhost:3001/offers/-1 \
  -H "Authorization: Bearer $TOKEN"

# ID non numérique
curl -X GET http://localhost:3001/offers/abc \
  -H "Authorization: Bearer $TOKEN"
```

**Résultat attendu**:
```json
{
  "error": "Paramètre ID invalide",
  "details": {
    "fieldErrors": {
      "id": ["L'ID doit être un nombre positif valide. Protection IDOR."]
    }
  },
  "protection": "IDOR validation - ID doit être un nombre positif"
}
```

---

## 🔧 Script de Test Automatisé

Créez un fichier `test-security.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3001"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧪 Tests de Sécurité"
echo "====================="

# Test 1: Brute Force
echo -e "\n${GREEN}[Test 1]${NC} Brute Force Protection"
for i in {1..6}; do
  RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\n%{http_code}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  if [ $i -eq 6 ]; then
    if [ "$HTTP_CODE" = "429" ]; then
      echo -e "${GREEN}✓ PASS${NC} - Brute force bloqué après 5 tentatives"
    else
      echo -e "${RED}✗ FAIL${NC} - HTTP $HTTP_CODE (attendu 429)"
    fi
  fi
done

# Test 2: Input Validation
echo -e "\n${GREEN}[Test 2]${NC} Input Validation"
RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"test"}' \
  -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "400" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Email invalide rejeté"
else
  echo -e "${RED}✗ FAIL${NC} - HTTP $HTTP_CODE (attendu 400)"
fi

# Test 3: Missing Auth
echo -e "\n${GREEN}[Test 3]${NC} Missing Authentication"
RESPONSE=$(curl -s -X GET $BASE_URL/me \
  -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Token manquant rejeté"
else
  echo -e "${RED}✗ FAIL${NC} - HTTP $HTTP_CODE (attendu 401)"
fi

echo -e "\n${GREEN}✓ Tests complétés${NC}\n"
```

Exécution:
```bash
chmod +x test-security.sh
./test-security.sh
```

---

## 📊 Checklist de Vérification

- [ ] Rate limiter fonctionne (429 après 5 tentatives)
- [ ] Validation Zod rejette les données invalides (400)
- [ ] IDOR bloqué - Impossible d'accéder aux ressources d'autrui (403)
- [ ] XSS sanitisé - HTML/scripts échappés
- [ ] CSRF - Content-Type invalide rejeté (415)
- [ ] JWT expiré rejeté (401)
- [ ] RBAC - Candidat ne peut pas créer d'offre (403)
- [ ] Token manquant rejeté (401)
- [ ] Format Bearer invalide rejeté (401)
- [ ] ID négatif/non-numérique rejeté (400)

---

## 🚀 Outils de Test Recommandés

1. **Postman**: GUI pour les requêtes HTTP
2. **curl**: Ligne de commande
3. **OWASP ZAP**: Scanner de sécurité automatisé
4. **Burp Suite Community**: Proxy/scanner HTTP
5. **Artillery**: Load testing (pour les rate limiters)

---

## 📝 Notes

- Tous les endpoints retournent un champ `protection` décrivant la protection appliquée
- Les messages d'erreur sont génériques en production (ne pas révéler d'infos sensibles)
- Les rate limiters se réinitialisent après la fenêtre de temps
- Les tokens JWT expirent après 7 jours
