import {triggerLoanDataIngestion,  } from "../jobs/loanDataIngest.js";
import {triggerCustomerDataIngestion} from "../jobs/customerDataIngest.js";

const ingestLoanData = async (req, res) => {
    try {
        // Not mention clearly in doc so I am assuming the file path we can add file upload feature also
        const filePath = '/loan_data.xlsx';

        // Trigger customer data ingestion using the specified file path
        await triggerLoanDataIngestion(filePath);

        // Send a success response to the client
        res.status(200).json({ message: 'Loan Ingestion Triggered successfully' });
    } catch (error) {
        // Handle any errors that occur during the data ingestion process
        console.error('Error triggering data ingestion:', error);

        // Send an error response to the client with an appropriate status code and error message
        res.status(500).json({ error: 'Internal server error' });
    }
};

const ingestCustomerData = async (req, res) => {
    try {
        const filePath = '/customer_data.xlsx';

        // Trigger customer data ingestion using the specified file path
        await triggerCustomerDataIngestion(filePath);

        // Send a success response to the client
        res.status(200).json({ message: 'Customer Data Ingestion Triggered successfully' });
    } catch (error) {
        // Handle any errors that occur during the data ingestion process
        console.error('Error triggering data ingestion:', error);

        // Send an error response to the client with an appropriate status code and error message
        res.status(500).json({ error: 'Internal server error' });
    }
}

export { ingestLoanData, ingestCustomerData };
