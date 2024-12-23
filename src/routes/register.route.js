const express = require('express');
const app = express.Router();
const controller = require("../controllers/register.controller");


app.post("/", controller.register);

module.exports = app;