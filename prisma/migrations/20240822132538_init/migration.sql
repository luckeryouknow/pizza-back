/*
  Warnings:

  - The values [DELIVERED] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('PENDING', 'IN_PROGRESS', 'READY_TO_DELIVER', 'COMPLETED', 'ASSIGNED') NOT NULL DEFAULT 'PENDING';
