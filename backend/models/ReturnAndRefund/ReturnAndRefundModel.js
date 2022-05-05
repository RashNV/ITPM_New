const mongoose = require("mongoose");

const ReturnAndRefundSchema = new mongoose.Schema({
    strOrderReplaceNo: {
        type: String,
        unique: true,
        required: true,
        max: 10,
    },
    strOrderNo: {
        type: String,
        required: true,
        max: 50,
    },
    arrItem: [
        {
            strItemCode: {
                type: String,
                required: true,
                max: 10,
            },
            strOldItemCode: {
                type: String,
                required: true,
                max: 10,
            },
            strName: {
                type: String,
                required: true,
                max: 50,
            }
        }
    ],
    arrEvidenceImgPath: [],
    strUserMessage: {
        type: String,
        required: true,
        max: 100,
    },
    strAdminMessage: {
        type: String,
        max: 100,
    },
    booApproveStatus: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("ReturnAndRefund", ReturnAndRefundSchema);