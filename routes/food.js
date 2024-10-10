const express = require("express");
const app = express();
const router = express.Router();
const { jwtauthmiddleware, generate_token } = require("../jwt");
const jwt = require("jsonwebtoken");
const foodmodel = require("../models/foodschema");

router.post("/create", jwtauthmiddleware, async (req, res) => {
  console.log("Inside create food API");
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category, // corrected field name
      code,
      isAvailable, // corrected field name
      restaurant, // corrected field name
      rating,
    } = req.body;

    // Validation of required fields
    if (!title || !description || !price || !restaurant) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields (title, description, price, restaurant).",
      });
    }

    const newFood = new foodmodel({
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      restaurant,
      rating,
    });

    // Save the new food item
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
      message: "Error in creating food item",
      error,
    });
  }
});

router.get("/getall", async (req,res)=>{
    console.log("inside it");
    try {
        const foods = await foodmodel.find({});
        if (!foods) {
          return res.status(404).send({
            success: false,
            message: "no food items was found",
          });
        }
        res.status(200).send({
          success: true,
          totalFoods: foods.length,
          foods,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erro In Get ALL Foods API",
          error,
        });
      }
});

router.get("/get/:id",async(req,res)=>{
    try {
        const foodId = req.params.id;
        if (!foodId) {
          return res.status(404).send({
            success: false,
            message: "please provide id",
          });
        }
        const food = await foodmodel.findById(foodId);
        if (!food) {
          return res.status(404).send({
            success: false,
            message: "No Food Found with htis id",
          });
        }
        res.status(200).send({
          success: true,
          food,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In get SIngle Food API",
          error,
        });
      }
});

router.get("/foodbyrestaurent/:id",async(req,res)=>{
    try {
        const resturantId = req.params.id;
        if (!resturantId) {
          return res.status(404).send({
            success: false,
            message: "please provide id",
          });
        }
        const food = await foodmodel.find({ resturnat: resturantId });
        if (!food) {
          return res.status(404).send({
            success: false,
            message: "No Food Found with htis id",
          });
        }
        res.status(200).send({
          success: true,
          message: "food base on restuatrn",
          food,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In get SIngle Food API",
          error,
        });
      }
})

module.exports = router;
