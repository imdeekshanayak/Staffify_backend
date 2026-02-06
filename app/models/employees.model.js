const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    employeeId:{
        type:String,
        primaryKey:true
    },
    fullName:{
        type:String,
        
    },
    designation:{
        type:String,
        
    },
    gender :{
        type:String,
        
    },
    phoneNo:{
        type:String,
        
    },
    fatherName:{
        type:String,
        
    },
    presentAddress:{
        type:String,
        
    },
    permanentAddress:{
        type:String,
        
    },
    emergencyContactNum:{
        type:String,
        
    },
    employeeType:{
        type:String,
        
    },
    dateOfJoining:{
        type:String,
        
    },
    basicSalary:{
        type:String,
        
    },
    companyBranch:{
        type:String,
        
    },totalSalary:{
        type:String,
        
    },department:{
        type:String,
        
    },officialEmail:{
        type:String,
        
    },
},
{ 
    timestamp :true,

}
);

const newEmployee = mongoose.model("employeelist", employeeSchema);
module.exports = newEmployee;