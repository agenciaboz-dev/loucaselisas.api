-- AlterTable
ALTER TABLE `Course` ADD COLUMN `chat_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Gallery` ADD COLUMN `chat_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Lesson` MODIFY `cover` TEXT NULL,
    MODIFY `video_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Chat` (
    `id` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `media_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Chat_course_id_key`(`course_id`),
    UNIQUE INDEX `Chat_media_id_key`(`media_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `datetime` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `video_id` VARCHAR(191) NULL,
    `video_timestamp` VARCHAR(191) NULL,
    `chat_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `Gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
