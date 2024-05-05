-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "monthly_salary" BIGINT NOT NULL,
    "approved_limit" BIGINT NOT NULL,
    "current_debt" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "loan_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "loan_amount" BIGINT NOT NULL,
    "tenure" INTEGER NOT NULL,
    "interest_rate" INTEGER NOT NULL,
    "monthly_payment" INTEGER NOT NULL,
    "emi_paid" INTEGER NOT NULL,
    "approval_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
