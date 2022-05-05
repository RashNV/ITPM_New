const router = require("express").Router();

const ApiResult = require("../../models/Common/ApiResult");
const OrderModel = require("../../models/Shop/OrderModel");
const DeliveryPersonModel = require("../../models/DeliverManagement/DeliveryPersonModel");

const PrintController = require("../../models/Common/PrintController");

//-- Get Orders
router.get("/orders", async (req, res) => {
    try {
        const resOrders = await OrderModel.find({},
            {
                _id: 0,
                // strOrderNo: 1,
                // strAddress: 1,
                // strCustName: 1,
                // strContactNo: 1,
                // strDeliveryStatus: 1
            }
        ).lean();
        if (resOrders.length) return res.send(new ApiResult(true, resOrders));
        else return res.send(new ApiResult(false, "No data found"));
    } catch (err) {
        return res.send(new ApiResult(false, err.message));
    }

});

//-- Get Delivery People
router.get("/drivers", async (req, res) => {
    try {
        const resDrivers = await DeliveryPersonModel.find({},
            {
                _id: 0,
            }
        ).lean();
        if (resDrivers.length) return res.send(new ApiResult(true, resDrivers));
        else return res.send(new ApiResult(false, "No data found"));
    } catch (err) {
        return res.send(new ApiResult(false, err.message));
    }

});

//-- Assign Driver
router.post("/assignDriver", async (req, res) => {
    try {
        const resDriver = await DeliveryPersonModel.findOneAndUpdate({
            strDriverCode: req.body.strDriverCode
        }, {
            strOrderNo: req.body.strOrderNo,
            booAvailable: false
        });

        const resOrder = await OrderModel.findOneAndUpdate({
            strOrderNo: req.body.strOrderNo
        }, {
            strDeliveryStatus: "ASSIGNED",
            strDriverCode: req.body.strDriverCode
        });

        if (resDriver && resOrder) return res.send(new ApiResult(true, "Successfully assigned driver."));
        else return res.send(new ApiResult(false, "Error."));
    } catch (err) {
        return res.send(new ApiResult(false, err.message));
    }
});

//-- Get Assignments
router.get("/assignments", async (req, res) => {
    try {
        const resDrivers = await DeliveryPersonModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$booAvailable", false]
                    }
                }
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "strOrderNo",
                    foreignField: "strOrderNo",
                    as: "order_info",
                },
            },
            { $unwind: "$order_info" },
            {
                $project: {
                    _id: 0,
                    strDriverCode: "$strDriverCode",
                    strDriverName: "$strDriverName",
                    strOrderNo: "$strOrderNo",
                    strAddress: "$order_info.strAddress",
                }
            },
            {
                $sort: { strDriverCode: 1 }
            }
        ]);
        if (resDrivers.length) return res.send(new ApiResult(true, resDrivers));
        else return res.send(new ApiResult(false, "No data found"));
    } catch (err) {
        return res.send(new ApiResult(false, err.message));
    }

});

//-- Delete Assignment
router.post("/deleteAssignment", async (req, res) => {
    try {
        const resDriver = await DeliveryPersonModel.findOneAndUpdate({
            strDriverCode: req.body.strDriverCode
        }, {
            strOrderNo: "",
            booAvailable: true
        });

        const resOrder = await OrderModel.findOneAndUpdate({
            strOrderNo: req.body.strOrderNo
        }, {
            strDeliveryStatus: "PENDING"
        });

        if (resDriver && resOrder) return res.send(new ApiResult(true, "Successfully removed driver."));
        else return res.send(new ApiResult(false, "Error."));
    } catch (err) {
        return res.send(new ApiResult(false, err.message));
    }
});

//-- Complete Assignment
router.post("/completeAssignment", async (req, res) => {
    try {
        const resDriver = await DeliveryPersonModel.findOneAndUpdate({
            strDriverCode: req.body.strDriverCode
        }, {
            strOrderNo: "",
            booAvailable: true
        });

        const resOrder = await OrderModel.findOneAndUpdate({
            strOrderNo: req.body.strOrderNo
        }, {
            strDeliveryStatus: "DELIVERED",
            dtmDeliveryDate: new Date()
        });

        if (resDriver && resOrder) return res.send(new ApiResult(true, "Successfully completed the order."));
        else return res.send(new ApiResult(false, "Error."));
    } catch (err) {
        return res.send(new ApiResult(false, err.message));
    }
});

//-- Get last month's Orders
router.get("/lastMonthOrders", async (req, res) => {
    try {
        let date = new Date();
        date.setMonth(date.getMonth() - 1); //1 month ago

        // const resOrders = await OrderModel.find({ created: { $gte: date } }).lean();
        const resOrders = await OrderModel.aggregate([
            {
                $match: {
                    $expr: {
                        $gte: ["$dtmOrderDate", date]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    strOrderNo: "$strOrderNo",
                    dtmOrderDate: { $dateToString: { format: "%Y-%m-%d", date: "$dtmOrderDate" } },
                    dtmDeliveryDate: { $cond: [{ $eq: ["$dtmDeliveryDate", undefined] }, "", { $dateToString: { format: "%Y-%m-%d", date: "$dtmDeliveryDate" } }] },
                    strCustName: "$strCustName",
                    strAddress: "$strAddress",
                    strDeliveryStatus: "$strDeliveryStatus",
                    strDriverCode: { $cond: [{ $eq: ["$strDriverCode", undefined] }, "", "$strDriverCode"] },
                }
            },
            {
                $sort: { strOrderNo: 1 }
            }
        ])

        if (resOrders.length) return res.send(new ApiResult(true, resOrders));
        else return res.send(new ApiResult(false, "No data found"));
    } catch (err) {
        return res.send(new ApiResult(false, err.message));
    }

});

router.post("/print", async (req, res) => {

    let date = new Date();
    date.setMonth(date.getMonth() - 1); //1 month ago

    //const resData = await OrderModel.find({ created: { $gte: date } }).lean();
    const resData = await OrderModel.aggregate([
        {
            $match: {
                $expr: {
                    $gte: ["$dtmOrderDate", date]
                }
            }
        },
        {
            $project: {
                _id: 0,
                strOrderNo: "$strOrderNo",
                dtmOrderDate: { $dateToString: { format: "%Y-%m-%d", date: "$dtmOrderDate" } },
                dtmDeliveryDate: { $cond: [{ $eq: ["$dtmDeliveryDate", undefined] }, "", { $dateToString: { format: "%Y-%m-%d", date: "$dtmDeliveryDate" } }] },
                strCustName: "$strCustName",
                strAddress: "$strAddress",
                strDeliveryStatus: "$strDeliveryStatus",
                strDriverCode: { $cond: [{ $eq: ["$strDriverCode", undefined] }, "", "$strDriverCode"] },
            }
        },
        {
            $sort: { strOrderNo: 1 }
        }
    ])

    if (resData.length > 0) {
        const resReport = await PrintController("DeliveryDetails.hbs", { arrData: resData, strReportName: "Monthly Delivery Details Report" }, []);
        res.send(new ApiResult(resReport.booStatus, resReport.objResponse));
    } else res.send(new ApiResult(false, "No data found."));

});

module.exports = router;