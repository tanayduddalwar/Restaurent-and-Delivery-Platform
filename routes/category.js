const express = require("express");
const router = express.Router();
const { jwtauthmiddleware } = require("../jwt");
const categorymodel = require("../models/categoryschema");
const foodmodel = require("../models/foodschema"); // Ensure this is imported

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API for managing food items and categories
 */

/**
 * @swagger
 * /api/food/create:
 *   post:
 *     summary: Create a new food item and associate it with a category
 *     tags: [Food]
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
 *               ratingCount:
 *                 type: number
 *     responses:
 *       201:
 *         description: New food item created and category updated
 *       500:
 *         description: Error in creating food item
 */
router.post("/create", jwtauthmiddleware, async (req, res) => {
  try {
    const {
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
      ratingCount,
    } = req.body;

    let categoryData = await categorymodel.findOne({ title: category });

    if (!categoryData) {
      categoryData = new categorymodel({ title: category });
      await categoryData.save();
    }

    const newFood = new foodmodel({
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category: categoryData._id,
      code,
      isAvailable,
      restaurant,
      rating,
      ratingCount,
    });

    await newFood.save();

    categoryData.foods.push({ _id: newFood._id, title: newFood.title });
    const updatedCategory = await categoryData.save();

    res.status(201).send({
      success: true,
      message: "New Food Item Created and Category Updated",
      newFood,
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in creating food item",
      error,
    });
  }
});

/**
 * @swagger
 * /api/category/update/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to update
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
 *     responses:
 *       200:
 *         description: Category Updated Successfully
 *       500:
 *         description: Error in updating category
 */
router.put("/update/:id", jwtauthmiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl } = req.body;

    const updatedCategory = await categorymodel.findByIdAndUpdate(
      id,
      { title, imageUrl },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(500).send({
        success: false,
        message: "No Category Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in updating category",
      error,
    });
  }
});

module.exports = router;
