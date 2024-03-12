/*
  Warnings:

  - Added the required column `admin_permissions_id` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `general_permissions_id` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_permissions_id` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Role` ADD COLUMN `admin_permissions_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `general_permissions_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `profile_permissions_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ProfilePermissions` (
    `id` VARCHAR(191) NOT NULL,
    `viewMembers` BOOLEAN NOT NULL DEFAULT false,
    `privacyProfile` BOOLEAN NOT NULL DEFAULT false,
    `viewPrivacyProfile` BOOLEAN NOT NULL DEFAULT false,
    `indexProfile` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminPermissions` (
    `id` VARCHAR(191) NOT NULL,
    `panelAdm` BOOLEAN NOT NULL DEFAULT false,
    `panelCreator` BOOLEAN NOT NULL DEFAULT false,
    `createChats` BOOLEAN NOT NULL DEFAULT false,
    `deleteComments` BOOLEAN NOT NULL DEFAULT false,
    `panelStatistics` BOOLEAN NOT NULL DEFAULT false,
    `updateUsers` BOOLEAN NOT NULL DEFAULT false,
    `deleteUsers` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneralPermissions` (
    `id` VARCHAR(191) NOT NULL,
    `editProfile` BOOLEAN NOT NULL DEFAULT false,
    `deleteProfile` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_profile_permissions_id_fkey` FOREIGN KEY (`profile_permissions_id`) REFERENCES `ProfilePermissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_admin_permissions_id_fkey` FOREIGN KEY (`admin_permissions_id`) REFERENCES `AdminPermissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_general_permissions_id_fkey` FOREIGN KEY (`general_permissions_id`) REFERENCES `GeneralPermissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
