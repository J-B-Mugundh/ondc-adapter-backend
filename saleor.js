const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Saleor shop link and authorization token
const SALEOR_SHOP_LINK = 'https://store-itll3hh6.saleor.cloud/graphql/';
const SALEOR_AUTH_TOKEN = '0rHFQdjk2q7P7T7yJGip1MKg4HzuNp';

app.use(express.json());

// Helper function for executing GraphQL queries
const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(
      SALEOR_SHOP_LINK,
      { query, variables },
      {
        headers: {
          "authorization": "Bearer 0rHFQdjk2q7P7T7yJGip1MKg4HzuNp"
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error making GraphQL request:', error);

    // Enhanced error handling to get the complete error response
    if (error.response) {
      console.error('Error Response:', JSON.stringify(error.response.data, null, 2));
      throw new Error(`GraphQL Error: ${JSON.stringify(error.response.data.errors || error.response.data)}`);
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
};

// Function to search for products by name
const searchProductByName = async (productName) => {
  const query = `
    query ($filter: ProductFilterInput!) {
      products(first: 5, filter: $filter) {
        edges {
          node {
            id
            name
            variants {
              id
              name
              pricing {
                price {
                  gross {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = {
    filter: {
      search: productName,
    },
  };

  const result = await graphqlRequest(query, variables);
  return result.data.products.edges;
};

// Function to create a checkout (initiates a new checkout process)
const createCheckout = async (variantId, quantity, email) => {
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
  const result = await graphqlRequest(query);
  return result.data.checkoutCreate.checkout;
};

// Function to update checkout with shipping, billing address, email, and automatically select default shipping method
const updateCheckoutWithAddress = async (checkoutId, shippingAddress, billingAddress, email) => {
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
          country: US
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
          country: US
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

  const variables = {
    checkoutId,
    shippingAddress,
    billingAddress,
    email,
  };

  const result = await graphqlRequest(query, variables);

  // Extract the default shipping method ID from the shippingMethods array
  const defaultShippingMethod = result.data.checkoutEmailUpdate.checkout.shippingMethods.find(method => method.name === "Default");

  if (defaultShippingMethod) {
    // Update the checkout with the selected default shipping method
    const deliveryMethodId = defaultShippingMethod.id;
    console.log('Selected default Shipping Method:', defaultShippingMethod);

    // Update checkout with the default delivery method
    const deliveryMethodUpdateQuery = `
      mutation {
        checkoutDeliveryMethodUpdate(
          id: "${checkoutId}"
          deliveryMethodId: "${deliveryMethodId}"
        ) {
          errors {
            field
            message
          }
        }
      }
    `;
    // Execute the delivery method update
    const updateResult = await graphqlRequest(deliveryMethodUpdateQuery);
    console.log('Delivery Method Update Response:', updateResult);
  } else {
    console.error('Default shipping method not found');
  }

  return result.data.checkoutEmailUpdate.checkout;
};

// Function to place an order using checkout ID
const placeOrder = async (checkoutId) => {
  if (!checkoutId) {
    throw new Error('Invalid checkoutId: Undefined or null.');
  }

  // Log the checkoutId to confirm it is being passed correctly
  console.log('Placing order with checkoutId:', checkoutId);

  const query = `
    mutation PlaceOrder($checkoutId: ID!) {
      orderCreateFromCheckout(id: $checkoutId) {
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

  const variables = { checkoutId };

  try {
    const response = await graphqlRequest(query, variables);

    // Log the full response to understand the structure
    console.log('Order Creation Response:', JSON.stringify(response, null, 2));

    if (response?.data?.orderCreateFromCheckout?.errors?.length > 0) {
      console.log('Errors:', response.data.orderCreateFromCheckout.errors);
      throw new Error('Error placing order: ' + JSON.stringify(response.data.orderCreateFromCheckout.errors));
    }

    if (response?.data?.orderCreateFromCheckout?.order) {
      console.log('Order created successfully:', response.data.orderCreateFromCheckout.order);
      return response.data.orderCreateFromCheckout.order;
    } else {
      console.log('No order created');
      throw new Error('Failed to create order, no order returned.');
    }

  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error('Failed to place order: ' + error.message);
  }
};

// API route to search products
app.post('/search-product', async (req, res) => {
  const { productName } = req.body;

  try {
    const searchResults = await searchProductByName(productName);

    if (searchResults.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    return res.json({ message: 'Products found', products: searchResults });
  } catch (error) {
    console.error('Error in searching product:', error);
    return res.status(500).json({ message: 'Failed to search product', error: error.message });
  }
});

// API route to create and update checkout
app.post('/create-and-update-checkout', async (req, res) => {
  const { variantId, quantity, email, shippingAddress, billingAddress } = req.body;

  try {
    // Step 1: Create a checkout
    const checkout = await createCheckout(variantId, quantity, email);
    console.log('Checkout created:', checkout);

    // Step 2: Update checkout with shipping and billing addresses and email
    const updatedCheckout = await updateCheckoutWithAddress(checkout.id, shippingAddress, billingAddress, email);
    console.log('Checkout updated with address:', updatedCheckout);

    return res.json({ message: 'Checkout created and updated successfully!', checkout: updatedCheckout });
  } catch (error) {
    console.error('Error in creating or updating checkout:', error);
    return res.status(500).json({ message: 'Failed to create or update checkout', error: error.message });
  }
});

// API route to place an order
app.post('/place-order', async (req, res) => {
  const { checkoutId } = req.body;

  try {
    const order = await placeOrder(checkoutId);
    console.log('Order placed successfully:', order);
    return res.json({ message: 'Order placed successfully!', order });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
