const SaelorSeller = require('./models/SaelorSeller');
const ShopifySeller = require('./models/ShopifySeller');
const WooCommerceSeller = require('./models/WoocommerceSeller');
const { searchProductInShop } = require("./services/saleorService");
const { searchProductInShopify } = require('./services/shopifyService');
const { searchProductInWooCommerce, placeOrderInWooCommerce } = require('./woocom');

const commonsearchProduct = async (req, res) => {
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    const results = [];
    // Find all verified sellers
    const saleorSellers = await SaelorSeller.find({ status: "Verified" });
    const shopifySellers = await ShopifySeller.find({ status: "Verified" });
    const wooCommerceSellers = await WooCommerceSeller.find({ status: "Verified" });

    // Add Saleor sellers
    for (const seller of saleorSellers) {
      const products = await searchProductInShop(
        seller.shopLink,
        seller.authToken,
        seller.businessDetails.businessName,
        productName
      );

      if (products.length > 0) {
        results.push(...products);
      }
    }

    // Add Shopify sellers
    for (const seller of shopifySellers) {
      const products = await searchProductInShopify(
        seller.shopLink,
        seller.accessKey,
        seller.businessDetails.businessName,
        productName
      );

      if (products.length > 0) {
        results.push(...products);
      }
    }

    // Add WooCommerce sellers
    for (const seller of wooCommerceSellers) {
      const products = await searchProductInWooCommerce(
        seller.shopLink,
        seller.consumerKey,
        seller.consumerSecret,
        productName
      );

      if (products.length > 0) {
        results.push(
          ...products.map((product) => ({
            name: product.name,
            price: product.price,
            description: product.description,
            shopLink: seller.shopLink,
          }))
        );
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

// Place Order Endpoint
const placeOrder = async (req, res) => {
  const { variantId, quantity, email, platform, shopLink } = req.body;

  try {
    let order;

    if (platform === 'Shopify') {
      const { createDraftOrder, completeDraftOrder } = require('./services/shopifyService');

      // Create a draft order
      const draftOrder = await createDraftOrder(variantId, quantity, email);
      const draftOrderId = draftOrder.id;

      // Complete the draft order
      order = await completeDraftOrder(draftOrderId);

    } else if (platform === 'WooCommerce') {
      const wooCommerceSeller = await WooCommerceSeller.findOne({ shopLink });

      if (!wooCommerceSeller) {
        return res.status(404).json({ message: "WooCommerce seller not found" });
      }

      const { consumerKey, consumerSecret } = wooCommerceSeller;

      const orderData = {
        payment_method: "bacs",
        payment_method_title: "Direct Bank Transfer",
        billing: {
          email,
        },
        line_items: [
          {
            product_id: variantId,
            quantity,
          },
        ],
      };

      // Place order in WooCommerce
      order = await placeOrderInWooCommerce(shopLink, consumerKey, consumerSecret, orderData);

    } else {
      return res.status(400).json({ message: "Invalid platform" });
    }

    return res.json({ message: 'Order successfully placed!', order });
  } catch (error) {
    console.error('Error in placing order:', error);
    return res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

module.exports = { commonsearchProduct, placeOrder };


// router.post('/place-order', async (req, res) => {
//     const { variantId, quantity, email } = req.body;
  
//     try {
//       // Create a draft order
//       const draftOrder = await createDraftOrder(variantId, quantity, email);
//       console.log('Draft order created:', draftOrder);
  
//       // Complete the draft order (finalize the order)
//       const draftOrderId = draftOrder.id;
//       const completedOrder = await completeDraftOrder(draftOrderId);
//       console.log('Order completed:', completedOrder);
  
//       return res.json({ message: 'Order successfully completed!', order: completedOrder });
//     } catch (error) {
//       console.error('Error in placing order:', error);
//       return res.status(500).json({ message: 'Failed to place order', error: error.message });
//     }
//   });


// router.post("/", searchProduct);
