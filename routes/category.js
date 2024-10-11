const express=require("express");
const app=express();
const router=express.Router();
const { jwtauthmiddleware, generate_token} = require("../jwt");
const jwt=require("jsonwebtoken");
const categorymodel=require("../models/categoryschema");

router.post("/create", jwtauthmiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,  // Category name, e.g., "fast food"
      code,
      isAvailable,
      restaurant,
      rating,
      ratingCount
    } = req.body;

    // Check if the category already exists by title
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

    // Debugging: Log the new food details
    console.log("New food created:", newFood);

    // Add the new food's ObjectId and title to the category's foods array
    categoryData.foods.push({ _id: newFood._id, title: newFood.title });

    // Debugging: Log the updated category before saving
    console.log("Updated category with new food:", categoryData);

    // Save the updated category with the new food reference and title
    const updatedCategory = await categoryData.save();

    // Debugging: Log the updated category after saving
    console.log("Updated category after saving:", updatedCategory);

    res.status(201).send({
      success: true,
      message: "New Food Item Created and Category updated with food",
      newFood,
      category: updatedCategory  // Return the updated category
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

router.put("/update/:id",jwtauthmiddleware,async(req,res)=>{
  console.log("Inside the update category api");
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
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in update cat api",
      error,
    });
  }
})
 module.exports=router