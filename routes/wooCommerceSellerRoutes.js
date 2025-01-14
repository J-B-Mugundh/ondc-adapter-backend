const express = require('express');
const router = express.Router();
const {createWooCommerceSeller,getAllWooCommerceSellers,getWooCommerceSellerById,updateWooCommerceSeller,deleteWooCommerceSeller} = require('../controllers/wooCommerceSellerController');

// Define routes for WooCommerce Seller
router.post('/create', createWooCommerceSeller);
router.get('/', getAllWooCommerceSellers);
router.get('/:id', getWooCommerceSellerById);
router.put('/:id', updateWooCommerceSeller);
router.delete('/:id', deleteWooCommerceSeller);
module.exports = router;
