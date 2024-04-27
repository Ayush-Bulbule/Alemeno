/*
  Warnings:

  - Changed the type of `approval_date` on the `Loan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end_date` on the `Loan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "intrest_rate" SET DATA TYPE DECIMAL(65,30),
DROP COLUMN "approval_date",
ADD COLUMN     "approval_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "end_date",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL;
