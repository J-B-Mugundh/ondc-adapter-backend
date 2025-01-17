const express = require("express");
const { searchProduct } = require("../controllers/searchController");

const router = express.Router();

router.post("/search", searchProduct);

module.exports = router;
