const mongoose = require("mongoose");

const InqSchema = new mongoose.Schema({
  strInqId: {
    type: String,
    required: true,
    max: 10,
  },
  strCustFName: {
    type: String,
    required: true,
    max: 50,
  },
  strCustLName: {
    type: String,
    required: true,
    max: 50,
  },
  strCustMobileNo: {
    type: String,
    required: true,
    max: 10,
  },
  strInqType: {
    type: String,
    required: true,
    max: 50,
  },
  strMessage: {
    type: String,
    required: true,
  },
  strStatus: {
    type: String,
    required: true,
    max: 1,
    default: "N"
  },
  strAdminReply: {
    type: String,
  },
  dtmReplyDate: {
    type: Date,
  },
  dtmInqDate: {
    type: Date,
    default: Date.now
  },
  strOrderNo: {
    type: String,
    required: true,
    max: 10,
  },
});

module.exports = mongoose.model("Inquiry", InqSchema);