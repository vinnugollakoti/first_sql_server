/*
  Warnings:

  - You are about to drop the column `targetYear` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `_StudentNotifications` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `college` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `year` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_StudentNotifications" DROP CONSTRAINT "_StudentNotifications_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentNotifications" DROP CONSTRAINT "_StudentNotifications_B_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "targetYear";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "college" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
DROP COLUMN "year",
ADD COLUMN     "year" "Year" NOT NULL;

-- DropTable
DROP TABLE "_StudentNotifications";

-- CreateTable
CREATE TABLE "NotificationTarget" (
    "id" SERIAL NOT NULL,
    "year" "Year" NOT NULL,
    "notificationId" INTEGER NOT NULL,

    CONSTRAINT "NotificationTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationTarget_year_idx" ON "NotificationTarget"("year");

-- AddForeignKey
ALTER TABLE "NotificationTarget" ADD CONSTRAINT "NotificationTarget_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
