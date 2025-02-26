const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/users/:id', userController.updateUser);
router.get('/products/search', userController.searchProducts);
router.get('/products/category/:categoryId', userController.getProductsByCategory);
router.post('/cart/add', userController.addToCart);
router.post('/orders/create', userController.createOrder);

module.exports = router;