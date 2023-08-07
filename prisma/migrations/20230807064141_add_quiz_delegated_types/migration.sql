/*
  Warnings:

  - You are about to drop the column `descrption` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('File', 'Text', 'Options');

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "descrption";
ALTER TABLE "Question" ADD COLUMN     "description" STRING NOT NULL;
ALTER TABLE "Question" ADD COLUMN     "points" INT4 NOT NULL;
ALTER TABLE "Question" ADD COLUMN     "type" "QuestionType" NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "questionOrder" STRING[];

-- DropTable
DROP TABLE "Option";

-- CreateTable
CREATE TABLE "FileQuestion" (
    "id" STRING NOT NULL,

    CONSTRAINT "FileQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextQuestion" (
    "id" STRING NOT NULL,
    "answer" STRING NOT NULL,

    CONSTRAINT "TextQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionsQuestion" (
    "id" STRING NOT NULL,
    "options" STRING[],
    "correctOptions" INT4[],

    CONSTRAINT "OptionsQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" STRING NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quizId" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" STRING NOT NULL,
    "attemptId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "questionId" STRING NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAnswer" (
    "id" STRING NOT NULL,
    "fileUrl" STRING NOT NULL,

    CONSTRAINT "FileAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextAnswer" (
    "id" STRING NOT NULL,
    "answer" STRING NOT NULL,

    CONSTRAINT "TextAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionsAnswer" (
    "id" STRING NOT NULL,
    "options" INT4[],

    CONSTRAINT "OptionsAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
