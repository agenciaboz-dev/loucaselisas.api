/*
  Warnings:

  - The values [VIDEO,IMAGE] on the enum `Media_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Media` MODIFY `type` ENUM('video', 'image') NOT NULL;
