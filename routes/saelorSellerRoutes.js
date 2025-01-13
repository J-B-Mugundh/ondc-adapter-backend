const express = require('express');
const router = express.Router();
const {createSaelorSeller} = require('../controllers/saelorSellerController');

// Define routes for Saelor Seller
router.post('/create', createSaelorSeller);

module.exports = router;
