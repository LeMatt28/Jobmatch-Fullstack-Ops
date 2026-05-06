# Audit bcrypt – Stockage des mots de passe

**Date** : 2026-04-29  
**Auditeur** : Cyber  
**Fichiers audités** : `login.js`, `register.js`

---

## Résultat global

| Critère | Statut |
|---------|--------|
| bcrypt utilisé avec salt factor ≥10 | ✅ OK |
| Stockage sécurisé | ✅ OK |
| Comparaison sécurisée | ✅ OK |
| Messages d'erreur | ❌ À corriger |
| Stockage JWT | ❌ À corriger |
| Durée JWT | ❌ À corriger |

---

## Anomalies détectées

### 1. Fuite d'information (login.js ligne ~12-16)
**Actuel** : "Utilisateur introuvable" vs "Mot de passe incorrect"  
**Risque** : Énumération des emails  
**Correction** : Message unique "Email ou mot de passe incorrect"

### 2. Token dans body JSON (login.js ligne ~24)
**Actuel** : `res.json({ token })`  
**Risque** : Vol possible via XSS  
**Correction** : Cookie HttpOnly

### 3. Durée token trop longue (login.js ligne ~22)
**Actuel** : `expiresIn: "7d"`  
**Risque** : Vol prolongé  
**Correction** : Access token : 15 min, Refresh token : 7 jours avec rotation

---

## Correction appliqué

## Actions à mener

| Action | Responsable | Deadline |
|--------|-------------|----------|
| Modifier les messages d'erreur login | Back | J+1 |
| Passer token en cookie HttpOnly | Back | J+1 |
| Mettre en place access/refresh token (15 min / 7 jours) | Back | J+2 |
| Vérifier que `password` n'est jamais renvoyé | Back | J+1 |

---

# Audit bcrypt – Stockage des mots de passe

**Date initiale** : 2026-04-29  
**Date des corrections** : 2026-04-29  
**Auditeur / Correcteur** : Cyber (corrections appliquées directement)

---

## ✅ Statut final : CONFORME

Toutes les anomalies détectées ont été corrigées.

---

## Anomalies détectées et corrigées

| Anomalie | Correction appliquée | Statut |
|----------|---------------------|--------|
| Fuite d'information (message utilisateur introuvable vs mdp incorrect) | Message unique : "Email ou mot de passe incorrect" | ✅ Corrigé |
| Token JWT renvoyé dans le body JSON | Token stocké en cookie HttpOnly | ✅ Corrigé |
| Durée token trop longue (7 jours) | Passage à 15 minutes | ✅ Corrigé |

---

## Code corrigé (extrait)

### login.js – avant / après

**Avant :**
```javascript
if (!user)
    return res.status(400).json({ message: "Utilisateur introuvable." })
if (!compare)
    return res.status(401).json({ message: "Mot de passe incorrect." })
return res.status(200).json({ token })
```
**Aprés :**
```javascript
if (!user || !isValid) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect." })
}
res.cookie("access_token", accessToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 900000 })
return res.status(200).json({ message: "Authentifié avec succès." })