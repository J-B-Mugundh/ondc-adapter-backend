const cartService = require("../services/cartService");
const { placeOrderInWooCommerce } = require("../woocom");
//const { processShopifyOrder } = require("../shopify"); // Example Shopify order function

// Controller for handling the /cart endpoint
exports.processCart = async (req, res, next) => {
  try {
    const { platforms } = req.body;

    if (!platforms || !Array.isArray(platforms)) {
      return res.status(400).json({ error: "Platforms array is required in the request body" });
    }

    const results = [];

    for (const platformDetails of platforms) {
      const { platform } = platformDetails;

      if (!platform) {
        results.push({ error: "Platform is missing in one of the entries" });
        continue;
      }

      let result = null;

      switch (platform.toLowerCase()) {
        case "saleor":
          const { variantId, quantity, saleorUrl, authToken } = platformDetails;
          if (!variantId || !quantity || !saleorUrl || !authToken) {
            results.push({
              platform: "saleor",
              error: "variantId, quantity, saleorUrl, and authToken are required for Saleor",
            });
            continue;
          }

          const saleorEmail = "customer@example.com";
          const saleorAddress = {
            firstName: "John",
            lastName: "Doe",
            streetAddress1: "123 Main St",
            city: "New York",
            postalCode: "10001",
            countryArea: "NY",
          };

          result = await cartService.processOrder(
            variantId,
            quantity,
            saleorEmail,
            saleorAddress,
            saleorUrl,
            authToken
          );
          break;

        case "woocommerce":
          const { product_id, shopLink, consumerKey, consumerSecret, quantity: wooQuantity } = platformDetails;
          if (!product_id || !shopLink || !consumerKey || !consumerSecret) {
            results.push({
              platform: "woocommerce",
              error: "product_id, shopLink, consumerKey, and consumerSecret are required for WooCommerce",
            });
            continue;
          }

          const wooUserDetails = {
            billing: {
              first_name: "Jane",
              last_name: "Doe",
              address_1: "123 Elm Street",
              city: "Los Angeles",
              state: "CA",
              postcode: "90001",
              country: "US",
              email: "jane.doe@example.com",
              phone: "9876543210",
            },
            line_items: [
              {
                product_id: product_id,
                quantity: wooQuantity,
              },
            ],
          };

          result = await placeOrderInWooCommerce(shopLink, consumerKey, consumerSecret, wooUserDetails);
          break;

        /*case "shopify":
          const { product_id: shopifyProductId, quantity: shopifyQuantity, shopifyAccessToken } = platformDetails;
          if (!shopifyProductId || !shopifyQuantity || !shopifyAccessToken) {
            results.push({
              platform: "shopify",
              error: "product_id, quantity, and shopifyAccessToken are required for Shopify",
            });
            continue;
          }

          result = await processShopifyOrder(shopifyProductId, shopifyQuantity, shopifyAccessToken);
          break;*/

        default:
          results.push({ platform, error: "Unsupported platform" });
          continue;
      }

      results.push({ platform, result });
    }

    // Return the combined results for all platforms
    res.status(200).json({ results });
  } catch (error) {
    next(error);
  }
};
