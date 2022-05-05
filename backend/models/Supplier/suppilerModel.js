const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
    strSupplierID:{
        type:String,
        required:true,
        unique:true
    },
    strSupplierName:{
        type:String,
        required:true
    },
    strSupplierEmail:{
        type:String,
        required:true
    },
    strSupplierContact:{
        type:Number,
        required:true,
    
    },
    strSupplierAddress:{
        type:String,
        required:true
    },
    strSupplierItemNo:{
        type:Number,
        required:true
    },
    strSupplierItemName:{
        type:String,
        required:true
    }

});

module.exports = mongoose.model("SupplierDetails", SupplierSchema);