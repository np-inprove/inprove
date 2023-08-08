-- CreateTable
CREATE TABLE "Redemption" (
    "id" STRING NOT NULL,
    "voucherId" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
