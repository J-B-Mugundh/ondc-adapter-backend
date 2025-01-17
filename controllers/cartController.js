const cartService = require("../services/cartService");

// Controller for handling the /cart endpoint
exports.processCart = async (req, res, next) => {
  try {
    const { variantId, quantity, saleorUrl, authToken } = req.body;

    if (!variantId || !quantity || !saleorUrl || !authToken) {
      return res.status(400).json({
        error: "variantId, quantity, saleorUrl, and authToken are required",
      });
    }

    const email = "customer@example.com";
    const defaultAddress = {
      firstName: "John",
      lastName: "Doe",
      streetAddress1: "123 Main St",
      city: "New York",
      postalCode: "10001",
      countryArea: "NY",
    };

    // Process the checkout and place the order
    const result = await cartService.processOrder(
      variantId,
      quantity,
      email,
      defaultAddress,
      saleorUrl,
      authToken
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
