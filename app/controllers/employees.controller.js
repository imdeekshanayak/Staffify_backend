const express = require("express");
const apiRoutes = express.Router();
const newEmployee = require("../models/employees.model");

module.exports = function(app){
    apiRoutes.post("/createEmployee", async(req,res) =>{

     try {
         const {fullName, designation,gender,phoneNo,fatherName,presentAddress,permanentAddress,
            emergencyContactNum,employeeType,dateOfJoining,basicSalary,companyBranch,totalSalary,department,officialEmail
        }= req.body;

        const employeeId = "ENQ-" + Math.floor(1000 + Math.random() * 9000);

      const existing = await newEmployee.findOne({fullName});
       if (existing) {
      return res.status(400).json({
        message: "An Employee already exists!",
      });
     }


        const data = await newEmployee.create({employeeId,fullName, designation,gender,phoneNo,fatherName,presentAddress,permanentAddress,
            emergencyContactNum,employeeType,dateOfJoining,basicSalary,companyBranch,totalSalary,department,officialEmail
        });

        return req.status(200).json({message:"new employee created successfully"}, data)

   
     } catch (error) {
        return req.status(500).json({error:error.message});
     }
      });


      apiRoutes.get("/getEmployee",async(req,res) =>{
        try {
             const {employeeId} = req.body;

        const data = await newEmployee.find({employeeId});

        return req.status(200).json({message:"data fetched successfully"}, data)
        } catch (error) {
            return req.status(500).json({error:error.message});
        }
        
      });

      apiRoutes.post("/updateEmployee",async(req,res) =>{
        try {
             const {employeeId,fullName, designation,gender,phoneNo,fatherName,presentAddress,permanentAddress,
            emergencyContactNum,employeeType,dateOfJoining,basicSalary,companyBranch,totalSalary,department,officialEmail
        } = req.body;

       const employee = await newEmployee.find({ employeeId });
      if (!employee) {
        return res.status(404).json({ message: "Employee with this id not found" });
      }

     const updates = {
  fullName,
  designation,
  gender,
  phoneNo,
  fatherName,
  presentAddress,
  permanentAddress,
  emergencyContactNum,
  employeeType,
  dateOfJoining,
  basicSalary,
  companyBranch,
  totalSalary,
  department,
  officialEmail
};

  Object.keys(updates).forEach((key) => {
  if (updates[key] !== undefined) {
    employee[key] = updates[key];
  }
  });

 return req.status(200).json({message:"data fetched successfully"})
        } catch (error) {
            return req.status(500).json({error:error.message});
        }
        
      });


      apiRoutes.post("/deleteEmployee", async(req,res) =>{
        try {
            const {employeeId} = req.body;
            const employee = await newEmployee.findOneAndDelete({employeeId});

            if(!employee){
                return res.status(200).json({message:"employee does't found"});
            }

            return res.status(200).json()
        } catch (error) {
            
        }

      })


       
    app.use("/",apiRoutes);
}