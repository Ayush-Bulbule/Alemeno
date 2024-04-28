import express, { Router } from "express";
import { ingestLoanData, ingestCustomerData } from "../controllers/dataIngetionController.js";

const router = Router();

router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' })
})

// API for data ingestion
router.get('/ingest-loan', ingestLoanData)
router.get('/ingest-customer', ingestCustomerData)


export default router;