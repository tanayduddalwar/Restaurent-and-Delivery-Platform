const mongoose=require("mongoose");
require("dotenv").config();
const mongourl=process.env.MONGODB_URL;
mongoose.connect(mongourl);
const db=mongoose.connection;
db.on("connected",()=>{
    console.log("Connected to mongodb url");
})
db.on("error",(err)=>{
    console.log("Error connecting to mongodb");
})
db.on("disconnected",(err)=>{
    console.log("Disconnecting from Mongodb");
})