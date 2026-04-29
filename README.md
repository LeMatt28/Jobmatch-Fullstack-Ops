cd BACKEND

# Avoir le bon .env

cd docker
docker compose up -d

cd .. (backend)
npm install
npm run setup
npm run dev
