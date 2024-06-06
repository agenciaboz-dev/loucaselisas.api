/*
  Warnings:

  - You are about to drop the column `to` on the `Notification` table. All the data in the column will be lost.
  - You are about to alter the column `viewed` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `TinyInt`.
  - Added the required column `user_id` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `to`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    MODIFY `viewed` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
