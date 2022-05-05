const router = require("express").Router();
const ApiResult = require("../../models/Common/ApiResult");
const InquiryModel = require("../../models/Inquiry/InquiryModel");
const OrderModel = require("../../models/Shop/OrderModel");
const PrintController = require('../../models/Common/PrintController');

router.get("/getOrder", async (req, res) => {
  const resOrder = await OrderModel.aggregate([
    {
      $lookup: {
        from: "inquiries",
        localField: "strOrderNo",
        foreignField: "strOrderNo",
        as: "inq_info",
      },
    },
    { $unwind: { path: "$inq_info", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        strOrderNo: "$strOrderNo",
        strAddress: "$strAddress",
        dtmOrderDate: "$dtmOrderDate",
        dblTotPrice: "$dblTotPrice",
        strDeliveryStatus: "$strDeliveryStatus",
        booInquiry: "$booInquiry",
        inq_info: "$inq_info",
      },
    },
  ]);
  if (resOrder.length > 0) return res.send(new ApiResult(true, resOrder));
  else return res.send(new ApiResult(false, "No data found"));
});

router.post("/createInquiry", async (req, res) => {
  const resSave = await new InquiryModel(req.body).save();
  if (!resSave) return res.send(new ApiResult(false, resSave));

  const resUpdate = await OrderModel.findOneAndUpdate(
    { strOrderNo: req.body.strOrderNo },
    { $set: { booInquiry: true } }
  );
  if (!resUpdate) return res.send(new ApiResult(false, resUpdate));

  return res.send(new ApiResult(true, "Succesfully saved !"));
});

router.post("/deleteInquiry", async (req, res) => {
  const resDelete = await InquiryModel.findOneAndDelete({ strInqId: req.body.strInqId});
  if (!resDelete) return res.send(new ApiResult(false, resDelete));

  const resUpdate = await OrderModel.findOneAndUpdate(
    { strOrderNo: req.body.strOrderNo },
    { $set: { booInquiry: false } }
  );
  if (!resUpdate) return res.send(new ApiResult(false, resUpdate));

  return res.send(new ApiResult(true, "Succesfully deleted !"));
});

router.get("/getInquiries", async (req, res) => {
  const resInq = await InquiryModel.find();
  if (resInq.length > 0) return res.send(new ApiResult(true, resInq));
  else return res.send(new ApiResult(false, "No data found"));
});

router.post("/adminReply", async (req, res) => {
  const resUpdate = await InquiryModel.findOneAndUpdate(
    { strInqId: req.body.strInqId },
    { $set: { strAdminReply: req.body.strAdminReply, strStatus: "R", dtmReplyDate: new Date() } }
  );
  if (!resUpdate) return res.send(new ApiResult(false, resUpdate));

  return res.send(new ApiResult(true, "Succesfully saved !"));
});

router.post("/print", async (req, res) => {
  const resData = await InquiryModel.aggregate([
    {
      $project: {
          _id: 0,
          strInqId: 1,
          strName: { $concat: ["$strCustFName", " ", "$strCustLName"] },
          strMessage: 1,
          strOrderNo: 1,
          dtmInqDate: { $dateToString: { format: "%Y-%m-%d", date: "$dtmInqDate" } },
          dtmReplyDate: {
              $cond: { if: { $eq: ["$strStatus", "R"] }, then: { $dateToString: { format: "%Y-%m-%d", date: "$dtmReplyDate" } }, else: "NOT REPLY" }
          },
          strAdminReply: {
              $cond: { if: { $eq: ["$strStatus", "R"] }, then: "$strAdminReply", else: "NOT REPLY" }
          },
      }
  }
  ]);
  
  if(resData.length > 0){
    const resReport = await PrintController("InqDetails.hbs", {arrData: resData,  strReportName: "Inquiry Details Report"}, []);
    res.send(new ApiResult(resReport.booStatus, resReport.objResponse));
  } else res.send(new ApiResult(false, "No data found."));

});

module.exports = router;