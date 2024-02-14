/*
  Warnings:

  - Added the required column `cover` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `cover` TEXT NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
