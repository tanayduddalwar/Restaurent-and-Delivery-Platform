const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  foods: { 
    type: Array,
    default: [],  // Initialize with an empty array
  }, // Array to store references and titles of the Food model
}, { timestamps: true });

const categorymodel = mongoose.model("Category", categoryschema);
module.exports = categorymodel;