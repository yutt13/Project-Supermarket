const express = require('express');
const app = express.Router();
const controller = require('../controllers/product.controller');

// define routes here
app.get("/", controller.get);
app.get("/:id",controller.getById);
app.post("/", controller.create);
app.put("/:id", controller.update);
app.delete("/:id", controller.delete);

module.exports = app;
