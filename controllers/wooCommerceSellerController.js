const WooCommerceSeller = require('../models/WooCommerceSeller');

// Create a new WooCommerce seller
createWooCommerceSeller = async (req, res) => {
  try {
    const newSeller = new WooCommerceSeller(req.body);
    await newSeller.save();
    res.status(201).json({ message: 'WooCommerce seller created successfully', seller: newSeller });
  } catch (error) {
    res.status(500).json({ message: 'Error creating WooCommerce seller', error });
  }
};

// Get all Woocommerce sellers

// Get Woocommerce seller by ID

// Update Woocommerce seller

// Delete Woocommerce seller

module.exports = {
    createWooCommerceSeller
};