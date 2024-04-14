/*
  Warnings:

  - Added the required column `user_history_id` to the `PlanContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PlanContract` ADD COLUMN `user_history_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `PlanContract` ADD CONSTRAINT `PlanContract_user_history_id_fkey` FOREIGN KEY (`user_history_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
