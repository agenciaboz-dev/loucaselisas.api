-- AlterTable
ALTER TABLE `Category` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Plan` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;
