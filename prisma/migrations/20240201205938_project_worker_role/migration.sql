/*
  Warnings:

  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Theme` DROP FOREIGN KEY `Theme_userId_fkey`;

-- AlterTable
ALTER TABLE `Worker` ADD COLUMN `role` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Theme`;
