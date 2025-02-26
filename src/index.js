const express = require("express");
const app = express();

// get port number from environment settings
require('dotenv').config();
const port = process.env.PORT || 4000;

const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const userRoutes = require('./routes/userRoutes'); // เพิ่ม userRoutes
const adminRoutes = require('./routes/adminRoutes'); // เพิ่ม adminRoutes

// CORS cross origin resource sharing
app.use(cors());
app.use('/images', express.static('images')); // ยังคงใช้ static folder สำหรับรูปภาพ
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// match GET localhost:4000/
app.get("/", (req, res) => {
  res.send("Sawasdee");
});

// ใช้ routes ใหม่
app.use("/user", userRoutes); // เพิ่ม userRoutes
app.use("/admin", adminRoutes); // เพิ่ม adminRoutes

app.listen(port, () => {
  console.log("App started at port: " + port);
});