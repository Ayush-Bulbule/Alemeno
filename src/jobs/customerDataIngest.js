import path from "path";
import Exceljs from "exceljs";
import { fileURLToPath } from "url";
import { Queue, Worker } from "bullmq";
import redisConnection from "../config/redisConnection.js";
import { ingestCustomerData } from "../services/dataIngestionService.js";

// Queue to handle the data ingestion
const dataQueue = new Queue("customer-data-ingestion", { connection: redisConnection });

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Worker function to process customer data ingestion (may we can move this to other file)
const processCustomerData = async (job) => {
  try {
    const filePath = path.join(__dirname, "..", "..", "data", job.data.filePath);
    console.log(`Processing customer data from file: ${filePath}`);

    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];
    const customers = [];

    await worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber !== 1) {
        // Extract the values from the row
        const [
            ,
            customer_id,
            first_name,
            last_name,
            age,
            phone_number,
            monthly_salary,
            approved_limit,
            current_debt,
        ] = row.values;

        // Add the extracted values to the customers array
        customers.push({
          customer_id: parseInt(customer_id),
          first_name,
          last_name,
          age: parseInt(age),
          phone_number: phone_number.toString(),
          monthly_salary: BigInt(monthly_salary),
          approved_limit: BigInt(approved_limit),
          current_debt: BigInt(current_debt),
        });
      }
    });

    // Call the dataIngestion service to insert the data into the database
    await ingestCustomerData(customers);

    return customers.length;
  } catch (err) {
    console.error("Error processing customer data:", err);
    throw err; // Rethrow the error for centralized error handling
  }
};

// Create a worker to process customer data ingestion
const customerDataWorker = new Worker("customer-data-ingestion", processCustomerData, {
  connection: redisConnection,
});

// Event listener for completed jobs
customerDataWorker.on("completed", (job) => {
  console.log(`customer data ingestion job completed: ${job.id}`);
});

// Trigger customer data ingestion
const triggerCustomerDataIngestion = async (filePath) => {
  console.log("Start customer data ingestion job");
  await dataQueue.add("customer-data-ingestion", { filePath });
};

export { triggerCustomerDataIngestion, customerDataWorker };
