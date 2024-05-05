import { PrismaClient } from "@prisma/client";
import * as customerService from "../services/customerService.js";
import * as loanService from "../services/loanService.js";
import * as loanApprovalService from "../services/loanApprovalService.js";
import * as creditScoreService from "../services/creditScoreService.js";
// const prisma = new PrismaClient(); // some suggests to pass the prisma client aslso as dependency injection

export const checkEligibility = async (req, res) => {
  try {
    // a. Customer should exist
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

    const customer = await customerService.getCustomerById(customer_id);

    if (!customer) {
      return res.status(400).json({
        message: "Customer not found",
      });
    }

    // b. Get all loans of the customer
    const loans = await loanService.getAllLoansByCustomer(customer_id);

    console.log("Loans: ", loans.length);

    // c. Calculate credit score
    const creditScore = await creditScoreService.calculateCreditScore(
      customer,
      loans,
      loanService
    );

    // Calculate the current EMI's of the customer
    let totalEMI = 0;
    loans.forEach((loan) => {
      // Check if the loan is still active
      if (loan.tenure > loan.emi_paid) {
        totalEMI += loan.monthly_payment;
      }
    });

    const { approved, interestRate } = loanApprovalService.approveLoan(
      customer,
      creditScore,
      loan_amount,
      totalEMI
    );

    console.log("Approved: ", approved);
    console.log("Interest Rate: ", interestRate);

    // if approved calculate the EMI using the amount, interest rate and tenure

    if (approved) {
      const emi = loanApprovalService.calculateEMI(
        loan_amount,
        interestRate,
        tenure
      );
      console.log("EMI: ", emi);
      res
        .status(200)
        .json({
          customer_id: customer_id,
          approval: approved,
          interestRate,
          creditScore: creditScore,
          emi,
        });
    } else {
      res
        .status(200)
        .json({
          customer_id: customer_id,
          approval: approved,
          interestRate,
          creditScore: creditScore,
        });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2 - Create a loan - /create-loan
export const createLoan = async (req, res)=>{
  try{
      const {customer_id,loan_amount,interest_rate, tenure}  = req.body;
      const customer = await customerService.getCustomerById(customer_id);
      if(!customer){
        return res.status(400).json({message: "Customer not found"});
      }
      const loans = await loanService.getAllLoansByCustomer(customer_id);
      const creditScore = await creditScoreService.calculateCreditScore(customer, loans, loanService);
      let totalEMI = 0;
      loans.forEach((loan)=>{
        if(loan.tenure > loan.emi_paid){
          totalEMI += loan.monthly_payment;
        }
      });


      const {approved, interestRate} = loanApprovalService.approveLoan(customer, creditScore, loan_amount, totalEMI);

      if(approved){
        // create a unique id 4 digit
        const loan_id = Math.floor(1000 + Math.random() * 9000);
        const emi_paid = 0;

        //calculate monthly payment
        const monthly_payment = loanApprovalService.calculateEMI(loan_amount, interestRate, tenure);

        //calculate end date on basis of the tenure 
        const end_date = new Date();
        end_date.setMonth(end_date.getMonth() + tenure);

        const loan = await loanService.createLoan(
          loan_id,
          customer_id,
          loan_amount,
          tenure,
          interestRate,
          monthly_payment,
          emi_paid,
          new Date(),
          end_date
        );
        res.status(201).json({message: "Loan approved", loan});
      }
      else{
        res.status(400).json({message: "Loan not approved"});
      }
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// 3. View a loan - /view-loan/:loan_id
export const viewLoan = async(req, res)=>{
  try{
    const {loan_id} =req.params;

    const loan = await loanService.getLoanById(Number(loan_id));

    if(!loan){
      return res.status(404).json({message: "Loan not found"});
    }

    res.status(200).json({loan});
  }catch(err){
    console.log("Error while fetching loan");
    console.log(err);
  }
}

// 4. Make payment - /make-payment/:customer_id/:loan_id

export const makePayment = async(req, res)=>{
  try{
    const {customer_id, loan_id} = req.params;
    console.log("Customer ID: ", customer_id);
    console.log("Loan ID: ", loan_id);

    //Get the customer
    const customer = await customerService.getCustomerById(Number(customer_id));
    if(!customer){
      return res.status(400).json({message: "Customer not found"});
    }
    const loan = await loanService.getLoanById(Number(loan_id));
    if(!loan){
      return res.status(400).json({message: "Loan not found"});
    }

    // Check if the customer is the owner of the loan
    if(loan.customer_id !== Number(customer_id)){
      return res.status(400).json({message: "Customer is not the owner of the loan"});
    }

    // Check if the loan is already paid
    if(loan.tenure === loan.emi_paid){
      return res.status(400).json({message: "Loan already paid"});
    }

    // Check if the loan is active
    if(loan.tenure <= loan.emi_paid){
      return res.status(400).json({message: "Loan is not active"});
    }

    // Make the payment
    loan.emi_paid += 1;
    await loanService.updateLoan(loan.id, loan.emi_paid);

    res.status(200).json({message: "Payment successful", loan});


  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// 5. View statement - /view-statement/:customer_id/:loan_id
export const viewStatement = async(req, res)=>{
  try{
    const {customer_id, loan_id} = req.params;

    const customer = await customerService.getCustomerById(Number(customer_id));
    if(!customer){
      return res.status(400).json({message: "Customer not found"});
    }

    const loan = await loanService.getLoanById(Number(loan_id));
    if(!loan){
      return res.status(400).json({message: "Loan not found"});
    }

    if(loan.customer_id !== Number(customer_id)){
      return res.status(400).json({message: "Customer is not the owner of the loan"});
    }

    const statement = {
      principal_amount: loan.loan_amount,
      interest_rate: loan.interest_rate,
      amount_paid:Math.round(loan.emi_paid * loan.monthly_payment*100)/100,
      monthly_installment: Math.round(loan.monthly_payment*100)/100,
      remaining_repayments: loan.tenure - loan.emi_paid
    }
    console.log("Statement: ", statement);
    res.status(200).json({customer_id, loan_id, principal:statement.principal_amount,amount_paid: statement.amount_paid, monthly_installment: statement.monthly_installment, repayments_left: statement.remaining_repayments});
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}