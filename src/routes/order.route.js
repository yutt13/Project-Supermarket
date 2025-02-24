const express = require('express');
const app = express.Router();
const controller = require('../controllers/order.controller');

// define routes here

app.get("/", controller.getOrders);
app.post("/",controller.createOrder);
app.put("/:id", controller.updateOrderStatus);
app.delete("/:id", controller.deleteOrder);

module.exports = app;