/*
  Warnings:

  - You are about to drop the `_TimeToWorker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_TimeToWorker` DROP FOREIGN KEY `_TimeToWorker_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TimeToWorker` DROP FOREIGN KEY `_TimeToWorker_B_fkey`;

-- AlterTable
ALTER TABLE `Time` ADD COLUMN `worker_id` INTEGER NULL;

-- DropTable
DROP TABLE `_TimeToWorker`;

-- AddForeignKey
ALTER TABLE `Time` ADD CONSTRAINT `Time_worker_id_fkey` FOREIGN KEY (`worker_id`) REFERENCES `Worker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
