/*
  Warnings:

  - Added the required column `name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'IN_PROGRESS', 'READY_TO_DELIVER', 'DELIVERED', 'COMPLETED', 'ASSIGNED') NOT NULL DEFAULT 'PENDING';
