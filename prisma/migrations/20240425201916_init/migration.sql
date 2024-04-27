/*
  Warnings:

  - You are about to drop the column `intrest_rate` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `interest_rate` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "monthly_salary" SET DATA TYPE BIGINT,
ALTER COLUMN "approved_limit" SET DATA TYPE BIGINT,
ALTER COLUMN "current_debt" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "intrest_rate",
ADD COLUMN     "interest_rate" INTEGER NOT NULL;
