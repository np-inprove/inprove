-- CreateTable
CREATE TABLE "UserCompletedDeadlines" (
    "id" STRING NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadlineId" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "UserCompletedDeadlines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCompletedDeadlines_deadlineId_userId_key" ON "UserCompletedDeadlines"("deadlineId", "userId");

-- AddForeignKey
ALTER TABLE "UserCompletedDeadlines" ADD CONSTRAINT "UserCompletedDeadlines_deadlineId_fkey" FOREIGN KEY ("deadlineId") REFERENCES "Deadline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompletedDeadlines" ADD CONSTRAINT "UserCompletedDeadlines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
