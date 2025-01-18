const axios = require('axios');
const https = require('https');


// Function to create Axios instance for WooCommerce
const createAxiosInstance = (shopLink, consumerKey, consumerSecret) => {
  const base64Auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  return axios.create({
    baseURL: `${shopLink}/wp-json/wc/v3`,
    headers: {
      Authorization: `Basic ${base64Auth}`,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // For self-signed SSL certificates
    }),
  });
};

// Function to search for a product in WooCommerce
const searchProductInWooCommerce = async (shopLink, consumerKey, consumerSecret, productName) => {
  const axiosInstance = createAxiosInstance(shopLink, consumerKey, consumerSecret);

  try {
    const response = await axiosInstance.get('/products', {
      params: { search: productName },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products from WooCommerce:', error.response?.data || error.message);
    return [];
  }
};

// Function to place an order in WooCommerce
const placeOrderInWooCommerce = async (shopLink, consumerKey, consumerSecret, orderData) => {
  const axiosInstance = createAxiosInstance(shopLink, consumerKey, consumerSecret);

  try {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order in WooCommerce:', error.response?.data || error.message);
    throw new Error('Error placing order in WooCommerce');
  }
};

module.exports = {
  searchProductInWooCommerce,
  placeOrderInWooCommerce,
};

