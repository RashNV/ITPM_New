import React, { useState, useEffect } from 'react'
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import { PostApiCaller, GetApiCaller } from "../../services/ApiCaller";
import Swal from "sweetalert2";
import printJS from "print-js";

const GenerateReports = () => {

    const [isLoad, setLoad] = useState(false);
    const [arrOrderDetails, setArrOrderDetails] = useState([]);

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
        debugger
        setLoad(true);
        const resOrders = await GetApiCaller("deliveryManagement/lastMonthOrders");
        setLoad(false);
        if (resOrders.booStatus) {
            resOrders.objResponse.map((obj) => {
                obj.dtmOrderDate = obj.dtmOrderDate.split("T")[0];
                if (obj.dtmDeliveryDate) {
                    obj.dtmDeliveryDate = obj.dtmDeliveryDate.split("T")[0];
                }
            })
            setArrOrderDetails(resOrders.objResponse);
        } else {
            // fnAlert(false, resOrders.objResponse);
            setArrOrderDetails([]);
        }
    }

    const columns = [
        {
            name: "Order No",
            grow: 2,
            selector: "strOrderNo",
        },
        {
            name: "Order Date",
            grow: 2,
            selector: "dtmOrderDate",
        },
        {
            name: "Delivery Date",
            grow: 2,
            selector: "dtmDeliveryDate",
        },
        {
            name: "Customer Name",
            grow: 3,
            selector: "strCustName",
        },
        {
            name: "Location",
            grow: 3,
            selector: "strAddress",
        },
        {
            name: "Delivery Status",
            grow: 2,
            selector: "strDeliveryStatus",
            cell: (row) => (
                <>
                    <button className={row.strDeliveryStatus === "PENDING" ? "btn btn-sm btn-primary m-0" :
                        row.strDeliveryStatus === "ASSIGNED" ? "btn btn-sm btn-warning m-0" :
                            //row.strDeliveryStatus === "Shipped" ? "btn btn-sm btn-info m-0" :
                            "btn btn-sm btn-success m-0"} disabled>
                        {row.strDeliveryStatus}
                    </button>
                </>
            ),
        },
        {
            name: "Delivery by",
            grow: 3,
            selector: "strDriverCode",
        },
    ];

    const fnPrintReport = async () => {
        setLoad(true);
        const resPrint = await PostApiCaller("deliveryManagement/print", {});
        setLoad(false);
        if (resPrint.booStatus) {
            printJS({ printable: resPrint.objResponse, type: "pdf", base64: true });
        } else {
            fnAlert(false, resPrint.objResponse);
        }
    }

    return (
        <>
            {isLoad && <SiteLoading />}
            <div className="container-fluid">
                <h1 className="mt-1">Delivery Report</h1>
                <fieldset className="form-group mt-4 me-5 ms-5">
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Monthly Delivery Details"
                                columns={columns}
                                dataSet={arrOrderDetails}
                                strHeight={"30vh"}
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-2"></div>
                        <div className="col-8"></div>
                        <div className="col-2 mt-1 mb-2">
                            <button type="button" class="btn btn-success" onClick={fnPrintReport} style={{ width: "90%", border: "none", backgroundColor: "#970647" }}>Print</button>
                        </div>
                    </div>
                </fieldset>
            </div>
        </>
    );
}

export default GenerateReports