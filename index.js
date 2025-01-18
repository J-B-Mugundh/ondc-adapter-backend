const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const shopifySellerRoutes = require('./routes/shopifySellerRoutes');
const saelorSellerRoutes = require('./routes/saelorSellerRoutes');
const wooCommerceSellerRoutes = require('./routes/wooCommerceSellerRoutes');




const app = express();

// Connect to the database
connectDB();

app.use(cors({
  origin: 'http://localhost:3000', // Allow only the frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Include credentials like cookies if needed
}));
// Middleware
app.use(express.json());

// Routes
app.use('/ondc/shopify', shopifySellerRoutes);
app.use('/ondc/saelor', saelorSellerRoutes);
app.use('/ondc/woocommerce', wooCommerceSellerRoutes);

app.listen(5000, () => {
  console.log(`Server running on port 5000!`);
});