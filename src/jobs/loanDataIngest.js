import path from "path";
import Exceljs from "exceljs";
import { fileURLToPath } from "url";
import { Queue, Worker } from "bullmq";
import redisConnection from "../config/redisConnection.js";
import { ingestLoanData } from "../services/dataIngestionService.js";

// Queue to handle the data ingestion
const dataQueue = new Queue("loan-data-ingestion", { connection: redisConnection });

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Worker function to process loan data ingestion (may we can move this to other file)
const processLoanData = async (job) => {
  try {
    const filePath = path.join(__dirname, "..", "..", "data", job.data.filePath);
    console.log(`Processing loan data from file: ${filePath}`);

    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];
    const loans = [];

    await worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber !== 1) {
        const [
          ,
          customer_id,
          loan_id,
          loan_amount,
          tenure,
          interest_rate,
          monthly_payment,
          emi_paid,
          approval_date,
          end_date,
        ] = row.values;

        loans.push({
          customer_id: parseInt(customer_id),
          loan_id: parseInt(loan_id),
          loan_amount: BigInt(loan_amount),
          tenure: parseInt(tenure),
          interest_rate: parseFloat(interest_rate),
          monthly_payment: parseInt(monthly_payment),
          emi_paid: parseInt(emi_paid),
          approval_date: new Date(approval_date),
          end_date: new Date(end_date),
        });
      }
    });

    // Call the dataIngestion service to insert the data into the database
    await ingestLoanData(loans);

    return loans.length;
  } catch (err) {
    console.error("Error processing loan data:", err);
    throw err; // Rethrow the error for centralized error handling
  }
};

// Create a worker to process loan data ingestion
const loanDataWorker = new Worker("loan-data-ingestion", processLoanData, {
  connection: redisConnection,
});

// Event listener for completed jobs
loanDataWorker.on("completed", (job) => {
  console.log(`loan data ingestion job completed: ${job.id}`);
});

// Trigger loan data ingestion
const triggerLoanDataIngestion = async (filePath) => {
  console.log("Start loan data ingestion job");
  await dataQueue.add("loan-data-ingestion", { filePath });
};

export { triggerLoanDataIngestion, loanDataWorker };
