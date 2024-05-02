-- AlterTable
ALTER TABLE `Course` ADD COLUMN `declined_reason` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `declined_reason` VARCHAR(191) NULL;
