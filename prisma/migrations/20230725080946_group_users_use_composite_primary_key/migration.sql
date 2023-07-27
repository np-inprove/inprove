/*
  Warnings:

  - The primary key for the `GroupUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GroupUsers` table. All the data in the column will be lost.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_GroupUsers" (
    "groupId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "role" "GroupRole" NOT NULL
);
INSERT INTO "_prisma_new_GroupUsers" ("groupId","role","userId") SELECT "groupId","role","userId" FROM "GroupUsers";
DROP TABLE "GroupUsers" CASCADE;
ALTER TABLE "_prisma_new_GroupUsers" RENAME TO "GroupUsers";
CREATE UNIQUE INDEX "GroupUsers_groupId_userId_key" ON "GroupUsers"("groupId", "userId");
ALTER TABLE "GroupUsers" ADD CONSTRAINT "GroupUsers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupUsers" ADD CONSTRAINT "GroupUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
