/*
  Warnings:

  - The primary key for the `Loan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_pkey",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Loan_pkey" PRIMARY KEY ("id");
