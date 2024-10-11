const express = require("express");
const app = express();
const router = express.Router();
const { jwtauthmiddleware, generate_token } = require("../jwt");
const jwt = require("jsonwebtoken");
const foodmodel = require("../models/foodschema");
const usermodel=require("../models/userschema");
const restaurentmodel = require("../models/restaurentschema");
const categorymodel = require("../models/categoryschema");
router.post("/create", jwtauthmiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,  // This will be the category name, e.g., "Main Course"
      code,
      isAvailable,
      restaurant,
      rating,
      ratingCount
    } = req.body;

    // Check if the category already exists
    let categoryData = await categorymodel.findOne({ title: category });
    
    // If category doesn't exist, create it
    if (!categoryData) {
      categoryData = new categorymodel({ title: category });
      await categoryData.save();  // Save the new category
    }

    // Create new food item with the category's ObjectId
    const newFood = new foodmodel({
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category: categoryData._id,  // Use the category's ObjectId here
      code,
      isAvailable,
      restaurant,
      rating,
      ratingCount
    });

    // Save the new food item
    await newFood.save();

    res.status(201).send({
      success: true,
      message: "New Food Item Created and Category added if it didn't exist",
      newFood,
      category: categoryData  // Return the category as well
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
