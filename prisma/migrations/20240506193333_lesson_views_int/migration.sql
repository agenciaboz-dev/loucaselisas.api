/*
  Warnings:

  - You are about to drop the `_views-relation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_views-relation` DROP FOREIGN KEY `_views-relation_A_fkey`;

-- DropForeignKey
ALTER TABLE `_views-relation` DROP FOREIGN KEY `_views-relation_B_fkey`;

-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `_views-relation`;
