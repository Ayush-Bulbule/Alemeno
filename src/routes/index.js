import express, { Router } from "express";
import { ingestLoanData, ingestCustomerData } from "../controllers/dataIngestionController.js";
import { registerUser } from "../controllers/customerController.js";
import { checkEligibility, createLoan, makePayment, viewLoan, viewStatement } from "../controllers/loanController.js";

const router = Router();

router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' })
})

// API for data ingestion
router.get('/ingest-loan', ingestLoanData)
router.get('/ingest-customer', ingestCustomerData)


// Routes for adding customer
router.post('/register', registerUser);

// Route: /check-eligibility 
router.post('/check-eligibility', checkEligibility);
router.post('/create-loan', createLoan)

router.get('/view-loan/:loan_id', viewLoan);

router.get('/make-payment/:customer_id/:loan_id', makePayment);


router.get('/view-statement/:customer_id/:loan_id', viewStatement);

export default router;