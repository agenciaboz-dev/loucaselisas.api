/*
  Warnings:

  - You are about to alter the column `type` on the `Paymentcard` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Paymentcard` MODIFY `type` ENUM('CREDIT', 'DEBIT') NOT NULL;
