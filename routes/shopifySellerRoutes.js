const express = require('express');
const router = express.Router();
const {createShopifySeller,getAllShopifySellers,getShopifySellerById,updateShopifySeller,deleteShopifySeller} = require('../controllers/shopifySellerController');

// Define routes for Shopify Seller
router.post('/create', createShopifySeller);
router.get('/', getAllShopifySellers);
router.get('/:id', getShopifySellerById);
router.put('/:id', updateShopifySeller);
router.delete('/:id', deleteShopifySeller);

module.exports = router;