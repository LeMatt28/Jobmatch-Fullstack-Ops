# Spécifications techniques – Sécurité à implémenter dans le back

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