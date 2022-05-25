const mongoose = require("mongoose");

const ItemModelSchema = new mongoose.Schema({
    strItemCode: {
        type: String,
        unique: true
    },
    strItemCode: {
        type: String,
    },
    strType: {
        type: String,  
    },
    strFileName: {
        type: String,
    },
    strStatus: {
        type: String,
    },
    dblPrice: {
        type: Number,
        
    },
    dblQty: {
        type: Number,
    }
});

module.exports = mongoose.model("Item", ItemModelSchema);