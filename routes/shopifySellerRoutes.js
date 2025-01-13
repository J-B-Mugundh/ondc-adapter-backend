const express = require('express');
const router = express.Router();
const {createShopifySeller} = require('../controllers/shopifySellerController');

// Define routes for Shopify Seller
router.post('/create', createShopifySeller);

module.exports = router;
