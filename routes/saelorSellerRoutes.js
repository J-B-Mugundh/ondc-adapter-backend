const express = require('express');
const router = express.Router();
const {createSaelorSeller,getAllSaelorSellers,getSaelorSellerById,updateSaelorSeller,deleteSaelorSeller} = require('../controllers/saelorSellerController');
const multer=require('multer');
const upload=multer();

// Define routes for Saelor Seller
router.post('/create', upload.array("documents"),createSaelorSeller);
router.get('/', getAllSaelorSellers);
router.get('/:id', getSaelorSellerById);
router.put('/:id', upload.array("documents"),  updateSaelorSeller);
router.delete('/:id', deleteSaelorSeller);

module.exports = router;
