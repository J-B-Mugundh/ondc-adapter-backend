const axios = require('axios');

// Function to create Axios instance for WooCommerce
const createAxiosInstance = (shopLink, consumerKey, consumerSecret) => {
  const base64Auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  return axios.create({
    baseURL: `${shopLink}/wp-json/wc/v3`,
    headers: {
      Authorization: `Basic ${base64Auth}`,
    },
  });
};

// Function to search for products by name in WooCommerce
const searchProductInWooCommerce = async (shopLink, consumerKey, consumerSecret, productName, businessName) => {
  const axiosInstance = createAxiosInstance(shopLink, consumerKey, consumerSecret);

  try {
    const response = await axiosInstance.get('/products', {
      params: { search: productName },
    });

    return response.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.categories.map((cat) => cat.name).join(', '), // Combine all categories into a single string
      images: product.images.map((image) => image.src),
      price: {
        amount: parseFloat(product.price), // Ensure amount is a number
        currency: product.currency, // WooCommerce usually uses the store's default currency
      },
      sellerName: businessName,
      shopLink: shopLink,
      sellerPlatform: 'woocommerce',
    }));
  } catch (error) {
    console.error('Error in searching product:', error);
    throw new Error("Failed to fetch product from WooCommerce");
  }
};

module.exports = {
  searchProductInWooCommerce,
};
