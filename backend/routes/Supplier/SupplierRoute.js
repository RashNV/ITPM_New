const router = require("express").Router();
const ApiResult = require("../../models/Common/ApiResult");
const suppierModel = require("../../models/Supplier/suppilerModel");
const PurchaseOrderDetails = require("../../models/Supplier/purchaseOrderModel");
const purchaseOrderModel = require("../../models/Supplier/purchaseOrderModel");
const PrintController = require("../../models/Common/PrintController");

router.get('/GetSupplier', async (req, res) => {
    try {
        const resSupplier = await suppierModel.find({});
        res.send(new ApiResult(true, resSupplier));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/SaveSupplier', async (req, res) => {
    try {
        await new suppierModel(req.body).save();
        res.send(new ApiResult(true, "Succesfully save Supplier details !"));
    } catch (error) {
        console.log("error")
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/UpdateSupplier', async (req, res) => {
    try {
        await suppierModel.findOneAndUpdate({ strSupplierID: req.body.strSupplierID }, req.body);
        res.send(new ApiResult(true, "Succesfully update Supplier details !"));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/DeleteSupplier', async (req, res) => {
    try {
        await suppierModel.findOneAndDelete({ strSupplierID: req.body.strSupplierID });
        res.send(new ApiResult(true, "Succesfully delete Supplier details !"));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});


router.get("/GetSuppliers", async (req, res) => {
    try {
        const resSuppliers = await suppierModel.find({}, { strSupplierID: 1, strSupplierName: 1 });
        if (resSuppliers.length > 0) {
            res.send(new ApiResult(true, resSuppliers));
        } else {
            res.send(new ApiResult(false, "No Suppliers Found!"));
        }
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.get('/GetPurchaseOrder', async (req, res) => {
    try {
        const resPurchase = await purchaseOrderModel.find({});
        res.send(new ApiResult(true, resPurchase));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/SavePurchaseOrder', async (req, res) => {
    try {
        await new purchaseOrderModel(req.body).save();
        res.send(new ApiResult(true, "Succesfully save Purchase Order details !"));
    } catch (error) {
        console.log("error")
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/UpdatePurchaseOrder', async (req, res) => {
    try {
        await purchaseOrderModel.findOneAndUpdate({ strPurchaseOderID: req.body.strPurchaseOderID }, req.body);
        res.send(new ApiResult(true, "Succesfully update Purchase Order details !"));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/DeletePurchaseOrder', async (req, res) => {
    try {
        await purchaseOrderModel.findOneAndDelete({ strPurchaseOderID: req.body.strPurchaseOderID });
        res.send(new ApiResult(true, "Succesfully delete Purchase Order details !"));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/PurchaseOrderReport', async (req, res) => { 
    try {
        const objPurchase = await purchaseOrderModel.findOne({ strPurchaseOderID: req.body.strPurchaseOderID });
        const resReport = await PrintController("PurchaseOrder.hbs", {...objPurchase.toJSON(), strReportName: 'Purchase Order Details Report'}, []);
        res.send(new ApiResult(resReport.booStatus, resReport.objResponse));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});


router.post('/SupplierReport', async (req, res) => { 
    try {
        const objSupplier = await suppierModel.findOne({ strSupplierID: req.body.strSupplierID });
        const resReport = await PrintController("Supplier.hbs", {...objSupplier.toJSON(), strReportName: 'Supplier Details Report'}, []);
        res.send(new ApiResult(resReport.booStatus, resReport.objResponse));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});


module.exports = router;