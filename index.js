const express = require('express');
const connectDB = require('./config/db');
const shopifySellerRoutes = require('./routes/shopifySellerRoutes');
const saelorSellerRoutes = require('./routes/saelorSellerRoutes');
const wooCommerceSellerRoutes = require('./routes/wooCommerceSellerRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/ondc/shopify', shopifySellerRoutes);
app.use('/ondc/saelor', saelorSellerRoutes);
app.use('/ondc/woocommerce', wooCommerceSellerRoutes);

app.listen(3000, () => {
  console.log(`Server running on port 3000!`);
});