const express = require("express");
const cors = require("cors");
const connectDB=require('./database/db');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});