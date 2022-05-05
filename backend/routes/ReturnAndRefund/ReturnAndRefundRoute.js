const path = require('path');
const router = require("express").Router();

const ApiResult = require("../../models/Common/ApiResult");
const OrderModel = require('../../models/Shop/OrderModel');
const ItemModel = require('../../models/Shop/ItemModel');
const ReturnAndRefundModel = require('../../models/ReturnAndRefund/ReturnAndRefundModel');

router.post("/createRefundReq", async (req, res) => {
    const reqObj = JSON.parse(req.body.ReturnReqObj);
    try {
        if(req.files.Evidence1 && req.files.Evidence2) {
            await req.files.Evidence1.mv(path.resolve(`./public/ItemReturnEvidence/${reqObj.strOrderNo + "-" + req.files.Evidence1.name}`));
            await req.files.Evidence2.mv(path.resolve(`./public/ItemReturnEvidence/${reqObj.strOrderNo + "-" + req.files.Evidence2.name}`));

            const resSave = await new ReturnAndRefundModel({
                strOrderReplaceNo: "RRR" + Date.now().toString().substring(0,7),
                strOrderNo: reqObj.strOrderNo,
                arrItem: reqObj.arrItemsReplace,
                arrEvidenceImgPath: [
                    `/ItemReturnEvidence/${reqObj.strOrderNo + "-" + req.files.Evidence1.name}`,
                    `/ItemReturnEvidence/${reqObj.strOrderNo + "-" + req.files.Evidence2.name}`
                ],
                strUserMessage: reqObj.strUserMessage
            }).save();

            res.send(new ApiResult(true, "Sucessfully create the return request! ReturnRequstCode: " + resSave.strOrderReplaceNo));
        }
        else {
            res.send(new ApiResult(false, "Please upload 2 evidence photos!"));
        }
    } catch (err) {
        res.send(new ApiResult(false, err.message));
    }
});

router.get("/getOrderDetails", async (req, res) => {
    const resOrders = await OrderModel.find({ }, { _id: 0 });
    if (resOrders.length) return res.send(new ApiResult(true, resOrders));
    else return res.send(new ApiResult(false, "No data found"));
});

router.get("/getItemDetails", async (req, res) => {
    const resItems = await ItemModel.find({ }, { _id: 0 });
    if (resItems.length) return res.send(new ApiResult(true, resItems));
    else return res.send(new ApiResult(false, "No data found"));
});

router.get("/getReturnReqDetails", async (req, res) => {
    const resReturnReqs = await ReturnAndRefundModel.find({ }, { _id: 0 });
    if (resReturnReqs.length) return res.send(new ApiResult(true, resReturnReqs));
    else return res.send(new ApiResult(false, "No data found"));
});

router.post("/ApproveRefundReq", async (req, res) => {
    try {
        const resUpdate = await ReturnAndRefundModel.findOneAndUpdate(
            { strOrderReplaceNo: req.body.strReqOrderNo },
            { booApproveStatus: true, strAdminMessage: req.body.strAdminMsg  }
        );
        res.send(new ApiResult(true, "Sucessfully approve the return request! ReturnRequstCode: " + req.body.strReqOrderNo));
    } catch (err) {
        res.send(new ApiResult(false, err.message));
    }
});

router.post("/RejectRefundReq", async (req, res) => {
    try {
        const resDelete = await ReturnAndRefundModel.findOneAndDelete(
            { strOrderReplaceNo: req.body.strReqOrderNo },
        );
        res.send(new ApiResult(true, "Sucessfully reject the return request! ReturnRequstCode: " + req.body.strReqOrderNo));
    } catch (err) {
        res.send(new ApiResult(false, err.message));
    }
});

module.exports = router;
