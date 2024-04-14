/*
  Warnings:

  - You are about to drop the column `plan_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_plan_id_fkey`;

-- AlterTable
ALTER TABLE `Plan` ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `User` DROP COLUMN `plan_id`;

-- CreateTable
CREATE TABLE `PlanContract` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` VARCHAR(191) NOT NULL,
    `end_date` VARCHAR(191) NOT NULL,
    `paid` DOUBLE NOT NULL,
    `plan_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PlanContract_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanContract` ADD CONSTRAINT `PlanContract_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanContract` ADD CONSTRAINT `PlanContract_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
