// service to ingest data from the data folder xlsx files to db
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ingestLoanData = async (loans) =>{
    try{
        // insert the data into the database
        console.log('Ingest Loan Data');
        await prisma.loan.createMany({
            data: loans
        });
    }catch(err){
        console.log(err);
    }
}

const ingestCustomerData = async (customers) =>{
    try{
        // insert the data into the database
        await prisma.customer.createMany({
            data: customers
        });
    }catch(err){
        console.log(err);
    }
}



export { ingestLoanData, ingestCustomerData};