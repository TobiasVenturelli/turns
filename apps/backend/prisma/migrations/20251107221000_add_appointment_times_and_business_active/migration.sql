/*
  Warnings:

  - Added the required column `endTime` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "appointments_startTime_idx" ON "appointments"("startTime");
