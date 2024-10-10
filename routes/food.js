const express=require("express");
const app=express();
const router=express.Router();
const { jwtauthmiddleware, generate_token} = require("../jwt");
const jwt=require("jsonwebtoken");
const foodmodel=require("../models/categoryschema");

router.post("/create",jwtauthmiddleware,async(req,res)=>{
    console.log("Inside create food api");
    try {
        const {
          title,
          description,
          price,
          imageUrl,
          foodTags,
          catgeory,
          code,
          isAvailabe,
          resturnat,
          rating,
        } = req.body;
    
        if (!title || !description || !price || !resturnat) {
          return res.status(500).send({
            success: false,
            message: "Please Provide all fields",
          });
        }
        const newFood = new foodmodel({
          title,
          description,
          price,
          imageUrl,
          foodTags,
          catgeory,
          code,
          isAvailabe,
          resturnat,
          rating,
        });
    
        await newFood.save();
        res.status(201).send({
          success: true,
          message: "New Food Item Created",
          newFood,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error in create food api",
          error,
        });
      }
});
module.exports=router;