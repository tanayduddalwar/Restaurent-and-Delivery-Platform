const express = require("express");
const router = express.Router();
const { jwtauthmiddleware } = require("../jwt");
const foodmodel = require("../models/foodschema");
const usermodel = require("../models/userschema");
const restaurentmodel = require("../models/restaurentschema");
const categorymodel = require("../models/categoryschema");

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: API for managing food items
 */

/**
 * @swagger
 * /food/create:
 *   post:
 *     summary: Create a new food item
 *     tags: [Foods]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               foodTags:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               code:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *               restaurant:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: New food item created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized, only admins can create food items
 *       500:
 *         description: Error creating food item
 */
router.post("/create", jwtauthmiddleware, async (req, res) => {
  try {
    const { title, description, price, restaurant } = req.body;

    const user = await usermodel.findById(req.user._id);
    if (user.usertype !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Only admins are allowed to perform this task",
      });
    }

    const newFood = new foodmodel(req.body);
    await newFood.save();

    const restaurantData = await restaurentmodel.findById(restaurant);
    if (restaurantData) {
      restaurantData.foods.push(newFood);
      await restaurantData.save();
    }

    res.status(201).send({
      success: true,
      message: "New Food Item Created",
      newFood,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error creating food item", error });
  }
});

/**
 * @swagger
 * /food/getall:
 *   get:
 *     summary: Retrieve all food items
 *     tags: [Foods]
 *     responses:
 *       200:
 *         description: Successfully retrieved all food items
 *       404:
 *         description: No food items found
 *       500:
 *         description: Error fetching food items
 */
router.get("/getall", async (req, res) => {
  try {
    const foods = await foodmodel.find({});
    res.status(200).send({ success: true, foods });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching foods", error });
  }
});

/**
 * @swagger
 * /food/get/{id}:
 *   get:
 *     summary: Retrieve a food item by ID
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the food item to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the food item
 *       404:
 *         description: No food item found with this ID
 *       500:
 *         description: Error retrieving the food item
 */
router.get("/get/:id", async (req, res) => {
  try {
    const food = await foodmodel.findById(req.params.id);
    if (!food) {
      return res.status(404).send({ success: false, message: "No food item found" });
    }
    res.status(200).send({ success: true, food });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching food item", error });
  }
});

/**
 * @swagger
 * /food/updatefood/{id}:
 *   put:
 *     summary: Update a food item
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the food item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Food item updated successfully
 *       404:
 *         description: No food item found with this ID
 *       500:
 *         description: Error updating food item
 */
router.put("/updatefood/:id", jwtauthmiddleware, async (req, res) => {
  try {
    const updatedFood = await foodmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) {
      return res.status(404).send({ success: false, message: "No food item found" });
    }
    res.status(200).send({ success: true, message: "Food item updated", updatedFood });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating food item", error });
  }
});

module.exports = router;
