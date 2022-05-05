// Import Packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
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
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));

// Import routes
const InquiryRoute = require("./routes/Inquiry/InquiryRoute");
const ShopRoutes = require("./routes/Shop/ShopRoute");
const ReturnAndRefundRoute = require("./routes/ReturnAndRefund/ReturnAndRefundRoute");
const DeliveryManagementRoutes = require("./routes/DeliveryManagement/DeliveryManagementRoute");
const SupplierRoute = require("./routes/Supplier/SupplierRoute");
const StockRoute = require("./routes/Stock/StockRoute")
const BrandRoute = require("./routes/Brand/BrandRoute")

// Config routes
app.use("/api/inquiry", InquiryRoute);
app.use("/api/shop", ShopRoutes);
app.use("/api/returnAndRefund", ReturnAndRefundRoute);
app.use("/api/deliveryManagement", DeliveryManagementRoutes);
app.use("/api/supplier",SupplierRoute);
app.use("/api/stock",StockRoute);
app.use("/api/brand",BrandRoute);

// Start server
app.listen(PORT, () => {
    console.log("Server is up and running on server on " + PORT);
});