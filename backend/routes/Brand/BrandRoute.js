const router = require("express").Router();
const ApiResult = require("../../models/Common/ApiResult");
const brandModel = require("../../models/Brand/brandModel");

router.get('/GetBrand', async (req, res) => {
    try {
        const resBrand = await brandModel.find({});
        res.send(new ApiResult(true, resBrand));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/SaveBrand', async (req, res) => {
    try {
        await new brandModel(req.body).save();
        res.send(new ApiResult(true, "Succesfully save brand details !"));
    } catch (error) {
        console.log("error")
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/UpdateBrand', async (req, res) => {
    try {
        await brandModel.findOneAndUpdate({ brandID: req.body.brandID }, req.body);
        res.send(new ApiResult(true, "Succesfully update brand details !"));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});

router.post('/DeleteBrand', async (req, res) => {
    try {
        await brandModel.findOneAndDelete({ brandID: req.body.brandID });
        res.send(new ApiResult(true, "Succesfully delete brand details !"));
    } catch (error) {
        res.send(new ApiResult(false, "Error: " + error.message));
    }
});
module.exports = router;