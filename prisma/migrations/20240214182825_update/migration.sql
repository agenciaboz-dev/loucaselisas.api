/*
  Warnings:

  - Added the required column `description` to the `Creator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Creator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Creator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Creator` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `language` VARCHAR(191) NOT NULL,
    ADD COLUMN `nickname` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `admin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `cover` TEXT NULL,
    ADD COLUMN `uf` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `creator_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseToUser_AB_unique`(`A`, `B`),
    INDEX `_CourseToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_favorite_courses` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_favorite_courses_AB_unique`(`A`, `B`),
    INDEX `_favorite_courses_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_favorite_creators` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_favorite_creators_AB_unique`(`A`, `B`),
    INDEX `_favorite_creators_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToCreator` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CategoryToCreator_AB_unique`(`A`, `B`),
    INDEX `_CategoryToCreator_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `Creator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToUser` ADD CONSTRAINT `_CourseToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToUser` ADD CONSTRAINT `_CourseToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_favorite_courses` ADD CONSTRAINT `_favorite_courses_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_favorite_courses` ADD CONSTRAINT `_favorite_courses_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_favorite_creators` ADD CONSTRAINT `_favorite_creators_A_fkey` FOREIGN KEY (`A`) REFERENCES `Creator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_favorite_creators` ADD CONSTRAINT `_favorite_creators_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToCreator` ADD CONSTRAINT `_CategoryToCreator_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToCreator` ADD CONSTRAINT `_CategoryToCreator_B_fkey` FOREIGN KEY (`B`) REFERENCES `Creator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
