-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "remote" TEXT,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "contractType" DROP NOT NULL,
ALTER COLUMN "publishedAt" DROP NOT NULL;
