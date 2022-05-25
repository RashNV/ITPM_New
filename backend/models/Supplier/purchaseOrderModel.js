const mongoose = require("mongoose");

const PurchaseOrderSchema = new mongoose.Schema({
    arrSuppliers:[
        {
            strSupplierID:{
                type:String,
                required:true,
            },
            strSupplierName:{
                type:String,
                required:true
            }
        }
    ],
    strPurchaseOderID:{
        type:String,
        required:true,
        unique:true
    },
    strProductID:{
        type:String,
        required:true
    },
    strDate:{
        type:String,
        required:true
    },
    strQuantity:{
        type:Number,
        required:true
    },
    strUnitPrice:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model("PurchaseOrderDetails", PurchaseOrderSchema);