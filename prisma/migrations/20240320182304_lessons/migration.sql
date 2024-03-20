/*
  Warnings:

  - You are about to drop the column `video_id` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lesson_id]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Lesson` DROP FOREIGN KEY `Lesson_video_id_fkey`;

-- AlterTable
ALTER TABLE `Lesson` DROP COLUMN `video_id`;

-- AlterTable
ALTER TABLE `Video` ADD COLUMN `lesson_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Video_lesson_id_key` ON `Video`(`lesson_id`);

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
