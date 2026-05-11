#!/bin/bash
# Génère des valeurs sécurisées pour .env.example
# Utilisation : ./scripts/generate-secrets.sh

echo "# Génération de secrets sécurisés"
echo "# Copiez ces valeurs dans votre .env"
echo ""

echo "JWT_SECRET=$(openssl rand -base64 64)"
echo "DB_PASSWORD=$(openssl rand -base64 32 | tr -d '=+' | cut -c1-20)"
echo ""
echo "WELOVEDEVS_API_KEY=à_obtenir_sur_welovedevs.com (non générable)"