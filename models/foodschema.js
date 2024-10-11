const mongoose = require("mongoose");

const foodschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Food Title is required"],
    },
    description: {
      type: String,
      required: [true, "Food description is required"],
    },
    price: {
      type: Number,
      required: [true, "Food price is required"],
      min: 0, // Ensure that price is a positive value
    },
    imageUrl: {
      type: String,
      default:
        "https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png",
    },
    foodTags: {
      type: [String],  // Store tags as an array of strings for flexibility
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",  // Reference to the Category model (change if necessary)
      required: [true, "Category is required"],
    },
    code: {
      type: String,
      unique: true,  // Ensure that the food code is unique
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",  // Reference to the Restaurant model
      required: [true, "Restaurant reference is required"],
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    ratingCount: {
      type: Number,  // Changed to Number to represent the count
      default: 0,    // Default to 0 when a food item is created
    },
  },
  { timestamps: true }
);

const foodmodel = mongoose.model("Food", foodschema);
module.exports = foodmodel;
