const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
    strItemID:{
        type:String,
        required:true,
        unique:true
    },
    strItemName:{
        type:String,
        required:true
    },
    strDescription:{
        type:String,
        required:true
    },
    strBrand:{
        type:String,
        required:true,
    
    },
    strCategory:{
        type:String,
        required:true
    },
    strQuantity:{
        type:Number,
        required:true
    },
    strColor:{
        type:String,
        required:true
    },
    strPrice:{
        type:String,
        required:true
    },
  

});

module.exports = mongoose.model("StockDetails", StockSchema);