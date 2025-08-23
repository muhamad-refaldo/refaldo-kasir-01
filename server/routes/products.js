const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const auth = require('../middleware/auth');

// @route   GET api/products
// @desc    Get all products for a store
// @access  Private
router.get('/', auth, getProducts);

// @route   POST api/products
// @desc    Add a new product
// @access  Private
router.post('/', auth, createProduct);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, updateProduct);

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, deleteProduct);

module.exports = router;