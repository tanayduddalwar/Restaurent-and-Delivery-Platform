const mongoose=require("mongoose");
const userschema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        usertype:{
            type:String,
            default:"client",
            required:true,
            enum: ["client", "admin", "vendor", "driver"],
        },
        profile: {
            type: String,
            default:
              "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
          },
          answer: {
            type: String,
          
          },
    },
    { timestamps: true }
);
const usermodel=mongoose.model("User",userschema);
module.exports=usermodel;