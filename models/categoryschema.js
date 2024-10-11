const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  foods: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
    title: {
      type: String,  // Store food title in the category as well
    }
  }],  // Array to store references and titles of the Food model
}, { timestamps: true });

const categorymodel = mongoose.model("Category", categoryschema);
module.exports = categorymodel;
