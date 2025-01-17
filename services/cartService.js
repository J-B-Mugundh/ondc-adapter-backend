const axios = require("axios");

// Function to process the order
exports.processOrder = async (
  variantId,
  quantity,
  email,
  defaultAddress,
  saleorUrl,
  authToken
) => {
  // Step 1: Create checkout
  const checkout = await createCheckout(variantId, quantity, email, saleorUrl, authToken);

  // Step 2: Update checkout with addresses
  const updatedCheckout = await updateCheckoutWithAddress(
    checkout.id,
    defaultAddress,
    defaultAddress,
    email,
    saleorUrl,
    authToken
  );

  // Step 3: Place the order
  const order = await placeOrder(checkout.id, saleorUrl, authToken);

  return {
    message: "Order successfully placed",
    order,
  };
};

// Create a new checkout
const createCheckout = async (variantId, quantity, email, saleorUrl, authToken) => {
  const query = `
    mutation {
      checkoutCreate(
        input: {
          channel: "default-channel"
          email: "${email}"
          lines: [{ quantity: ${quantity}, variantId: "${variantId}" }]
        }
      ) {
        checkout {
          id
          totalPrice {
            gross {
              amount
              currency
            }
          }
          quantity
        }
        errors {
          field
          message
        }
      }
    }
  `;

  const result = await graphqlRequest(query, saleorUrl, authToken);
  if (result.errors || result.data.checkoutCreate.errors.length > 0) {
    console.error("Checkout Creation Errors:", result.data.checkoutCreate.errors);
    throw new Error("Failed to create checkout");
  }
  return result.data.checkoutCreate.checkout;
};

// Update checkout with address and email
const updateCheckoutWithAddress = async (
  checkoutId,
  shippingAddress,
  billingAddress,
  email,
  saleorUrl,
  authToken
) => {
  const query = `
    mutation {
      checkoutShippingAddressUpdate(
        checkoutId: "${checkoutId}"
        shippingAddress: {
          firstName: "${shippingAddress.firstName}"
          lastName: "${shippingAddress.lastName}"
          streetAddress1: "${shippingAddress.streetAddress1}"
          city: "${shippingAddress.city}"
          postalCode: "${shippingAddress.postalCode}"
          country: "US"
          countryArea: "${shippingAddress.countryArea}"
        }
      ) {
        errors {
          field
          message
        }
      }

      checkoutBillingAddressUpdate(
        checkoutId: "${checkoutId}"
        billingAddress: {
          firstName: "${billingAddress.firstName}"
          lastName: "${billingAddress.lastName}"
          streetAddress1: "${billingAddress.streetAddress1}"
          city: "${billingAddress.city}"
          postalCode: "${billingAddress.postalCode}"
          country: "US"
          countryArea: "${billingAddress.countryArea}"
        }
      ) {
        errors {
          field
          message
        }
      }

      checkoutEmailUpdate(
        checkoutId: "${checkoutId}"
        email: "${email}"
      ) {
        checkout {
          shippingMethods {
            id
            name
          }
        }
        errors {
          field
          message
        }
      }
    }
  `;

  const result = await graphqlRequest(query, saleorUrl, authToken);

  // Log GraphQL response for debugging
  console.log("GraphQL Response:", JSON.stringify(result, null, 2));

  // Handle errors
  if (
    result.data.checkoutShippingAddressUpdate.errors.length > 0 ||
    result.data.checkoutBillingAddressUpdate.errors.length > 0 ||
    result.data.checkoutEmailUpdate.errors.length > 0
  ) {
    console.error("Address Update Errors:", result.data);
    throw new Error("Failed to update checkout address or email");
  }

  // Safeguard null `shippingMethods`
  const shippingMethods = result.data.checkoutEmailUpdate.checkout?.shippingMethods || [];
  if (shippingMethods.length === 0) {
    throw new Error("No shipping methods available");
  }

  return result.data.checkoutEmailUpdate.checkout;
};

// Place an order
const placeOrder = async (checkoutId, saleorUrl, authToken) => {
  const query = `
    mutation {
      orderCreateFromCheckout(id: "${checkoutId}") {
        order {
          id
          status
          lines {
            variantName
            quantity
          }
        }
        errors {
          field
          message
        }
      }
    }
  `;

  const result = await graphqlRequest(query, saleorUrl, authToken);
  if (result.data.orderCreateFromCheckout.errors.length > 0) {
    console.error("Order Placement Errors:", result.data.orderCreateFromCheckout.errors);
    throw new Error("Failed to place order");
  }
  return result.data.orderCreateFromCheckout.order;
};

// Helper function for GraphQL requests
const graphqlRequest = async (query, saleorUrl, authToken) => {
  try {
    const response = await axios.post(
      `${saleorUrl}/graphql/`,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("GraphQL Request Error:", error.response?.data || error.message);
    throw new Error("GraphQL request failed");
  }
};
