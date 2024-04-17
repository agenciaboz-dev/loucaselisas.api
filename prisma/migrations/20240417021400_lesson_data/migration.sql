/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[media_id]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `media_id` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_lesson_id_fkey`;

-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `media_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Media` ADD COLUMN `lesson_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Image`;

-- DropTable
DROP TABLE `Video`;

-- CreateTable
CREATE TABLE `_views-relation` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_views-relation_AB_unique`(`A`, `B`),
    INDEX `_views-relation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LessonToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LessonToUser_AB_unique`(`A`, `B`),
    INDEX `_LessonToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_downloads-relation` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_downloads-relation_AB_unique`(`A`, `B`),
    INDEX `_downloads-relation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Lesson_media_id_key` ON `Lesson`(`media_id`);

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_views-relation` ADD CONSTRAINT `_views-relation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_views-relation` ADD CONSTRAINT `_views-relation_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonToUser` ADD CONSTRAINT `_LessonToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonToUser` ADD CONSTRAINT `_LessonToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_downloads-relation` ADD CONSTRAINT `_downloads-relation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_downloads-relation` ADD CONSTRAINT `_downloads-relation_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
