/*
  Warnings:

  - You are about to drop the column `creator_id` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gallery_id]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cover` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gallery_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `published` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_creator_id_fkey`;

-- AlterTable
ALTER TABLE `Course` DROP COLUMN `creator_id`,
    ADD COLUMN `cover` TEXT NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `gallery_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `language` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `owner_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `published` VARCHAR(191) NOT NULL,
    ADD COLUMN `recorder` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `instagram` VARCHAR(191) NULL,
    ADD COLUMN `profession` VARCHAR(191) NULL,
    ADD COLUMN `tiktok` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Gallery` (
    `id` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `gallery_id` VARCHAR(191) NULL,
    `lesson_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Image_lesson_id_key`(`lesson_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `gallery_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `published` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cover` VARCHAR(191) NULL,
    `info` TEXT NOT NULL,
    `pdf` VARCHAR(191) NULL,
    `video_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Lesson_video_id_key`(`video_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToCreator` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseToCreator_AB_unique`(`A`, `B`),
    INDEX `_CourseToCreator_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToCourse` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CategoryToCourse_AB_unique`(`A`, `B`),
    INDEX `_CategoryToCourse_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Course_gallery_id_key` ON `Course`(`gallery_id`);

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_id_fkey` FOREIGN KEY (`id`) REFERENCES `Creator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `Gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `Gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `Gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_video_id_fkey` FOREIGN KEY (`video_id`) REFERENCES `Video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToCreator` ADD CONSTRAINT `_CourseToCreator_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToCreator` ADD CONSTRAINT `_CourseToCreator_B_fkey` FOREIGN KEY (`B`) REFERENCES `Creator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToCourse` ADD CONSTRAINT `_CategoryToCourse_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToCourse` ADD CONSTRAINT `_CategoryToCourse_B_fkey` FOREIGN KEY (`B`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
