const express = require('express');
const router = express.Router();
const {createWooCommerceSeller} = require('../controllers/wooCommerceSellerController');

// Define routes for WooCommerce Seller
router.post('/create', createWooCommerceSeller);

module.exports = router;
