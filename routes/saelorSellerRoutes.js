const express = require('express');
const router = express.Router();
const {createSaelorSeller,getAllSaelorSellers,getSaelorSellerById,updateSaelorSeller,deleteSaelorSeller} = require('../controllers/saelorSellerController');

// Define routes for Saelor Seller
router.post('/create', createSaelorSeller);
router.get('/', getAllSaelorSellers);
router.get('/:id', getSaelorSellerById);
router.put('/:id', updateSaelorSeller);
router.delete('/:id', deleteSaelorSeller);

module.exports = router;
