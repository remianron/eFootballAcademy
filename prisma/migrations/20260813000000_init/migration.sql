-- CreateTable
CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER') NOT NULL DEFAULT 'OWNER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Player_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerCard` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `cardName` VARCHAR(255) NOT NULL,
    `rarity` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL,
    `overall` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PlayerCard_slug_key`(`slug`),
    UNIQUE INDEX `PlayerCard_playerId_cardName_key`(`playerId`, `cardName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Build` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `buildName` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `philosophy` TEXT NOT NULL,
    `playstyle` VARCHAR(191) NULL,
    `skills` JSON NOT NULL,
    `recommendedFor` JSON NOT NULL,
    `avoidFor` JSON NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `Build_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attribute` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('OFFENSIVE', 'DEFENSIVE', 'PHYSICAL', 'GOALKEEPER') NOT NULL,
    `sortIndex` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Attribute_key_key`(`key`),
    UNIQUE INDEX `Attribute_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuildStatistic` (
    `id` VARCHAR(191) NOT NULL,
    `buildId` VARCHAR(191) NOT NULL,
    `attributeId` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `isKey` BOOLEAN NOT NULL DEFAULT false,
    `keyOrder` INTEGER NULL,

    INDEX `BuildStatistic_buildId_isKey_idx`(`buildId`, `isKey`),
    UNIQUE INDEX `BuildStatistic_buildId_attributeId_key`(`buildId`, `attributeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuildStrength` (
    `id` VARCHAR(191) NOT NULL,
    `buildId` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `BuildStrength_buildId_order_key`(`buildId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuildWeakness` (
    `id` VARCHAR(191) NOT NULL,
    `buildId` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `BuildWeakness_buildId_order_key`(`buildId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuildFeedback` (
    `id` VARCHAR(191) NOT NULL,
    `buildId` VARCHAR(191) NOT NULL,
    `platform` ENUM('YOUTUBE', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK') NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `comment` TEXT NOT NULL,
    `profileUrl` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `ownerType` ENUM('BUILD', 'TUTORIAL', 'FORMATION_GUIDE', 'DISCOVERY', 'COACH') NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `kind` ENUM('YOUTUBE_VIDEO', 'IMAGE', 'GIF') NOT NULL,
    `youtubeVideoId` VARCHAR(191) NULL,
    `aspectRatio` VARCHAR(191) NOT NULL DEFAULT '16:9',
    `thumbnailUrl` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `alt` VARCHAR(191) NULL,
    `caption` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Media_ownerType_ownerId_order_idx`(`ownerType`, `ownerId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tutorial` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` ENUM('FREE_KICKS', 'SKILLS', 'DRIBBLING', 'PASSING', 'SHOOTING', 'CORNERS', 'MECHANICS') NOT NULL,
    `description` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `difficulty` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL,
    `tips` JSON NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `Tutorial_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TutorialStep` (
    `id` VARCHAR(191) NOT NULL,
    `tutorialId` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `TutorialStep_tutorialId_order_key`(`tutorialId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormationGuide` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `formation` VARCHAR(191) NOT NULL,
    `playstyle` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `recommendedUsage` TEXT NOT NULL,
    `tacticalInstructions` JSON NOT NULL,
    `strengths` JSON NOT NULL,
    `weaknesses` JSON NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `FormationGuide_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormationPlayerRole` (
    `id` VARCHAR(191) NOT NULL,
    `formationGuideId` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `FormationPlayerRole_formationGuideId_order_key`(`formationGuideId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coach` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bio` TEXT NOT NULL,
    `coachingDescription` TEXT NOT NULL,
    `specialties` JSON NOT NULL,
    `bookingEnabled` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `Coach_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachSocialLink` (
    `id` VARCHAR(191) NOT NULL,
    `coachId` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `CoachSocialLink_coachId_order_key`(`coachId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discovery` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` ENUM('EFOOTBALL_SCIENCE', 'EXPERIMENTS', 'COMMUNITY', 'MECHANICS', 'UPDATES', 'META') NOT NULL,
    `excerpt` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `findings` JSON NULL,
    `author` VARCHAR(191) NOT NULL,
    `sources` JSON NOT NULL,
    `researchStatus` ENUM('EXAMPLE', 'FIELD_VERIFIED') NOT NULL DEFAULT 'EXAMPLE',
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `Discovery_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeaturedItem` (
    `id` VARCHAR(191) NOT NULL,
    `contentType` ENUM('BUILD', 'TUTORIAL', 'FORMATION_GUIDE', 'DISCOVERY', 'COACH') NOT NULL,
    `contentId` VARCHAR(191) NOT NULL,
    `placement` ENUM('HERO', 'FEATURED', 'SIDEBAR', 'LATEST') NOT NULL,
    `order` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,

    INDEX `FeaturedItem_placement_active_order_idx`(`placement`, `active`, `order`),
    UNIQUE INDEX `FeaturedItem_contentType_contentId_placement_key`(`contentType`, `contentId`, `placement`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingRequest` (
    `id` VARCHAR(191) NOT NULL,
    `coachId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `contactMethod` ENUM('EMAIL', 'PHONE') NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('NEW', 'CONTACTED', 'CLOSED') NOT NULL DEFAULT 'NEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BookingRequest_coachId_status_idx`(`coachId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `bookingRequestId` VARCHAR(191) NOT NULL,
    `coachId` VARCHAR(191) NOT NULL,
    `scheduledAt` DATETIME(3) NOT NULL,
    `durationMinutes` INTEGER NOT NULL,
    `status` ENUM('CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    `priceAmount` DECIMAL(10, 2) NULL,
    `currency` VARCHAR(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_bookingRequestId_key`(`bookingRequestId`),
    INDEX `Session_coachId_status_idx`(`coachId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlayerCard` ADD CONSTRAINT `PlayerCard_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `PlayerCard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Build` ADD CONSTRAINT `Build_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuildStatistic` ADD CONSTRAINT `BuildStatistic_buildId_fkey` FOREIGN KEY (`buildId`) REFERENCES `Build`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuildStatistic` ADD CONSTRAINT `BuildStatistic_attributeId_fkey` FOREIGN KEY (`attributeId`) REFERENCES `Attribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuildStrength` ADD CONSTRAINT `BuildStrength_buildId_fkey` FOREIGN KEY (`buildId`) REFERENCES `Build`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuildWeakness` ADD CONSTRAINT `BuildWeakness_buildId_fkey` FOREIGN KEY (`buildId`) REFERENCES `Build`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuildFeedback` ADD CONSTRAINT `BuildFeedback_buildId_fkey` FOREIGN KEY (`buildId`) REFERENCES `Build`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutorial` ADD CONSTRAINT `Tutorial_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutorial` ADD CONSTRAINT `Tutorial_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TutorialStep` ADD CONSTRAINT `TutorialStep_tutorialId_fkey` FOREIGN KEY (`tutorialId`) REFERENCES `Tutorial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormationGuide` ADD CONSTRAINT `FormationGuide_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormationGuide` ADD CONSTRAINT `FormationGuide_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormationPlayerRole` ADD CONSTRAINT `FormationPlayerRole_formationGuideId_fkey` FOREIGN KEY (`formationGuideId`) REFERENCES `FormationGuide`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachSocialLink` ADD CONSTRAINT `CoachSocialLink_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `Coach`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discovery` ADD CONSTRAINT `Discovery_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discovery` ADD CONSTRAINT `Discovery_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeaturedItem` ADD CONSTRAINT `FeaturedItem_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeaturedItem` ADD CONSTRAINT `FeaturedItem_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingRequest` ADD CONSTRAINT `BookingRequest_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `Coach`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_bookingRequestId_fkey` FOREIGN KEY (`bookingRequestId`) REFERENCES `BookingRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `Coach`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
