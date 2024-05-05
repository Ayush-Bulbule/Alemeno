import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLoansByCustomer = async (customer_id) => {
    try {
        const loans = await prisma.loan.findMany({
            where: {
                customer_id,
            },
        });
        return loans;
    } catch (err) {
        console.log(err);
        throw new Error("Error while fetching loans");
    }
};

export const getAvgLoanAmount = async () => {
    try {
        const avgLoanAmount = await prisma.loan.aggregate({
            _avg: {
                loan_amount: true,
            },
        });
        return avgLoanAmount._avg.loan_amount;
    } catch (err) {
        console.log(err);
        throw new Error("Error while fetching avg loan amount");
    }
};

export const getLoanById = async (loan_id) => {
    try {
        const loan = await prisma.loan.findUnique({
            where: {
                id: loan_id,
            },
        });
        return loan;
    } catch (err) {
        console.log(err);
        throw new Error("Error while fetching loan");
    }
};
export const createLoan = async (
    loan_id,
    customer_id,
    loan_amount,
    tenure,
    interest_rate,
    monthly_payment,
    emi_paid,
    approval_date,
    end_date
) => {
    try {
        const loan = await prisma.loan.create({
            data: {
                loan_id,
                customer_id,
                loan_amount,
                tenure,
                interest_rate,
                monthly_payment,
                emi_paid,
                approval_date,
                end_date,
            },
        });
        return loan;
    } catch (err) {
        console.log(err);
        throw new Error("Error while creating loan");
    }
};


// update
export const updateLoan = async (loan_id, emi_paid) => {
    try {
        const loan = await prisma.loan.update({
            where: {
                id: loan_id,
            },
            data: {
                emi_paid,
            },
        });
        return loan;
    } catch (err) {
        console.log(err);
        throw new Error("Error while updating loan");
    }
};
