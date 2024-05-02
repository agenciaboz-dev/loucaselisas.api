-- AlterTable
ALTER TABLE `Course` ADD COLUMN `status` ENUM('active', 'pending', 'disabled', 'declined') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `status` ENUM('active', 'pending', 'disabled', 'declined') NOT NULL DEFAULT 'pending';
