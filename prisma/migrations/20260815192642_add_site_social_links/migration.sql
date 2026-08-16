-- CreateTable
CREATE TABLE "SiteSocialLink" (
    "id" TEXT NOT NULL,
    "platform" VARCHAR(32) NOT NULL,
    "label" VARCHAR(64) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiteSocialLink_published_sortOrder_idx" ON "SiteSocialLink"("published", "sortOrder");
