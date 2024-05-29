-- CreateTable
CREATE TABLE `LessonWatched` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `watchedTime` VARCHAR(191) NOT NULL,
    `lesson_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LessonWatched` ADD CONSTRAINT `LessonWatched_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonWatched` ADD CONSTRAINT `LessonWatched_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
