/*
  Warnings:

  - You are about to drop the column `role` on the `Worker` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_times_id_fkey`;

-- DropForeignKey
ALTER TABLE `Time` DROP FOREIGN KEY `Time_worker_id_fkey`;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `customer_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Time` ADD COLUMN `role` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Worker` DROP COLUMN `role`;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_times_id_fkey` FOREIGN KEY (`times_id`) REFERENCES `Time`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Time` ADD CONSTRAINT `Time_worker_id_fkey` FOREIGN KEY (`worker_id`) REFERENCES `Worker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
