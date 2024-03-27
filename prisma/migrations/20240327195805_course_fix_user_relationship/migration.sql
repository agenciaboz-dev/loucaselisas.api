-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_id_fkey`;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `Creator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
