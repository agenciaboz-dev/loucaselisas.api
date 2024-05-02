/*
  Warnings:

  - You are about to drop the column `admin_permissions_id` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `general_permissions_id` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `profile_permissions_id` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `AdminPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeneralPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfilePermissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[permissions_id]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `permissions_id` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_admin_permissions_id_fkey`;

-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_general_permissions_id_fkey`;

-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_profile_permissions_id_fkey`;

-- AlterTable
ALTER TABLE `Role` DROP COLUMN `admin_permissions_id`,
    DROP COLUMN `general_permissions_id`,
    DROP COLUMN `profile_permissions_id`,
    ADD COLUMN `permissions_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `AdminPermissions`;

-- DropTable
DROP TABLE `GeneralPermissions`;

-- DropTable
DROP TABLE `ProfilePermissions`;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NULL,
    `panelTab` BOOLEAN NOT NULL,
    `creatorTab` BOOLEAN NOT NULL,
    `searchTab` BOOLEAN NOT NULL,
    `favoritesTab` BOOLEAN NOT NULL,
    `configTab` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Role_permissions_id_key` ON `Role`(`permissions_id`);

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_permissions_id_fkey` FOREIGN KEY (`permissions_id`) REFERENCES `Permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
