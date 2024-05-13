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

-- CreateTable
CREATE TABLE `CourseView` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseView` ADD CONSTRAINT `CourseView_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseView` ADD CONSTRAINT `CourseView_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
