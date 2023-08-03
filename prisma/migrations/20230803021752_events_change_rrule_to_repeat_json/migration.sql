/*
  Warnings:

  - You are about to drop the column `rrule` on the `Event` table. All the data in the column will be lost.
  - Added the required column `repeat` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "rrule";
ALTER TABLE "Event" ADD COLUMN     "repeat" JSONB NOT NULL;
