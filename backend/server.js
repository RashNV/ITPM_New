// Import Packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require('morgan');

// Init express app
const app = express();

// Env file config
dotenv.config();

// Config PORT
const PORT = 5000;

// Connect DB
mongoose.connect(
    process.env.DB_CONTEXT,
    {  }, //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
    (err) => {
        if (err) throw err;
        console.log("Connected to the mongodb");
    }
);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Import routes
const InquiryRoute = require("./routes/Inquiry/InquiryRoute");
const ShopRoutes = require("./routes/Shop/ShopRoute");
const SupplierRoute = require("./routes/Supplier/SupplierRoute")

// Config routes
app.use("/api/inquiry", InquiryRoute);
app.use("/api/shop", ShopRoutes);
app.use("/api/supplier",SupplierRoute);

// Start server
app.listen(PORT, () => {
    console.log("Server is up and running on server on " + PORT);
});