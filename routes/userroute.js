const express = require("express");
const router = express.Router();
const usermodel = require("../models/userschema");
const { jwtauthmiddleware, generate_token } = require("../jwt");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Test route to ensure the server is running
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Server is running
 *       500:
 *         description: Error reaching the site
 */
router.get("/", (req, res) => {
  try {
    res.send("Hello World");
  } catch (error) {
    return res.status(500).json({ message: "Error reaching the site" });
  }
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error saving data in MongoDB
 */
router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const user = new usermodel(data);
    const response = await user.save();
    const token = generate_token(user);
    res.status(201).json({
      message: "User registered successfully",
      user: response,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error saving data in MongoDB" });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: User doesn't exist or password doesn't match
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usermodel.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ error: "User doesn't exist, please create user first" });
    }

    if (user.password !== password) {
      return res
        .status(401)
        .json({ error: "Password doesn't match, please try again" });
    }

    const token = generate_token(user);
    res.json({ msg: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error, please try again" });
  }
});

/**
 * @swagger
 * /updateuser:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               newUsername:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/updateuser", jwtauthmiddleware, async (req, res) => {
  try {
    const { username, newUsername, password } = req.body;
    const user = await usermodel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.username = newUsername || user.username;
    user.password = password || user.password;
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /deleteuser/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: User not found to delete
 */
router.delete("/deleteuser/:id", jwtauthmiddleware, async (req, res) => {
  try {
    await usermodel.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(401).send({ msg: "User not found to delete" });
  }
});

module.exports = router;
