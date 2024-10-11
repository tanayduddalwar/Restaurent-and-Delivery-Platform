const express = require("express");
const app = express();
const router = express.Router();
const { jwtauthmiddleware, generate_token } = require("../jwt");
const jwt = require("jsonwebtoken");
const foodmodel = require("../models/foodschema");
const usermodel=require("../models/userschema");
const restaurentmodel=require("../models/restaurentschema");
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

    // Find the user and check if they are an admin
      const userId = req.user._id;
    const user = await usermodel.findById(userId);
    if (user.usertype !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Only admins are allowed to do this task",
      });
    }

    // Validation of required fields
    if (!title || !description || !price || !restaurant) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields (title, description, price, restaurant).",
      });
    }

    // Create new food item
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

    // Find the restaurant and update its foods array
    const restaurantData = await restaurentmodel.findById(restaurant);
    if (!restaurantData) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Add the new food's dish name to the restaurant's foods list
    restaurantData.foods.push({ dishName: newFood.title, dishPic: newFood.imageUrl, price: newFood.price });

    // Save the updated restaurant
    await restaurantData.save();

    res.status(201).send({
      success: true,
      message: "New Food Item Created and added to the restaurant",
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
});
router.put("/updatefood/:id",jwtauthmiddleware,async (req,res)=>{
  try {
    const foodID = req.params.id;
    if (!foodID) {
      return res.status(404).send({
        success: false,
        message: "no food id was found",
      });
    }
    const user = await userModel.findOne({ _id: req.user.id });
    if(user.usertype!="admin"){
      return res.status(401),send({msg:"Only admins are allowed to do this task"});
    }

    const food = await foodmodel.findById(foodID);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No Food Found",
      });
    }
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
    const updatedFood = await foodModal.findByIdAndUpdate(
      foodID,
      {
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
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Food Item Was Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr In Update Food API",
      error,
    });
  }
})

module.exports = router;
