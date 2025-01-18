const SaelorSeller = require('../models/SaelorSeller');
const ShopifySeller = require('../models/ShopifySeller');
const { searchProductInShop } = require("../services/saleorService");
const { searchProductInShopify } = require('../services/shopifyService');

const searchProduct = async (req, res) => {
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    const results = [];
    // Find all verified sellers
    const sellers = await SaelorSeller.find({ status: "Verified" });
    
    const sellers2 = await ShopifySeller.find({ status: "Verified" });
    console.log(sellers2);
    // Loop through all sellers and check if they have the product

    //1.adding saelor
    for (const seller of sellers) {
      const products = await searchProductInShop(
        seller.shopLink,
        seller.authToken,
        seller.businessDetails.businessName,
        productName
      );

     /* shopify */
      if (products.length > 0) {
        results.push(...products);
      }
    }
    //2.adding shopify
    for (const seller of sellers2) {
        const products = await searchProductInShopify(
          seller.shopLink,
          seller.accessKey,
          seller.businessDetails.businessName,
          productName
        );
        console.log(products);
       /* shopify */
        if (products.length > 0) {
          results.push(...products);
        }
    }

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
