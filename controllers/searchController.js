const SaelorSeller = require('../models/SaelorSeller');
const { searchProductInShop } = require("../services/saleorService");

const searchProduct = async (req, res) => {
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    const sellers = await SaelorSeller.find({ status: "Verified" });
    console.log("Verified Sellers:", sellers);
  
    const results = [];
  
    for (const seller of sellers) {
      const products = await searchProductInShop(
        seller.shopLink,
        seller.authToken,
        seller.businessDetails.businessName,
        productName
      );
  
      console.log(`Products found for seller ${seller.businessDetails.businessName}:`, products);
  
      if (products.length > 0) {
        results.push(...products);
      }
    }
  
    console.log("Final Results:", results);
  
    if (results.length > 0) {
      return res.status(200).json({ products: results });
    } else {
      return res.status(404).json({ message: "Product not found in any seller" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "An error occurred while searching for the product" });
  }
};  

module.exports = { searchProduct };
