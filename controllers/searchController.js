const SaelorSeller = require('../models/SaelorSeller');
const ShopifySeller = require('../models/ShopifySeller');
const WooCommerceSeller = require('../models/WooCommerceSeller');
const { searchProductInShop } = require('../services/saleorService');
const { searchProductInShopify } = require('../services/shopifyService');
const WooCommerceService = require('../services/wooCommerceService');  // Import the service class

const searchProduct = async (req, res) => {
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  try {
    // Fetch verified Saleor sellers
    const saleorSellers = await SaelorSeller.find({ status: 'Verified' });
    const wooCommerceSellers = await WooCommerceSeller.find({ status: 'Verified' });
    const shopifySellers = await ShopifySeller.find({ status: 'Verified' });

    console.log('Verified Saleor Sellers:', saleorSellers);
    console.log('Verified WooCommerce Sellers:', wooCommerceSellers);
    console.log('Verified Shopify Sellers:', shopifySellers);

    const results = [];

    // Fetch products from Saleor sellers
    for (const seller of saleorSellers) {
      const products = await searchProductInShop(
        seller.shopLink,
        seller.authToken,
        seller.businessDetails.businessName,
        productName
      );

      console.log("Products found for Saleor seller ${seller.businessDetails.businessName}:", products);

      if (products.length > 0) {
        results.push(...products);
      }
    }

    // // Fetch products from WooCommerce sellers using WooCommerceService
    for (const seller of wooCommerceSellers) {
      const products = await WooCommerceService.searchProductInWooCommerce(  // Use the service class here
        seller.shopLink,
        seller.consumerKey,
        seller.consumerSecret,
        productName,
        seller.businessDetails.businessName
      );

      console.log("Products found for WooCommerce seller ${seller.businessDetails.businessName}:", products);

      if (products.length > 0) {
        results.push(
          ...products.map((product) => ({
            name: product.name,
            price: product.price,
            description: product.description,
            shopLink: seller.shopLink,
              consumerKey:seller.consumerKey,
              consumerSecret:seller.consumerSecret
               
          }))
        );
      }
    }

    // Fetch products from Shopify sellers
    for (const seller of shopifySellers) {
      const products = await searchProductInShopify(
        seller.shopLink,
        seller.accessKey,
        seller.businessDetails.businessName,
        productName
      );
      console.log(products);
      if (products.length > 0) {
        results.push(...products);
      }
    }

    console.log('Final Results:', results);

    if (results.length > 0) {
      return res.status(200).json({ products: results });
    } else {
      return res.status(404).json({ message: 'Product not found in any seller' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'An error occurred while searching for the product' });
  }
};

module.exports = { searchProduct };