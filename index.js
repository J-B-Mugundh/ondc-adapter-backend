const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const shopifySellerRoutes = require('./routes/shopifySellerRoutes');
const saelorSellerRoutes = require('./routes/saelorSellerRoutes');
const wooCommerceSellerRoutes = require('./routes/wooCommerceSellerRoutes');
const searchRoutes = require("./routes/searchRoutes");
const cartRoutes = require("./routes/cartRoutes");
const ordersRoute = require('./routes/ordersRoute');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Routes

app.use('/ondc/search', searchRoutes)
app.use('/ondc/shopify', shopifySellerRoutes);
app.use('/ondc/saelor', saelorSellerRoutes);
app.use('/ondc/woocommerce', wooCommerceSellerRoutes);
app.use('/ondc/cart', cartRoutes)
app.use('/ondc/search', searchRoutes)
app.use('/ondc/orders', ordersRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(5000, () => {
  console.log(`Server running on port 5000!`);
});