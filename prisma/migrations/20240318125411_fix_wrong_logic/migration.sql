/*
  Warnings:

  - You are about to drop the `_CourseToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CourseToUser` DROP FOREIGN KEY `_CourseToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CourseToUser` DROP FOREIGN KEY `_CourseToUser_B_fkey`;

-- DropTable
DROP TABLE `_CourseToUser`;
