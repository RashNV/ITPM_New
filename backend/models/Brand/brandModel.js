const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    brandID:{
        type:String,
        required:true,
        unique:true
    },
    brandName:{
        type:String,
        required:true
    },
    brandDescription:{
        type:String,
        required:true
    }

});

module.exports = mongoose.model("BrandDetails", BrandSchema);