// import mongoose
const mongoose = require("mongoose")

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log("MongoDb Connected Successfully!!");
    
}).catch((err)=>{
    console.log("MongoDB Connection Failed");
    console.log(err);
})