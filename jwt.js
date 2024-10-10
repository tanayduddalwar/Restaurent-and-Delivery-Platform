const express=require("express");
const app= express();
const jwt=require("jsonwebtoken");


const jwtauthmiddleware =(req,res,next)=>{
    console.log("Inside the jwt auth middleware");
    const authorization=req.headers.authorization;
    if(!authorization){
        return res.status(400).json({err:"User not authenticated,please "})
    }
    const token=req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({err:"Token not found"});
    }
    try {
        const verified=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user=verified;
        next();
    } catch (error) {
        return res.status(500).json({err:"Error while authenticating"});
    }
}
const generate_token = (user) => {
    // Extract necessary fields to create a payload
    const payload = {
        _id: user._id,
        username: user.username,
    };

    // Generate a token using the payload
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};
module.exports={jwtauthmiddleware,generate_token};
