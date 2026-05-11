# Spécifications techniques – Sécurité à implémenter dans le back

> **Version** : 1.0  
> **Date** : 2026-04-29  
> **Destinataires** : Équipe back-end  
> **Statut** : ✅ Authentification implémentée – Middleware RBAC à suivre

---

## Vue d'ensemble

Ce document spécifie les middlewares et endpoints de sécurité à implémenter.

**Ce qui a déjà été fait** (validé par la cyber) :
- ✅ `authMiddleware` (intégré dans `login.ts`)
- ✅ `rateLimitMiddleware` (login:10, register:5)
- ✅ Validation des entrées (`express-validator`)

**Ce qui reste à faire** :
- ⚠️ `roleMiddleware(['admin'])` pour routes admin
- ⚠️ Refresh token

---

## 1. Middleware `authMiddleware()` – ✅ IMPLÉMENTÉ

### Emplacement
Intégré dans `login.ts` via la génération et le stockage du token.

### Comportement actuel
- Token généré après authentification réussie
- Stocké dans cookie HttpOnly
- Durée : 15 minutes

---

## 2. Middleware `roleMiddleware()` – ⚠️ À IMPLÉMENTER

### Rôle
Vérifier que l'utilisateur authentifié a le rôle `admin` pour accéder aux routes d'administration.

### Code à implémenter

```typescript
// middlewares/role.ts
function roleMiddleware(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "Non authentifié" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Accès interdit. Rôle insuffisant." });
        }
        next();
    };
}# Spécifications techniques – Sécurité à implémenter dans le back

> **Version** : 1.0  
> **Date** : 2026-04-27  
> **Destinataires** : Équipe back-end  
> **Statut** : À implémenter semaine 1

---

## Vue d'ensemble

Ce document spécifie **exactement** ce que le back doit coder pour respecter les décisions d'architecture sécurité validées avec l'équipe cyber.

Chaque middleware et endpoint est décrit avec :
- Son comportement attendu
- Les codes HTTP à retourner
- Des exemples de code (Node.js/Express – à adapter à votre stack)

---

## 1. Middleware `authMiddleware()`

### Rôle
Vérifier que l'utilisateur est authentifié avant d'accéder à une route protégée.

### Comportement attendu

| Cas | Action | Code HTTP |
|-----|--------|-----------|
| Pas de token dans les cookies | Rejeter | 401 Unauthorized |
| Token présent mais invalide (mauvaise signature, expiré) | Rejeter | 403 Forbidden |
| Token valide | Extraire le payload, attacher à `req.user`, passer au suivant | 200 (continue) |

### Ce que doit contenir `req.user`

```json
{
  "id": "uuid_de_l_utilisateur",
  "email": "user@example.com",
  "role": "admin" | "user",
  "iat": 1714234567,
  "exp": 1714235467
}
