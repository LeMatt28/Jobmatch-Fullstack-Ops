-- AlterTable
ALTER TABLE "public"."Offer" ADD COLUMN "sourceId" TEXT,
                              ADD COLUMN "source" TEXT,
                              ADD COLUMN "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Offer_sourceId_key" ON "public"."Offer"("sourceId");
