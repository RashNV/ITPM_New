import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import GridFunctions from "../Common/Grid/GridFunctions";
import Swal from "sweetalert2";
import printJS from "print-js";
import SiteLoading from "../Common/Siteloading/SiteLoading";

import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";

import "react-datepicker/dist/react-datepicker.css";

const StockInfo = () => {
    const [isLoad, setLoad] = useState(false);
    const [strFormState, setFormState] = useState("Add");

    
    const [objStock, setStockObj] = useState({
        strItemID: "",
        strItemName: "",
        strDescription: "",
        strBrand: "",
        strCategory:"",
        strQuantity:"",
        strColor:"",
        strPrice:"",
    });
    
    const [arrStockDetails, setStockDetials] = useState([]);

    const columns = [
        {
            name: "Stock ID",
            grow: 1,
            selector: "strItemID",
        },
        {
            name: "Item Name",
            grow: 1,
            selector: "strItemName",
        },
        {
            name: "Description",
            grow: 1,
            selector: "strDescription",
        },
        {
            name: "Brand",
            grow: 1,
            selector: "strBrand",
        },
        {
            name: "Category",
            grow: 1,
            selector: "strCategory",
        },
        {
            name: "Quantity",
            grow: 1,
            selector: "strQuantity",
        },
        {
            name: "Color",
            grow: 1,
            selector: "strColor",
        },
        {
            name: "Price",
            grow: 1,
            selector: "strPrice",
        },
    
    ];

    useEffect(() => {
        fetchStockData();
    }, []);


    useEffect(() => {
        fetchStockData();
      }, []);

      const fetchStockData = async () => {
        setLoad(true);
        const resStock = await GetApiCaller("stock/GetStock");
        setLoad(false);
        if (resStock.booStatus) {
            setStockDetials(resStock.objResponse);
        } else {
            console.log("error in get the data")
        }
    };

    return (
        <>
            {isLoad && <SiteLoading />}
            <div className="container-fluid" style={{ backgroundColor:  "#FFEFD5" }}>
                <fieldset className="form-group mt-2 me-4">
                    <div className="row m-0 p-0 mt-1 ms-2">
                        <div className="form-floating" >
                            <h4>Stock Information</h4>
                        </div>
                    </div>
                    
                    <div className="row m-0 p-0 col-md-12" >
                        <div className="col-md-12 m-0" >
                            <GridFunctions
                                title="Stock Details"
                                columns={columns}
                                dataSet={arrStockDetails}
                                strHeight={"200vh"}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
        </>
    );
};


export default StockInfo;
