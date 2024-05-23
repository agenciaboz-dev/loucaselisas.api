/*
  Warnings:

  - A unique constraint covering the columns `[media_id]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Message` ADD COLUMN `media_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Message_media_id_key` ON `Message`(`media_id`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
