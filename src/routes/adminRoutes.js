const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin routes
router.get('/products', adminController.getAllProducts);
router.post('/products/add', adminController.addProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.put('/products/:id', adminController.updateProduct);
router.get('/categories', adminController.getAllCategories);
router.post('/categories/add', adminController.addCategory);
router.delete('/categories/:id', adminController.deleteCategory);
router.get('/orders', adminController.getOrders);

module.exports = router;