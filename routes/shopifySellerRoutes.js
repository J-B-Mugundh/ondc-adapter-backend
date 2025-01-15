const express = require('express');
const router = express.Router();
const {createShopifySeller,getAllShopifySellers,getShopifySellerById,updateShopifySeller,deleteShopifySeller} = require('../controllers/shopifySellerController');
const multer=require('multer');

const upload=multer();

// Define routes for Shopify Seller
router.post('/create', upload.array("documents"), createShopifySeller);
router.get('/', getAllShopifySellers);
router.get('/:id', getShopifySellerById);
router.put('/:id',upload.array("documents"), updateShopifySeller);
router.delete('/:id', deleteShopifySeller);

module.exports = router;