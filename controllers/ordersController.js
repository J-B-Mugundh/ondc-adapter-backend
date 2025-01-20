const axios = require('axios');
const { getCustomerName } = require('../utils.js');

// Shopify Configuration
const SHOPIFY_STORE_DOMAIN = 'testing-adapter.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

// Saleor Configuration
const SALEOR_SHOP_LINK = 'https://store-itll3hh6.saleor.cloud/graphql/';
const SALEOR_AUTH_TOKEN = '0rHFQdjk2q7P7T7yJGip1MKg4HzuNp';

// WooCommerce Configuration
const WOO_COMMERCE_STORE_URL = 'https://mywoostore.local/wp-json/wc/v3';
const WOO_COMMERCE_CONSUMER_KEY = 'ck_58e1497426bb5eeb6df40af9c0b9f5ecd9582716';
const WOO_COMMERCE_CONSUMER_SECRET = 'cs_42d4206cbc2ed17ef1daa19ba966d74bb1fe3bdc';

const fetchShopifyOrders = async () => {
  try {
    // Fetch orders from Shopify API
    const response = await axios.get(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2023-01/orders.json`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
        params: {
          limit: 10,
          order: 'created_at desc', 
        },
      }
    );
    
    return response.data.orders.map(order => ({
      id: order.id,
      platform: 'Shopify',
      total_price: order.total_price,
      customer: order.customer?.first_name && order.customer?.last_name
        ? order.customer.first_name + ' ' + order.customer.last_name
        : getCustomerName(), // Assuming getCustomerName() is a function that provides a fallback name
      created_at: order.created_at,
      order_status: order.fulfillment_status || 'Unfulfilled',
      payment_status: order.financial_status || 'Pending',
      delivery_status: order.fulfillment_status === 'fulfilled' ? 'Delivered' : 'In Progress',
    }));
  } catch (error) {
    console.error('Error fetching Shopify orders:', error);
    return []; // Return an empty array if there's an error
  }
};

  // Fetch Saleor Orders
  const fetchSaleorOrders = async () => {
    const query = `
      query {
        orders(first: 10) {
          edges {
            node {
              id
              created
              statusDisplay
              paymentStatus
              fulfillments {
                status
              }
              total {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    `;
    const response = await axios.post(
      SALEOR_SHOP_LINK,
      { query },
      {
        headers: {
          Authorization: `Bearer ${SALEOR_AUTH_TOKEN}`,
        },
      }
    );
  
    return response.data.data.orders.edges.map(edge => ({
      id: edge.node.id,
      platform: 'Saleor',
      total_price: `${edge.node.total.gross.amount} ${edge.node.total.gross.currency}`,
      created_at: edge.node.created,
      order_status: edge.node.statusDisplay || 'Unknown',
      payment_status: edge.node.paymentStatus || 'Pending',
      delivery_status: edge.node.fulfillments?.[0]?.status || 'Not Shipped',
      customer: getCustomerName(),
    }));
  };
  

// Fetch WooCommerce Orders
const fetchWooCommerceOrders = async () => {
  const response = await axios.get(`${WOO_COMMERCE_STORE_URL}/orders`, {
    auth: {
      username: WOO_COMMERCE_CONSUMER_KEY,
      password: WOO_COMMERCE_CONSUMER_SECRET,
    },
  });

  return response.data.map(order => ({
    id: order.id,
    platform: 'WooCommerce',
    total_price: order.total,
    customer: order.billing.first_name && order.billing.last_name
      ? order.billing.first_name + ' ' + order.billing.last_name
      : getCustomerName(),
    created_at: order.date_created,
    order_status: order.status || 'Unknown',
    payment_status: order.payment_method_title || 'Unknown', 
    delivery_status: order.status === 'completed' ? 'Delivered' : 'In Progress', 
  }));
};

// Fetch All Orders
const getAllOrders = async (req, res) => {
  const { platform } = req.query; // Example: ?platform=Shopify

  try {
    let allOrders = [];
    if (!platform || platform === 'Shopify') {
      allOrders.push(...(await fetchShopifyOrders()));
    }
    if (!platform || platform === 'Saleor') {
      allOrders.push(...(await fetchSaleorOrders()));
    }
    // if (!platform || platform === 'WooCommerce') {
    //   allOrders.push(...(await fetchWooCommerceOrders()));
    // }

    res.json(allOrders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

module.exports = { getAllOrders };
