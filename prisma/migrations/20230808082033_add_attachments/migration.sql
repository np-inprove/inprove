/*
  Warnings:

  - You are about to drop the column `content` on the `ForumPost` table. All the data in the column will be lost.
  - Added the required column `richContent` to the `ForumPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForumPost" DROP COLUMN "content";
ALTER TABLE "ForumPost" ADD COLUMN     "richContent" STRING NOT NULL;

-- CreateTable
CREATE TABLE "ForumPostAttachment" (
    "id" STRING NOT NULL,
    "forumPostId" STRING,
    "url" STRING NOT NULL,
    "displayName" STRING,

    CONSTRAINT "ForumPostAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ForumPostAttachment" ADD CONSTRAINT "ForumPostAttachment_forumPostId_fkey" FOREIGN KEY ("forumPostId") REFERENCES "ForumPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
