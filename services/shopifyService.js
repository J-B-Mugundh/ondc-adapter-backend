const { default: axios } = require("axios");

// const SHOPIFY_STORE_DOMAIN = 'testing-adapter.myshopify.com';
// const SHOPIFY_ACCESS_TOKEN = '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';

const graphqlRequest = async (query,SHOPIFY_STORE_DOMAIN,SHOPIFY_ACCESS_TOKEN) => {
  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2023-01/graphql.json`;

  try {
    const response = await axios.post(url, { query }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error making GraphQL request:', error);
    throw new Error(error.response ? error.response.data.errors : error.message);
  }
};

// Search for products by name

const searchProductByName = async (productName,SHOPIFY_STORE_DOMAIN,SHOPIFY_ACCESS_TOKEN,businessName) => {
  const query = `
    query {
      products(first: 5, query: "title:${productName}*") {
        edges {
          node {
            id
            title
            description
            productType
            images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;
  
  const result = await graphqlRequest(query,SHOPIFY_STORE_DOMAIN,SHOPIFY_ACCESS_TOKEN);
  return result.data.products.edges.map(product => ({
    id: product.node.id,
    name: product.node.title,
    description: product.node.description,
    category: product.node.productType, 
    image: product.node.images.edges.length > 0 ? product.node.images.edges[0].node.src : null,
    price: product.node.priceRange.minVariantPrice.amount,
    sellerName: businessName
  }));
};
// Create a draft order
const createDraftOrder = async (variantId, quantity, email, SHOPIFY_STORE_DOMAIN,SHOPIFY_ACCESS_TOKEN) => {
  const query = `
    mutation {
      draftOrderCreate(input: {
        lineItems: [
          { variantId: "${variantId}", quantity: ${quantity} }
        ],
        email: "${email}"
      }) {
        draftOrder {
          id
          name
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await graphqlRequest(query, SHOPIFY_STORE_DOMAIN,SHOPIFY_ACCESS_TOKEN);
  console.log(result);

  return result.data.draftOrderCreate.draftOrder;
};

// Complete the draft order (finalize the order)
const completeDraftOrder = async (draftOrderId,SHOPIFY_STORE_DOMAIN,SHOPIFY_ACCESS_TOKEN) => {
  const query = `
    mutation {
      draftOrderComplete(id: "${draftOrderId}") {
        draftOrder {
          id
          name
          status
          order {
            id
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await graphqlRequest(query,SHOPIFY_STORE_DOMAIN,SHOPIFY_ACCESS_TOKEN);
  console.log(result);
  return result.data.draftOrderComplete.draftOrder.order;
};


const searchProductInShopify = async (SHOPIFY_STORE_DOMAIN, SHOPIFY_ACCESS_TOKEN, businessName, productName) => {
  console.log(`Searching product: ${productName} in shop URL: ${SHOPIFY_STORE_DOMAIN}`);
    try {
      const searchResults = await searchProductByName(productName,SHOPIFY_STORE_DOMAIN,SHOPIFY_ACCESS_TOKEN,businessName);
      return searchResults;
    } catch (error) {
      console.error('Error in searching product:', error);
      throw new Error("Failed to fetch product from Shopify");
    }
  }

module.exports={
    searchProductByName,
    createDraftOrder,
    completeDraftOrder,
    searchProductInShopify
};

