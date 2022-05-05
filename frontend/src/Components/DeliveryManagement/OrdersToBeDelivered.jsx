import React, { useEffect, useState } from 'react'
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import AssignDeliveryPersonModal from "./AssignDeliveryPerson";
import { Modal, Button } from "react-bootstrap";
import { PostApiCaller, GetApiCaller } from "../../services/ApiCaller";
import Swal from "sweetalert2";

const OrdersToBeDelivered = () => {

    const [isLoad, setLoad] = useState(false);
    const [ModalShow, setModalShow] = useState(false);
    const [show, setShow] = useState(false);
    const [data, setData] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
        setLoad(true);
        const resOrders = await GetApiCaller("deliveryManagement/orders");
        setLoad(false);
        if (resOrders.booStatus) {
            setArrOrderDetails(resOrders.objResponse);
        } else {
            // alert(resOrders.objResponse);
            // fnAlert(false, resOrders.objResponse);
            setArrOrderDetails([]);
        }
    }

    const columns = [
        {
            name: "Order No",
            grow: 1,
            selector: "strOrderNo",
        },
        {
            name: "Location",
            grow: 3,
            selector: "strAddress",
        },
        {
            name: "Customer Name",
            grow: 3,
            selector: "strCustName",
        },
        {
            name: "Cust. Contact",
            grow: 1.5,
            selector: "strContactNo",
        },
        {
            name: "Delivery Status",
            grow: 1.5,
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
    ];

    const fnRowClick = (row) => {
        console.log(row);
        setData(row);
        if (row.strDeliveryStatus === "PENDING") {
            handleShow();
        }
    }

    return (
        <>
            {isLoad && <SiteLoading />}
            {show && <AssignDeliveryPersonModal
                handleClose={handleClose}
                show={show}
                data={data}
                fetchOrderData={fetchOrderData}
            />}
            <div className="container-fluid">
                <h1 className="mt-3">Orders to be delivered</h1>
                <fieldset className="form-group mt-4">
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Order details"
                                columns={columns}
                                dataSet={arrOrderDetails}
                                strHeight={"50vh"}
                                fnRowClick={fnRowClick}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
            {/* <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button> */}


        </>
    );
}

export default OrdersToBeDelivered