const router = require("express").Router();
const ApiResult = require('../../models/Common/ApiResult');
const fs = require('fs').promises;
const path = require('path')
const Order = require("../../models/Shop/OrderModel");
const Item = require("../../models/Shop/ItemModel")

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
                try{
                    let strFilePath = path.resolve() + "\\routes\\Shop"+val.strFileName;
                    const data = await fs.readFile(strFilePath,'base64');
                    arrItemModify.push({
                        strItemCode : val.strItemCode,
                        dblPrice : val.dblPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        strName : val.strName,
                        strType: val.strType,
                        strFile: data,
                        dblQty:val.dblQty
                    })
                }
                catch(er){
                    arrItemModify.push({
                        strItemCode : val.strItemCode,
                        dblPrice : val.dblPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        strName : val.strName,
                        strType: val.strType,
                        strFile: "",
                        dblQty:val.dblQty
                    })
                }
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

module.exports = router;