const express = require('express');
const app = express.Router();
const controller = require('../controllers/customer.controller');

// define routes here

app.get("/", controller.getCustomers);
app.post("/register",controller.register);
app.post("/login", controller.login);
app.put("/:id/points", controller.updatePoints);

module.exports = app;