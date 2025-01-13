const ShopifySeller = require('../models/ShopifySeller');

// Create a new Shopify seller
createShopifySeller = async (req, res) => {
  try {
    const newSeller = new ShopifySeller(req.body);
    await newSeller.save();
    res.status(201).json({ message: 'Shopify seller created successfully', seller: newSeller });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Shopify seller', error });
  }
};

// Get all Shopify sellers
getAllShopifySellers = async (req, res) => {
  try {
    const sellers = await ShopifySeller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Shopify sellers', error });
  }
};

// Get Shopify seller by ID

// Update Shopify seller

// Delete Shopify seller


module.exports = {
    createShopifySeller,
    getAllShopifySellers
};