import React, { useState, useEffect } from 'react'
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import { PostApiCaller, GetApiCaller } from "../../services/ApiCaller";
import Swal from "sweetalert2";

const Assignments = () => {

    const [arrOrderDetails, setArrOrderDetails] = useState([]);

    const [arrOrderItemDetails, setArrOrderItemDetails] = useState();
    const [isLoad, setLoad] = useState(false);

    useEffect(() => {
        fetchOrderData();
    }, []);

    const fnAlert = (booSucess, msg) => {
        return Swal.fire({
            icon: booSucess ? "success" : "error",
            title: booSucess ? msg : "Something wrong!",
            text: !booSucess ? msg : "",
        });
    };

    const fetchOrderData = async () => {
        setLoad(true);
        const resOrders = await GetApiCaller("deliveryManagement/orders");
        setLoad(false);
        if (resOrders.booStatus) {
            debugger
            setArrOrderDetails(resOrders.objResponse);
        } else {
            // fnAlert(false, resOrders.objResponse);
            setArrOrderDetails([]);
        }
    }

    const orderColumns = [
        {
            name: "Order Id",
            grow: 2,
            selector: "strOrderNo",
        },
        {
            name: "Customer Name",
            grow: 3,
            selector: "strCustName",
        },
        {
            name: "Total Amount",
            grow: 3,
            selector: "dblTotPrice",
        },
        {
            name: "Action",
            grow: 1.5,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-primary m-0 p-1"
                        onClick={() => fnSelectOrderRow(row)}
                    >
                        <i className="fas fa-eye" /> View Items
                    </button>
                </>
            ),
        },
    ];

    const orderItemColumns = [
        {
            name: "Item Id",
            grow: 2,
            selector: "strItemId",
        },
        {
            name: "Item Name",
            grow: 3,
            selector: "strItemName",
        },
        {
            name: "Quantity",
            grow: 2,
            selector: "intQty",
        },
        {
            name: "Unit Price",
            grow: 3,
            selector: "dblUnitPrice",
        },

    ];

    const fnSelectOrderRow = (row) => {
        setArrOrderItemDetails(row.arrItem);
    }

    return (
        <>
            {isLoad && <SiteLoading />}
            <div className="container-fluid">
                <h1 className="mt-3">Order and Item details</h1>
                <fieldset className="form-group mt-4 me-5 ms-5">
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Order Details"
                                columns={orderColumns}
                                dataSet={arrOrderDetails}
                                strHeight={"25vh"}
                            />
                        </div>
                    </div>
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Order Item Details"
                                columns={orderItemColumns}
                                dataSet={arrOrderItemDetails}
                                strHeight={"25vh"}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
        </>
    );

}

export default Assignments