const express = require('express');
const axios = require('axios');
const https = require('https');
// Initialize Express app
const app = express();
const PORT = 3000;
// Middleware to parse JSON request bodies
app.use(express.json());
// WooCommerce Store Details
const WOO_COMMERCE_STORE_URL = 'https://mywoostore.local';
const WOO_COMMERCE_CONSUMER_KEY = 'ck_58e1497426bb5eeb6df40af9c0b9f5ecd9582716';
const WOO_COMMERCE_CONSUMER_SECRET = 'cs_42d4206cbc2ed17ef1daa19ba966d74bb1fe3bdc';
// Encoding Basic Auth
const base64Auth = Buffer.from(`${WOO_COMMERCE_CONSUMER_KEY}:${WOO_COMMERCE_CONSUMER_SECRET}`).toString('base64');
// Axios instance with custom HTTPS agent for self-signed SSL
const axiosInstance = axios.create({
  baseURL: `${WOO_COMMERCE_STORE_URL}/wp-json/wc/v3`,
  headers: {
    'Authorization': `Basic ${base64Auth}`,
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Allows self-signed SSL
  }),
});
// Endpoint to search for a product
app.get('/search', async (req, res) => {
  const { query } = req; // Expecting a query param like ?name=Time%20Stone
  const productName = query.name || '';
  try {
    const response = await axiosInstance.get('/products', {
      params: { search: productName },
    });
    res.json({
      message: 'Search successful!',
      data: response.data,
    });
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error fetching products',
      error: error.response?.data || error.message,
    });
  }
});
// Endpoint to place an order without customer ID
app.post('/order', async (req, res) => {
  const { billing, shipping, line_items } = req.body;
  // Validation: Check for required fields
  if (!billing || !line_items || line_items.length === 0) {
    return res.status(400).json({
      message: 'Invalid request. Please provide billing, line_items, and optional shipping.',
    });
  }
  const orderData = {
    payment_method: 'bacs', // Example: Bank transfer
    payment_method_title: 'Direct Bank Transfer',
    set_paid: true, // Set to false if payment is pending
    billing,
    shipping: shipping || billing, // Use billing as shipping if not provided
    line_items, // Example: [{ product_id: 93, quantity: 2 }]
  };
  try {
    // Create an order via WooCommerce REST API
    const response = await axiosInstance.post('/orders', orderData);
    res.json({
      message: 'Order placed successfully!',
      data: response.data,
    });
  } catch (error) {
    console.error('Error placing order:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error placing order',
      error: error.response?.data || error.message,
    });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});