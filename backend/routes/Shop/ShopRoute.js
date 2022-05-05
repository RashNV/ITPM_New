const router = require("express").Router();
const ApiResult = require('../../models/Common/ApiResult');
const fs = require('fs').promises;
const path = require('path');
const Order = require("../../models/Shop/OrderModel");
const Item = require("../../models/Shop/ItemModel");
const PrintController = require('../../models/Common/PrintController');

router.post("/GetItems", async (req, res) => {
    try {
        let arrItemModify = [];
        const resItem = await Item.find({
            strType : req.body.strType
        }).lean();

        if(resItem.length === 0){
            res.send(new ApiResult(false, "No item found."));
        }
        else{
            for(let val of resItem){
                arrItemModify.push({
                    strItemCode : val.strItemCode,
                    dblPrice : val.dblPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    strName : val.strName,
                    strType: val.strType,
                    strFile: val.strFileName,
                    dblQty:val.dblQty
                })
            }
            res.send(new ApiResult(true,arrItemModify));
        }

    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post("/SetOrder", async (req, res) => {
    try {
        arrItem = [];
        req.body.datasetGrid.map(val=>{
            arrItem.push({
                strItemId:val.strItemCode,
                strItemName:val.strItemName,
                dblUnitPrice:parseFloat(val.dblPrice.toString().replace(/,/g, "")),
                intQty:parseFloat(val.intQty)
            })
        })
        const resOrder = await new Order({
            strOrderNo:"ORD" + Date.now().toString().substring(0,7),
            strCustCode:"C001" ,
            strCustName:req.body.StrCusName ,
            strAddress:req.body.StrCusAddr ,
            strCity:req.body.StrCusCity ,
            strContactNo:req.body.StrMobileNo ,
            dtmOrderDate:new Date(),
            strStatus:"A",
            dblTotPrice:req.body.strTotal,
            strDeliveryStatus:"PENDING",
            arrItem:arrItem,
            strPaymentMethod:req.body.StrType ,
            strCardNo:req.body.StrCardNo ,
            strCardHolder:req.body.StrCardHolderName ,
            dtmExpDate:req.body.DtmExp 
        }).save();

        res.send(new ApiResult(true, "Succesfully saved"));

    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post("/GetOrder", async (req, res) => {
    try {
        let arrRtn = [];
        const resItem = await Order.find().lean();

        if(resItem.length === 0){
            res.send(new ApiResult(false, "No item found."));
        }
        else{
            for(let val of resItem){
                let intNoOfItem = 0;
                val.arrItem.map(i=>{
                    intNoOfItem = intNoOfItem + i.intQty
                });
                
                arrRtn.push({
                    strOrderNo:val.strOrderNo,
                    strCustName:val.strCustName,
                    dtmOrderDate:(val.dtmOrderDate).toLocaleDateString("es-CL"),
                    intItemCount:intNoOfItem,
                    dblTotPrice:val.dblTotPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    strDeliveryStatus:val.strDeliveryStatus,
                })
            }
            if(req.body.strType === "D"){
                res.send(new ApiResult(true,arrRtn));
            }
            else{
                const resReport = await PrintController("OrderDetails.hbs", {arrRtn:arrRtn}, []);
                res.send(new ApiResult(resReport.booStatus, resReport.objResponse));
            }
        }

    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

module.exports = router;