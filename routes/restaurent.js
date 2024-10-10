const express = require("express");
const app = express();
const router = express.Router();
const restaurentmodel=require("../models/restaurentschema");
const { jwtauthmiddleware, generate_token} = require("../jwt");
const jwt=require("jsonwebtoken");
// Middleware to parse JSON requests
app.use(express.json());
module.exports=router;

router.post("/register",jwtauthmiddleware,async(req,res)=>{
    console.log("Inside create restaurent api");
    try {
        const {
          title,
          imageUrl,
          foods,
          time,
          pickup,
          delivery,
          isOpen,
          logoUrl,
          rating,
          ratingCount,
          code,
          coords,
        } = req.body;
        // validation
        if (!title || !coords) {
          return res.status(500).send({
            success: false,
            message: "please provide title and address",
          });
        }
        const newResturant = new restaurentmodel({
          title,
          imageUrl,
          foods,
          time,
          pickup,
          delivery,
          isOpen,
          logoUrl,
          rating,
          ratingCount,
          code,
          coords,
        });
    
        await newResturant.save();
    
        res.status(201).send({
          success: true,
          message: "New Resturant Created successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In Create Resturant api",
          error,
        });
      }
});
router.get("/getall",async (req,res)=>{
    try {
        const resturants = await resturantmodel.find({});
        if (!resturants) {
          return res.status(404).send({
            success: false,
            message: "No Resturant Availible",
          });
        }
        res.status(200).send({
          success: true,
          totalCount: resturants.length,
          resturants,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In Get ALL Resturat API",
          error,
        });
      }
});
router.get("/:restaurentbyid",async(req,res)=>{
    console.log("Inside the get restaurent by id api");
    try {
        const resturantId = req.params.id;
        if (!resturantId) {
          return res.status(404).send({
            success: false,
            message: "Please Provide Resturnat ID",
          });
        }
        //find resturant
        const resturant = await resturantmodel.findById(resturantId);
        if (!resturant) {
          return res.status(404).send({
            success: false,
            message: "no resturant found",
          });
        }
        res.status(200).send({
          success: true,
          resturant,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In Get Resturarnt by id api",
          error,
        });
      }
});