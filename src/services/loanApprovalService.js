export const approveLoan = (customer, creditScore, totalEMI) => {
    let approved = false;
    let interestRate = 0;


    if (totalEMI > Number(customer.monthly_salary) / 2) {
        // If total EMI exceeds 50% of monthly salary, don't approve the loan
        console.log("EMI exceeds 50% of monthly salary. So loan is not approved");
        return { approved, interestRate };
    }

    if (creditScore > 50) {
        approved = true;
        interestRate = 8;
    } else if (creditScore > 30) {
        approved = true;
        interestRate = 12;
    } else if (creditScore > 10) {
        approved = true;
        interestRate = 16;
    }

    return { approved, interestRate };
}; 

export const calculateEMI = (loan_amount, interestRate, tenure) => {
    let rate = interestRate / 12 / 100;
    let emi = loan_amount * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
    return emi;
};