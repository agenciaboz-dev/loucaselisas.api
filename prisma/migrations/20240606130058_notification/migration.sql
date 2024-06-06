-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `to` TEXT NOT NULL,
    `viewed` TEXT NOT NULL,
    `body` TEXT NOT NULL,
    `datetime` VARCHAR(191) NOT NULL,
    `target_route` VARCHAR(191) NOT NULL,
    `target_param` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
