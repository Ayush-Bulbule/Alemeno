import express, { Router } from "express";
import { ingestLoanData, ingestCustomerData } from "../controllers/dataIngestionController.js";
import { registerUser } from "../controllers/customerController.js";
import { checkEligibility, createLoan } from "../controllers/loanController.js";

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

export default router;