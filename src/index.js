const express = require("express");
const app = express();

// get port number from environment settings
require('dotenv').config();
const port = process.env.PORT || 4000;

const bodyParser = require("body-parser");
const cors = require("cors");
const productRoute = require('./routes/product.route');
const categoriesRoute = require('./routes/categories.route');
//const customerRoute = require('./routes/customer.route');
const registerRoute = require('./routes/register.route');
// CORS cross origin resource sharing
app.use(cors());
app.use('/images', express.static('images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// match GET localhost:4000/
app.get("/", (req, res)=>{
    res.send("Sawasdee");
  });

  // ใช้ productRoute เมื่อ request ขึ่นต้นด้วย /products
app.use("/products", productRoute);
app.use("/categories", categoriesRoute);
//app.use("/customer", customerRoute);
app.use("/register", registerRoute);
app.listen(port, () => {
    console.log("App started at port: " + port);
});