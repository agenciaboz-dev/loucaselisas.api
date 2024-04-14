/*
  Warnings:

  - You are about to drop the column `user_history_id` on the `PlanContract` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `PlanContract` DROP FOREIGN KEY `PlanContract_user_history_id_fkey`;

-- AlterTable
ALTER TABLE `PlanContract` DROP COLUMN `user_history_id`;

-- CreateTable
CREATE TABLE `ContractLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` VARCHAR(191) NOT NULL,
    `end_date` VARCHAR(191) NOT NULL,
    `paid` DOUBLE NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `plan_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContractLogs` ADD CONSTRAINT `ContractLogs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContractLogs` ADD CONSTRAINT `ContractLogs_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
