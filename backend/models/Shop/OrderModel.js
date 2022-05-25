const mongoose = require("mongoose");

const OrderModelSchema = new mongoose.Schema({
    strOrderNo: {
        type: String,
      },
      strCustCode: {
        type: String,
      },
      strCustName: {
        type: String,
      },
      strAddress: {
        type: String,
      },
      strCity: {
        type: String,
      },
      strContactNo: {
        type: String,
      },
      dtmOrderDate: {
        type: Date,
      },
      strStatus: {
        type: String,
      },
       dblTotPrice: {
        type: Number,
      },
       strDeliveryStatus: {
        type: String,
      },
      arrItem: [
        {
            strItemId: {
            type: String,
                },
            strItemName: {
            type: String,
                },
            intQty: {
            type: Number,
                },
            dblUnitPrice: {
            type: Number,
                },
        },
      ],
      strPaymentMethod: {
        type: String,
      },
      strCardNo: {
        type: String,
      },
      strCardHolder: {
        type: String,
      },
      dtmExpDate: {
        type: String,
      },
      booInquiry: {
        type: Boolean,
        default: false,
      }
});

module.exports = mongoose.model("Order", OrderModelSchema);