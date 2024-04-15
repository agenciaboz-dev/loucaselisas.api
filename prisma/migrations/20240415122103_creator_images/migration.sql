-- AlterTable
ALTER TABLE `Creator` ADD COLUMN `cover` TEXT NULL,
    ADD COLUMN `image` TEXT NULL,
    MODIFY `description` TEXT NOT NULL;
