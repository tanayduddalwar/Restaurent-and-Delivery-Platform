const express = require("express");
const app = express();
const router = express.Router();
const restaurentModel = require("../models/restaurentschema"); 
const { jwtauthmiddleware, generate_token } = require("../jwt");
const jwt = require("jsonwebtoken");
const usermodel = require("../models/userschema");

// Middleware to parse JSON requests
app.use(express.json());
module.exports = router;

// Register restaurant
router.post("/register", jwtauthmiddleware, async (req, res) => {
  console.log("Inside create restaurant API");
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

    // Find user (assuming you're looking for the logged-in user)
    const userId = req.user._id;
    const user = await usermodel.findById(userId);

    // Check if the user is an admin
    if (user.usertype !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Only admins are allowed to perform this task",
      });
    }

    // Validation
    if (!title || !coords) {
      return res.status(500).send({
        success: false,
        message: "Please provide title and address",
      });
    }

    // Create a new restaurant
    const newRestaurant = new restaurentModel({
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

    await newRestaurant.save();

    res.status(201).send({
      success: true,
      message: "New Restaurant Created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Restaurant API",
      error,
    });
  }
});

// Get all restaurants
router.get("/getall", async (req, res) => {
  try {
    const restaurants = await restaurentModel.find({});
    if (!restaurants.length) {
      return res.status(404).send({
        success: false,
        message: "No Restaurant Available",
      });
    }
    res.status(200).send({
      success: true,
      totalCount: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get All Restaurants API",
      error,
    });
  }
});

// Get restaurant by ID
router.get("/:id", async (req, res) => {
  console.log("Inside the get restaurant by ID API");
  try {
    const restaurantId = req.params.id;
    if (!restaurantId) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Restaurant ID",
      });
    }

    // Find restaurant by ID
    const restaurant = await restaurentModel.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "No restaurant found",
      });
    }

    res.status(200).send({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get Restaurant by ID API",
      error,
    });
  }
});
