-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL,
    "ownerType" "MediaOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "data" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentBlock_ownerType_ownerId_order_idx" ON "ContentBlock"("ownerType", "ownerId", "order");
