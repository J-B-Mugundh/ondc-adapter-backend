const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Route for processing the cart
router.post("/", cartController.processCart);

module.exports = router;
