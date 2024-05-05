import {register} from "../services/customerService.js";

const registerUser  = (req, res)=>{
    try{
        const {first_name, last_name, age, monthly_salary,phone_number} = req.body;

        if(!first_name || !last_name || !age || !monthly_salary || !phone_number){
            return res.status(400).json({msg:"All fields are required!"})
        }

        const approved_limit = Math.round(36 * Number(monthly_salary));

        //creating unique customer id
        const customer_id = Math.floor(1000 + Math.random() * 9000);
        console.log("customer_id : ", customer_id, "approved_limit : ", approved_limit, "first_name : ", first_name, "last_name : ", last_name, "age : ", age, "monthly_imcome : ", monthly_salary, "phone_number : ", phone_number)

        // call service
        register({customer_id, first_name, last_name, age, monthly_salary, phone_number, approved_limit});



        return res.status(201).json({msg:"User registered successfully!"})
    }catch(err){
        console.log("Error : ",err)
        return res.status(500).json({msg:"Something went wrong!", err:err})
    }
}


export {registerUser};