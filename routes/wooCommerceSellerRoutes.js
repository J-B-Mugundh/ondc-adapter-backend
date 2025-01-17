const express = require('express');
const router = express.Router();
const {createWooCommerceSeller,getAllWooCommerceSellers,getWooCommerceSellerById,updateWooCommerceSeller,deleteWooCommerceSeller} = require('../controllers/wooCommerceSellerController');
const multer=require('multer');
const upload=multer();

// Define routes for WooCommerce Seller
router.post('/create', upload.array("documents"), createWooCommerceSeller);
router.get('/', getAllWooCommerceSellers);
router.get('/:id', getWooCommerceSellerById);
router.put('/:id', upload.array("documents"), updateWooCommerceSeller);
router.delete('/:id', deleteWooCommerceSeller);
module.exports = router;

