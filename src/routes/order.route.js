const express = require('express');
const app = express.Router();
const controller = require('../controllers/order.controller');

// define routes here

app.get("/", controller.getOrders);
app.get("/user/:id",controller.getOrderById);
app.post("/user",controller.createOrder);

module.exports = app;