/*
  Warnings:

  - You are about to drop the column `repeat` on the `Event` table. All the data in the column will be lost.
  - Added the required column `rrule` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "repeat";
ALTER TABLE "Event" ADD COLUMN     "rrule" STRING NOT NULL;
