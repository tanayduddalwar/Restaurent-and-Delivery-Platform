const express = require("express");
const router = express.Router();
const restaurentModel = require("../models/restaurentschema");
const { jwtauthmiddleware } = require("../jwt");
const usermodel = require("../models/userschema");

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: API for managing restaurants
 */

/**
 * @swagger
 * /restaurent/register:
 *   post:
 *     summary: Register a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               foods:
 *                 type: array
 *                 items:
 *                   type: string
 *               time:
 *                 type: string
 *               pickup:
 *                 type: boolean
 *               delivery:
 *                 type: boolean
 *               isOpen:
 *                 type: boolean
 *               logoUrl:
 *                 type: string
 *               rating:
 *                 type: number
 *               ratingCount:
 *                 type: number
 *               code:
 *                 type: string
 *               coords:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *     responses:
 *       201:
 *         description: New Restaurant Created successfully
 *       401:
 *         description: Only admins are allowed to perform this task
 *       500:
 *         description: Error in creating restaurant
 */
router.post("/register", jwtauthmiddleware, async (req, res) => {
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

    const userId = req.user._id;
    const user = await usermodel.findById(userId);

    if (user.usertype !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Only admins are allowed to perform this task",
      });
    }

    if (!title || !coords) {
      return res.status(500).send({
        success: false,
        message: "Please provide title and address",
      });
    }

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

/**
 * @swagger
 * /restaurent/getall:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: Successfully retrieved all restaurants
 *       404:
 *         description: No Restaurant Available
 *       500:
 *         description: Error in fetching restaurants
 */
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

/**
 * @swagger
 * /restaurent/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved restaurant
 *       404:
 *         description: No restaurant found
 *       500:
 *         description: Error in fetching restaurant by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    if (!restaurantId) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Restaurant ID",
      });
    }

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

module.exports = router;
