# Journal des corrections de sécurité

## 2026-04-29 – Correction login.js

**Auteur** : Cyber  
**Fichier corrigé** : `login.js`  
**Nature des corrections** :
- Message d'erreur unique pour éviter l'énumération des emails
- Token JWT déplacé du body JSON vers cookie HttpOnly
- Durée du token réduite de 7 jours à 15 minutes

**Preuve** : Le fichier corrigé a été remis à l'équipe back et intégré.

**Statut** : ✅ Validé

---

## Prochaines corrections prévues
- (à compléter)