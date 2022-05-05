const mongoose = require("mongoose");

const DeliveryPersonSchema = new mongoose.Schema({
    strDriverCode: {
        type: String,
    },
    strDriverName: {
        type: String,
    },
    booAvailable: {
        type: Boolean,
        default: true
    },
    strOrderNo: {
        type: String,
        default: ""
    },
});

module.exports = mongoose.model("drivers", DeliveryPersonSchema, "drivers");