const axios = require('axios');
const https = require('https');

// Function to create Axios instance for WooCommerce
const createAxiosInstance = (shopLink, consumerKey, consumerSecret) => {
  // Clean up consumerKey and consumerSecret to remove any extra spaces or line breaks
  const cleanedConsumerKey = consumerKey.trim();
  const cleanedConsumerSecret = consumerSecret.trim();

  // Generate Base64 Auth using cleaned values
  const base64Auth = Buffer.from(`${cleanedConsumerKey}:${cleanedConsumerSecret}`).toString('base64');
  console.log('Base64 Auth (Cleaned):', base64Auth);

  // Verify correctness
  const testKey = 'ck_58e1497426bb5eeb6df40af9c0b9f5ecd9582716';
  const testSecret = 'cs_42d4206cbc2ed17ef1daa19ba966d74bb1fe3bdc';
  const testBase64Auth = Buffer.from(`${testKey}:${testSecret}`).toString('base64');
  console.log('Expected Base64 Auth:', testBase64Auth);

  if (base64Auth !== testBase64Auth) {
    console.error('Base64 Auth mismatch. Check your consumerKey and consumerSecret inputs.');
  }

  // Create Axios instance
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
