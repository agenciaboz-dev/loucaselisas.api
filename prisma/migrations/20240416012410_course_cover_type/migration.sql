-- AlterTable
ALTER TABLE `Course` ADD COLUMN `cover_type` ENUM('video', 'image') NOT NULL DEFAULT 'image';
