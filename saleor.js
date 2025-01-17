const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Saleor shop link and authorization token
const SALEOR_SHOP_LINK = 'https://store-vaqfnffi.saleor.cloud/graphql/';
const SALEOR_AUTH_TOKEN = 'b1d6d4627c3b41af97a41c38a5ce642a.XHZK6oS5CTpMemHemvi55Z9gGvuUt6pQpFOIIqagmid8kyYf';

app.use(express.json());

// Helper function for GraphQL requests
const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(
      SALEOR_SHOP_LINK,
      { query, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SALEOR_AUTH_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error making GraphQL request:', error);
    throw new Error(error.response ? error.response.data.errors : error.message);
  }
};

// Search for products by name
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

// Create a draft order
const createDraftOrder = async (variantId, quantity, email) => {
  const query = `
    mutation ($input: DraftOrderCreateInput!) {
      draftOrderCreate(input: $input) {
        order {
          id
          status
        }
        errors {
          field
          message
        }
      }
    }
  `;
  const variables = {
    input: {
      lines: [
        {
          variantId: variantId,
          quantity: quantity,
        },
      ],
      user: {
        email: email,
      },
    },
  };

  const result = await graphqlRequest(query, variables);
  return result.data.draftOrderCreate.order;
};

// Complete the draft order (finalize the order)
const completeDraftOrder = async (orderId) => {
  const query = `
    mutation ($id: ID!) {
      orderMarkAsPaid(id: $id) {
        order {
          id
          status
        }
        errors {
          field
          message
        }
      }
    }
  `;
  const variables = { id: orderId };

  const result = await graphqlRequest(query, variables);
  return result.data.orderMarkAsPaid.order;
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

// API route to place an order
app.post('/place-order', async (req, res) => {
  const { variantId, quantity, email } = req.body;

  try {
    // Create a draft order
    const draftOrder = await createDraftOrder(variantId, quantity, email);
    console.log('Draft order created:', draftOrder);

    // Complete the draft order
    const completedOrder = await completeDraftOrder(draftOrder.id);
    console.log('Order completed:', completedOrder);

    return res.json({ message: 'Order successfully completed!', order: completedOrder });
  } catch (error) {
    console.error('Error in placing order:', error);
    return res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
