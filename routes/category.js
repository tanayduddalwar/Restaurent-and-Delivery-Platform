const express=require("express");
const app=express();
const router=express.Router();
const { jwtauthmiddleware, generate_token} = require("../jwt");
const jwt=require("jsonwebtoken");
const categorymodel=require("../models/categoryschema");

router.post("/create",jwtauthmiddleware,async (req,res)=>{
    try {
        const { title, imageUrl } = req.body;
        //valdn
        if (!title) {
          return res.status(500).send({
            success: false,
            message: "please provide category title or image",
          });
        }
        const newCategory = new categorymodel({ title, imageUrl });
        await newCategory.save();
        res.status(201).send({
          success: true,
          message: "category created",
          newCategory,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In Create Cat API",
          error,
        });
      }
 });

 router.delete("/delete/:id",jwtauthmiddleware,async(req,res)=>{
  console.log("Inside the delete category block");
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(500).send({
        success: false,
        message: "Please provide Category ID",
      });
    }
    const category = await categorymodel.findById(id);
    if (!category) {
      return res.status(500).send({
        success: false,
        message: "No Category Found With this id",
      });
    }
    await categorymodel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "category Deleted succssfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Delete Cat APi",
      error,
    });
  }
 });

router.get("/getall",jwtauthmiddleware,async(req,res)=>{
  console.log("Inside the get all restaurents api");
  try {
    const categories = await categorymodel.find({});
    if (!categories) {
      return res.status(404).send({
        success: false,
        message: "No Categories found",
      });
    }
    res.status(200).send({
      success: true,
      totalCat: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in get All Categpry API",
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