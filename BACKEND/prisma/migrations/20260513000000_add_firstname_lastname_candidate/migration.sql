-- Ajouter firstName et lastName avec une valeur par défaut temporaire pour les lignes existantes
ALTER TABLE "Candidate" ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Candidate" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';

-- Migrer l'ancienne colonne name vers firstName (tout dans firstName)
UPDATE "Candidate" SET "firstName" = "name", "lastName" = '';

-- Supprimer les valeurs par défaut (les nouvelles lignes devront fournir ces champs)
ALTER TABLE "Candidate" ALTER COLUMN "firstName" DROP DEFAULT;
ALTER TABLE "Candidate" ALTER COLUMN "lastName" DROP DEFAULT;

-- Supprimer l'ancienne colonne name
ALTER TABLE "Candidate" DROP COLUMN "name";
