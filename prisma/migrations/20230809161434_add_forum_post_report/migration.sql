-- CreateTable
CREATE TABLE "ForumPostReport" (
    "id" STRING NOT NULL,
    "reason" STRING NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" STRING NOT NULL,
    "reporterId" STRING NOT NULL,

    CONSTRAINT "ForumPostReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ForumPostReport" ADD CONSTRAINT "ForumPostReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPostReport" ADD CONSTRAINT "ForumPostReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
