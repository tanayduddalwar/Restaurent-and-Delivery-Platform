const express=require("express");
const app=express();
const router=express.Router();
const { jwtauthmiddleware, generate_token} = require("../jwt");
const jwt=require("jsonwebtoken");
const ordermodel=require("../models/orderschema");
const usermodel=require("../models/userschema");
router.post("/placeorder",jwtauthmiddleware,async(req,res)=>{
    try {
        const { cart } = req.body;
        if (!cart) {
          return res.status(500).send({
            success: false,
            message: "please food cart or payemnt method",
          });
        }
        const user=req.body;
       
        let total = 0;
        //cal
        cart.map((i) => {
          total += i.price;
        });
        const buyerId = req.user._id;
    
        const newOrder = new ordermodel({
          foods: cart,
          payment: total,
          buyer: buyerId,
        });
        await newOrder.save();
        res.status(201).send({
          success: true,
          message: "Order Placed successfully",
          newOrder,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Erorr In Place Order API",
          error,
        });
      }

});

router.post("/orderstatus/:id",async(req,res)=>{
  console.log("Inside the changing order status route");
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(404).send({
        success: false,
        message: "Please Provide valid order id",
      });
    }
    const { status } = req.body;
    const order = await ordermodel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Order Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Order Status API",
      error,
    });
  }
})

module.exports=router
