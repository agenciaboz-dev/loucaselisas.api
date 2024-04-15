/*
  Warnings:

  - You are about to drop the column `gallery_id` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `gallery_id` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_gallery_id_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_gallery_id_fkey`;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `gallery_id`;

-- AlterTable
ALTER TABLE `Video` DROP COLUMN `gallery_id`;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `gallery_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `Gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
