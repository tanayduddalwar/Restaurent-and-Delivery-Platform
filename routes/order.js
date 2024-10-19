const express = require("express");
const router = express.Router();
const { jwtauthmiddleware } = require("../jwt");
const ordermodel = require("../models/orderschema");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /order/placeorder:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       500:
 *         description: Error in placing order
 */
router.post("/placeorder", jwtauthmiddleware, async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart) {
      return res.status(500).send({
        success: false,
        message: "Please provide food cart or payment method",
      });
    }

    let total = 0;
    cart.map((item) => {
      total += item.price;
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
      message: "Order placed successfully",
      newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Place Order API",
      error,
    });
  }
});

/**
 * @swagger
 * /order/orderstatus/{id}:
 *   post:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: delivered
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error in updating order status
 */
router.post("/orderstatus/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(404).send({
        success: false,
        message: "Please provide a valid order ID",
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
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Order Status API",
      error,
    });
  }
});

module.exports = router;
