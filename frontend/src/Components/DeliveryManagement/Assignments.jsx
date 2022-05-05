import React, { useState, useEffect } from 'react'
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import { PostApiCaller, GetApiCaller } from "../../services/ApiCaller";
import Swal from "sweetalert2";

const Assignments = () => {

    const [arrAssignmentDetails, setArrAssignmentDetails] = useState([]);
    const [isLoad, setLoad] = useState(false);

    useEffect(() => {
        fetchAssignmentsData();
    }, []);

    const fnAlert = (booSucess, msg) => {
        return Swal.fire({
            icon: booSucess ? "success" : "error",
            title: booSucess ? msg : "Something wrong!",
            text: !booSucess ? msg : "",
        });
    };

    const fetchAssignmentsData = async () => {
        setLoad(true);
        const resOrders = await GetApiCaller("deliveryManagement/assignments");
        setLoad(false);
        if (resOrders.booStatus) {
            setArrAssignmentDetails(resOrders.objResponse);
        } else {
            // fnAlert(false, resOrders.objResponse);
            setArrAssignmentDetails([]);
        }
    }

    const fnCompleteRow = async (row) => {
        const obj = {
            strOrderNo: row.strOrderNo,
            strDriverCode: row.strDriverCode
        }
        setLoad(true);
        const resSave = await PostApiCaller("deliveryManagement/completeAssignment", obj);
        setLoad(false);
        if (resSave.booStatus) {
            fnAlert(true, resSave.objResponse)
            fetchAssignmentsData();
        } else {
            fnAlert(false, resSave.objResponse)
        }
    }

    const fnDeleteRow = async (row) => {
        const obj = {
            strOrderNo: row.strOrderNo,
            strDriverCode: row.strDriverCode
        }
        setLoad(true);
        const resSave = await PostApiCaller("deliveryManagement/deleteAssignment", obj);
        setLoad(false);
        if (resSave.booStatus) {
            fnAlert(true, resSave.objResponse)
            fetchAssignmentsData();
        } else {
            fnAlert(false, resSave.objResponse)
        }
    }

    const columns = [
        {
            name: "Driver No.",
            grow: 1.5,
            selector: "strDriverCode",
        },
        {
            name: "Driver Name",
            grow: 2,
            selector: "strDriverName",
        },
        {
            name: "Order No.",
            grow: 1.5,
            selector: "strOrderNo",
        },
        {
            name: "Address",
            grow: 3,
            selector: "strAddress",
        },
        {
            name: "Actions",
            grow: 3,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-success m-0 p-1"
                        onClick={() => fnCompleteRow(row)}
                    >
                        <i className="fas fa-check" /> Complete
                    </button>
                    <pre> </pre>
                    <button
                        className="btn btn-sm btn-danger m-0 p-1"
                        onClick={() => fnDeleteRow(row)}
                    >
                        <i className="fas fa-trash" /> Delete
                    </button>
                </>
            ),
        },
    ];

    return (
        <>
            {isLoad && <SiteLoading />}
            <div className="container-fluid">
                <h1 className="mt-3">Assignments</h1>
                <fieldset className="form-group mt-4 me-5 ms-5">
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Deliver Person - Order Assignments"
                                columns={columns}
                                dataSet={arrAssignmentDetails}
                                strHeight={"50vh"}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
        </>
    );

}

export default Assignments