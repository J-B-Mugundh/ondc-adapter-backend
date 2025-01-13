const SaelorSeller = require('../models/SaelorSeller');

// Create a new Saelor seller
createSaelorSeller = async (req, res) => {
  try {
    const newSeller = new SaelorSeller(req.body);
    await newSeller.save();
    res.status(201).json({ message: 'Saelor seller created successfully', seller: newSeller });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Saelor seller', error });
  }
};

// Get all Saelor sellers

// Get Saelor seller by ID

// Update Saelor seller

// Delete Saelor seller




module.exports = {
    createSaelorSeller
};