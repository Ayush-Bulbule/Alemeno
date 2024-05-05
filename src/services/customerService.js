import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (customer) =>{
    try{
        await prisma.customer.create({
            data: customer
        });
    }catch(err){
        console.log(err);
        throw new Error("Error while registering the user")
    }
}

export const getCustomerById = async (id) =>{
    try{
        const customer = await prisma.customer.findUnique({
            where:{
                id
            }
        });
        return customer;
    }catch(err){
        console.log(err);
        throw new Error("Error while fetching the customer")
    }
}
