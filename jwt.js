const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

// JWT Authentication Middleware
const jwtauthmiddleware = (req, res, next) => {
  console.log("Inside the JWT auth middleware");
  
  // Check if the Authorization header is present
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(400).json({ err: "Authorization header missing" });
  }

  // Check if the token follows the "Bearer <token>" format
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ err: "Token not found in the Authorization header" });
  }

  try {
    // Verify the token using the secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the verified user data to req.user
    req.user = verified;
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error("Error during JWT verification:", error);
    return res.status(403).json({ err: "Token verification failed" });
  }
};

// JWT Token Generation Function
const generate_token = (user) => {
  // Create a payload from the user details
  const payload = {
    _id: user._id,
    username: user.username,
  };

  // Generate a token using the secret key, with a 1-hour expiry
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

module.exports = { jwtauthmiddleware, generate_token };
