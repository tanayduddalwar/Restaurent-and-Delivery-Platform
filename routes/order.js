const express=require("express");
const app=express();
const router=express.Router();
const { jwtauthmiddleware, generate_token} = require("../jwt");
const jwt=require("jsonwebtoken");
const ordermodel=require("../models/orderschema");

router.post("placeorder",jwtauthmiddleware,async(req,res)=>{
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
    
        const newOrder = new ordermodel({
          foods: cart,
          payment: total,
          buyer: req.body.id,
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

module.exports=router
