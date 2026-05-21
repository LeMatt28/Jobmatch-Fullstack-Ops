-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "oauthProvider" TEXT,
ADD COLUMN     "oauthProviderId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "oauthProvider" TEXT,
ADD COLUMN     "oauthProviderId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
