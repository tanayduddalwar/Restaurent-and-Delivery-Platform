const express = require("express");
const app = express();
const router = express.Router();
const usermodel = require("../models/userschema");
const { jwtauthmiddleware, generate_token} = require("../jwt");
const jwt=require("jsonwebtoken");
// Middleware to parse JSON requests
app.use(express.json());

// Test Route
router.get("/", (req, res) => {
    try {
        res.send("Hello World");
    } catch (error) {
        return res.status(500).json({ message: "Error reaching the site" });
    }
});

// Registration Route
router.post("/register", async (req, res) => {
    try {
        console.log("Inside the register function");
        
        // Access the request body directly
        const data = req.body;

        // Create a new user instance without hashing the password
        const user = new usermodel(data);
        
        // Save the user to the database
        const response = await user.save();
        console.log("Data Saved");

        // Generate token
        const token = generate_token(user);
        console.log(token);

        // Respond with the created user and token
        return res.status(201).json({ message: "User registered successfully", user: response, token });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(400).json({ error: "Error saving data in MongoDB" });
    }
});

router.post("/login", async (req, res) => {
    console.log("Inside the login route");
    try {
        const { username, password } = req.body;
        const user = await usermodel.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: "User doesn't exist, please create user first" });
        }

        // Compare passwords directly (without hashing)
        if (user.password !== password) {
            return res.status(401).json({ error: "Password doesn't match, please try again" });
        }

        // Generate token
        const token = generate_token(user);
        console.log("Login successful");

        res.json({ msg: "Login successful", token });
    } catch (error) {
        console.error(error); // Log for debugging
        return res.status(500).json({ error: "Internal server error, please try again" });
    }
});

router.put("/updateuser", jwtauthmiddleware, async (req, res) => {
    console.log("Inside the update user route");
    try {
        // Extract current username, new username, and password from request body
        const { username, newUsername, password } = req.body;

        // Find the user using the current username
        const user = await usermodel.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user properties
        user.username = newUsername || user.username;  // Update username only if newUsername is provided
        user.password = password || user.password;    // Update password if provided

        // Save the updated user
        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("deleteuser/:id",jwtauthmiddleware,async (req,res)=>{
     try {
        await usermodel.findByIdAndDelete(req.params.id);
        return res.status(200).send({msg:"User deleted successfully"});

        
     } catch (error) {
        res.status(401).send({msg:"User not found to delete"});
        
     }
})





module.exports = router;
