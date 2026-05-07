# Audit bcrypt – Stockage des mots de passe

**Date initiale** : 2026-04-29  
**Date des corrections** : 2026-04-29  
**Auditeur / Correcteur** : Cyber (corrections appliquées directement)  
**Fichiers audités** : `login.ts`, `register.ts`

---

## ✅ Statut final : CONFORME

Toutes les anomalies détectées ont été corrigées.

---

## Checklist d'audit

| Vérification | Statut | Preuve |
|--------------|--------|--------|
| `bcrypt` installé | ✅ | `import bcrypt from "bcryptjs"` |
| Salt factor ≥ 10 | ✅ | `bcrypt.hash(password, 10)` |
| Mot de passe hashé avant stockage | ✅ | `hashedPassword` avant `prisma.user.create` |
| Pas de `console.log(password)` | ✅ | Aucun log visible |
| Pas de stockage en clair | ✅ | Seul le hash est stocké |
| Comparaison avec `bcrypt.compare` | ✅ | `await bcrypt.compare(password, user.password)` |
| Champ password jamais renvoyé | ✅ | Seulement `userId` dans réponse |
| Message d'erreur générique | ✅ | "Identifiants invalides." |

---

## Anomalies détectées et corrigées

| Anomalie | Correction appliquée | Statut |
|----------|---------------------|--------|
| Fuite d'information (message spécifique) | Message unique "Identifiants invalides" | ✅ Corrigé |
| Token JWT dans body JSON | Cookie HttpOnly | ✅ Corrigé |
| Durée token trop longue (7 jours) | Passage à 15 minutes | ✅ Corrigé |
| Pas de rate limiting | Ajouté (10/login, 5/register) | ✅ Corrigé |
| Pas de validation entrées | Ajouté via `express-validator` | ✅ Corrigé |

---

## Code validé

### `register.ts` – Extrait clé

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
});
return res.status(201).json({ message: "Utilisateur créé avec succès.", userId: user.id });
```
### 'login.ts' - Extrait clé

```typescript
const isValid = await bcrypt.compare(password, user.password as string);
if (!user || !isValid) {
    return res.status(401).json({ message: "Identifiants invalides." });
}
res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
});```
