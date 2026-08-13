-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "StatCategory" AS ENUM ('OFFENSIVE', 'DEFENSIVE', 'PHYSICAL', 'GOALKEEPER');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('YOUTUBE_VIDEO', 'IMAGE', 'GIF');

-- CreateEnum
CREATE TYPE "MediaOwnerType" AS ENUM ('BUILD', 'TUTORIAL', 'FORMATION_GUIDE', 'DISCOVERY', 'COACH');

-- CreateEnum
CREATE TYPE "FeaturedContentType" AS ENUM ('BUILD', 'TUTORIAL', 'FORMATION_GUIDE', 'DISCOVERY', 'COACH');

-- CreateEnum
CREATE TYPE "FeaturedPlacement" AS ENUM ('HERO', 'FEATURED', 'SIDEBAR', 'LATEST');

-- CreateEnum
CREATE TYPE "TutorialCategory" AS ENUM ('FREE_KICKS', 'SKILLS', 'DRIBBLING', 'PASSING', 'SHOOTING', 'CORNERS', 'MECHANICS');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "DiscoveryCategory" AS ENUM ('EFOOTBALL_SCIENCE', 'EXPERIMENTS', 'COMMUNITY', 'MECHANICS', 'UPDATES', 'META');

-- CreateEnum
CREATE TYPE "ResearchStatus" AS ENUM ('EXAMPLE', 'FIELD_VERIFIED');

-- CreateEnum
CREATE TYPE "FeedbackPlatform" AS ENUM ('YOUTUBE', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCard" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "cardName" VARCHAR(255) NOT NULL,
    "rarity" TEXT,
    "position" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "buildName" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "philosophy" TEXT NOT NULL,
    "playstyle" TEXT,
    "skills" JSONB NOT NULL DEFAULT '[]',
    "recommendedFor" JSONB NOT NULL DEFAULT '[]',
    "avoidFor" JSONB NOT NULL DEFAULT '[]',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "StatCategory" NOT NULL,
    "sortIndex" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildStatistic" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "isKey" BOOLEAN NOT NULL DEFAULT false,
    "keyOrder" INTEGER,

    CONSTRAINT "BuildStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildStrength" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "BuildStrength_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildWeakness" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "BuildWeakness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildFeedback" (
    "id" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "platform" "FeedbackPlatform" NOT NULL,
    "author" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "profileUrl" TEXT,
    "avatarUrl" TEXT,
    "date" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BuildFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "ownerType" "MediaOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "youtubeVideoId" TEXT,
    "aspectRatio" TEXT NOT NULL DEFAULT '16:9',
    "thumbnailUrl" TEXT,
    "url" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutorial" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" "TutorialCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "tips" JSONB NOT NULL DEFAULT '[]',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Tutorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialStep" (
    "id" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "TutorialStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormationGuide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "formation" TEXT NOT NULL,
    "playstyle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommendedUsage" TEXT NOT NULL,
    "tacticalInstructions" JSONB NOT NULL DEFAULT '[]',
    "strengths" JSONB NOT NULL DEFAULT '[]',
    "weaknesses" JSONB NOT NULL DEFAULT '[]',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "FormationGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormationPlayerRole" (
    "id" TEXT NOT NULL,
    "formationGuideId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FormationPlayerRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "coachingDescription" TEXT NOT NULL,
    "specialties" JSONB NOT NULL DEFAULT '[]',
    "bookingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachSocialLink" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "CoachSocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discovery" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" "DiscoveryCategory" NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "findings" JSONB,
    "author" TEXT NOT NULL,
    "sources" JSONB NOT NULL DEFAULT '[]',
    "researchStatus" "ResearchStatus" NOT NULL DEFAULT 'EXAMPLE',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Discovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedItem" (
    "id" TEXT NOT NULL,
    "contentType" "FeaturedContentType" NOT NULL,
    "contentId" TEXT NOT NULL,
    "placement" "FeaturedPlacement" NOT NULL,
    "order" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "FeaturedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(30),
    "contactMethod" "ContactMethod",
    "message" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "bookingRequestId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'CONFIRMED',
    "priceAmount" DECIMAL(10,2),
    "currency" VARCHAR(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_slug_key" ON "Player"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCard_slug_key" ON "PlayerCard"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCard_playerId_cardName_key" ON "PlayerCard"("playerId", "cardName");

-- CreateIndex
CREATE UNIQUE INDEX "Build_slug_key" ON "Build"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_key_key" ON "Attribute"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_name_key" ON "Attribute"("name");

-- CreateIndex
CREATE INDEX "BuildStatistic_buildId_isKey_idx" ON "BuildStatistic"("buildId", "isKey");

-- CreateIndex
CREATE UNIQUE INDEX "BuildStatistic_buildId_attributeId_key" ON "BuildStatistic"("buildId", "attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildStrength_buildId_order_key" ON "BuildStrength"("buildId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "BuildWeakness_buildId_order_key" ON "BuildWeakness"("buildId", "order");

-- CreateIndex
CREATE INDEX "Media_ownerType_ownerId_order_idx" ON "Media"("ownerType", "ownerId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Tutorial_slug_key" ON "Tutorial"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TutorialStep_tutorialId_order_key" ON "TutorialStep"("tutorialId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "FormationGuide_slug_key" ON "FormationGuide"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FormationPlayerRole_formationGuideId_order_key" ON "FormationPlayerRole"("formationGuideId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_slug_key" ON "Coach"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CoachSocialLink_coachId_order_key" ON "CoachSocialLink"("coachId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Discovery_slug_key" ON "Discovery"("slug");

-- CreateIndex
CREATE INDEX "FeaturedItem_placement_active_order_idx" ON "FeaturedItem"("placement", "active", "order");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedItem_contentType_contentId_placement_key" ON "FeaturedItem"("contentType", "contentId", "placement");

-- CreateIndex
CREATE INDEX "BookingRequest_coachId_status_idx" ON "BookingRequest"("coachId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Session_bookingRequestId_key" ON "Session"("bookingRequestId");

-- CreateIndex
CREATE INDEX "Session_coachId_status_idx" ON "Session"("coachId", "status");

-- AddForeignKey
ALTER TABLE "PlayerCard" ADD CONSTRAINT "PlayerCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PlayerCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildStatistic" ADD CONSTRAINT "BuildStatistic_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildStatistic" ADD CONSTRAINT "BuildStatistic_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildStrength" ADD CONSTRAINT "BuildStrength_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildWeakness" ADD CONSTRAINT "BuildWeakness_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildFeedback" ADD CONSTRAINT "BuildFeedback_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialStep" ADD CONSTRAINT "TutorialStep_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormationGuide" ADD CONSTRAINT "FormationGuide_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormationGuide" ADD CONSTRAINT "FormationGuide_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormationPlayerRole" ADD CONSTRAINT "FormationPlayerRole_formationGuideId_fkey" FOREIGN KEY ("formationGuideId") REFERENCES "FormationGuide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachSocialLink" ADD CONSTRAINT "CoachSocialLink_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discovery" ADD CONSTRAINT "Discovery_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discovery" ADD CONSTRAINT "Discovery_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedItem" ADD CONSTRAINT "FeaturedItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedItem" ADD CONSTRAINT "FeaturedItem_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_bookingRequestId_fkey" FOREIGN KEY ("bookingRequestId") REFERENCES "BookingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;
