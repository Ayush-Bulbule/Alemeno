-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "monthly_salary" BIGINT NOT NULL,
    "approved_limit" BIGINT NOT NULL,
    "current_debt" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Loan" (
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

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("loan_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_id_key" ON "Customer"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Loan_loan_id_key" ON "Loan"("loan_id");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
