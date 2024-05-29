/*
  Warnings:

  - You are about to alter the column `duration` on the `Media` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Media` MODIFY `duration` DOUBLE NOT NULL DEFAULT 0;
