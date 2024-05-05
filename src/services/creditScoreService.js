// services/creditScoreService.js

// i. Past Loans paid on time
// ii. No of loans taken in past
// iii. Loan activity in current year
// iv. Loan approved volume
// v. If sum of current loans of customer > approved limit of
// customer, credit score = 0
// You must come up with a working scheme assigns a credit
// score to each user based on above listed components.
// Note: - Credit Score cannot be fractional

const calculatePastLoan = (loan) => {
  const end_date = new Date(loan.end_date);
  // compare now and end date/
  console.log(end_date < Date.now());
  if (loan.tenure == loan.emi_paid) {
    console.log("loan.tenure == loan.emi_paid");
    return 10;
  } else if (loan.tenure > loan.emi_paid && end_date > Date.now()) {
    console.log("loan.tenure > loan.emi_paid && end_date > Date.now()");
    return 10;
  } else if (loan.tenure > loan.emi_paid && end_date < Date.now()) {
    console.log("loan.tenure > loan.emi_paid && end_date < Date.now()");
    return 0;
  }
};

// 1. Get score based on past loans
const calculatePastLoansPaidOnTimeScore = (loans) => {
  let score = 0;

  //Loop throught the loans
  loans.forEach((loan) => {
    score += calculatePastLoan(loan);
  });

  return score;
};

// 2. Get score based on number of loans
const calculateNumberOfLoansScore = (loans) => {
  if (loans.length > 5) {
    console.log("loans.length > 5")
    return 5;
  } else if (loans.length > 3) {
    console.log("loans.length > 3")
    return 10;
  } else if (loans.length > 1) {
    console.log("loans.length > 1")
    return 15;
  } else {
    console.log("loans.length < 1")
    return 20;
  }
};

// 3. Get score based on loan activity
const calculateLoanActivityScore = (loans) => {
  let currentYear = new Date().getFullYear() - 1;
  let loan_count = 0;

  //caluculate total no of lons taken in the current year
  loans.forEach((loan) => {
    if (new Date(loan.start_date).getFullYear() == currentYear) {
      loan_count++;
    }
  });

  if (loan_count > 5) {
    return 0;
  } else if (loan_count > 3) {
    return 5;
  } else if (loan_count > 1) {
    return 10;
  } else {
    return 15;
  }
};

// 4. Function to check eligibility
const calculateLoanApprovedVolumeScore = (loans, avgLoanAmount) => {
  let totalLoanAmount = 0;
  loans.forEach((loan) => {
    totalLoanAmount += Number(loan.loan_amount); // BigInt conversion err
  });

  if (totalLoanAmount > avgLoanAmount) {
    return 15;
  } else if (totalLoanAmount > avgLoanAmount / 2) {
    return 10;
  } else {
    return 5;
  }
};

// Main function to calculate credit score
export const calculateCreditScore = async (customer, loans, loanService) => {
  try {
    let creditScore = 0;

    // Get approved loan amount
    const approvedLoanAmount = customer.approved_limit;

    const sumOfLoans = loans.reduce((acc, loan) => {
      return acc + loan.loan_amount;
    });

    if (sumOfLoans > approvedLoanAmount) {
      console.log("sum of loans is greater than approved limit", customer.id);
      return (creditScore = 0);
    }

    // Get average loan amount
    const avgLoanAmount = await loanService.getAvgLoanAmount();

    creditScore += calculatePastLoansPaidOnTimeScore(loans);
    creditScore += calculateNumberOfLoansScore(loans);
    creditScore += calculateLoanActivityScore(loans);
    creditScore += calculateLoanApprovedVolumeScore(loans, avgLoanAmount);

    // round the credit score betweeen 0-100 // we will not use this as of now
    // we can apply normalization later to scale the score
    // creditScore = Math.round(creditScore / 4);

    return creditScore;
  } catch (err) {
    console.log("Error in credit score calculation", err);
    return 0;
  }
};
