const axios = require("axios");

const searchProductInShop = async (shopUrl, authToken, businessName, productName) => {
  try {
    console.log(`Searching product: ${productName} in shop URL: ${shopUrl}`);

    const query = `
    query {
        products(search: "${productName}", first: 10, channel: "default-channel") {
        edges {
            node {
            id
            name
            slug
            description
            category {
                name
            }
            images {
                url
            }
            pricing {
                priceRange {
                start {
                    net {
                    amount
                    currency
                    }
                }
                }
            }
            }
        }
        }
    }
    `;

    // console.log('GraphQL Query:', query);

    // Make the request to Saleor
    const response = await axios.post(
      `${shopUrl}/graphql/`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${authToken}`, 
          "Content-Type": "application/json", 
        },
      }
    );

    console.log('Saleor API Response:', response.data);

    if (response.data.errors) {
      console.error('Saleor API Errors:', response.data.errors);
      throw new Error(`Saleor API returned errors: ${JSON.stringify(response.data.errors)}`);
    }

    // If no products found, return an empty array
    if (response.data.data.products.edges.length === 0) {
      return [];
    }

    // Return the product details with price as separate amount and currency
    return response.data.data.products.edges.map(product => {
      const pricing = product.node.pricing?.priceRange?.start;

      // Check if price is available (net)
      const amount = pricing?.net?.amount || null;
      const currency = pricing?.net?.currency || null;

      return {
        name: product.node.name,
        slug: product.node.slug,
        description: product.node.description || "No description available",
        category: product.node.category.name,
        images: product.node.images.map(image => image.url),
        price: amount ? { amount, currency } : { amount: "N/A", currency: "N/A" },
        sellerName: businessName
      };
    });
  } catch (error) {
    console.error("Error fetching product from Saleor:", error.message);
    if (error.response) {
      console.error("Saleor API Response:", error.response.data);
      console.error("Status code:", error.response.status);
    }
    throw new Error("Failed to fetch product from Saleor");
  }
};

module.exports = { searchProductInShop };
