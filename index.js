const express = require("express");
const app = express();
const body_parser = require("body-parser");
app.use(body_parser.json());
const PORT = process.env.PORT || 8000; // Corrected to prioritize environment variable
const db = require("./db");
const path = require("./routes/userroute"); // Make sure this path is correct and the file exists
const respath=require("./routes/restaurent");
const cat=require("./routes/category");
const food=require("./routes/food");
// Use the correct variable `path` instead of `pa`
app.use("/", path);
app.use("/restaurent",respath);
app.use("/category",cat);
app.use("/food",food);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
