/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `ForumPostReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ForumPostReaction_postId_userId_key" ON "ForumPostReaction"("postId", "userId");
