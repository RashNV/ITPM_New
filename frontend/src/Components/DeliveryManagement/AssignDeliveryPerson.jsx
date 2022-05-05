import React, { useState, useEffect } from 'react'
import { Modal, Button, Alert } from "react-bootstrap";
import { PostApiCaller, GetApiCaller } from "../../services/ApiCaller";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import Swal from "sweetalert2";

const AssignDeliveryPerson = (props) => {

    const [arrDeliveryPerson, setArrDeliveryPerson] = useState(["01", "02", "03", "04", "05"]);
    //const [arrLocation, setArrLocation] = useState(["01", "02", "03"]);
    const [strDeliveryPersonId, setStrDeliveryPersonId] = useState("");
    const [strLocationId, setStrLocationId] = useState("");
    const [chkConfirmAssignment, setChkConfirmAssignment] = useState(false);
    const [alertState, setAlertState] = useState("none");
    const [isLoad, setLoad] = useState(false);

    useEffect(() => {
        //fetchOrderData();
        fetchDeliveryPersonData();
    }, []);

    const fnAlert = (booSucess, msg) => {
        return Swal.fire({
            icon: booSucess ? "success" : "error",
            title: booSucess ? msg : "Something wrong!",
            text: !booSucess ? msg : "",
        });
    };

    const fetchDeliveryPersonData = async () => {
        const resOrders = await GetApiCaller("deliveryManagement/drivers");
        if (resOrders.booStatus) {
            setArrDeliveryPerson(resOrders.objResponse);
        } else {
            // alert(resOrders.objResponse);
            fnAlert(false, resOrders.objResponse);
        }
    }

    const fnClear = () => {
        setStrDeliveryPersonId("Select Delivery Person Id");
        setStrLocationId("Select Location Id");
        setChkConfirmAssignment(false);
    }

    const fnDeliverPersonAssignSave = async () => {
        debugger
        if (strDeliveryPersonId === "Select Delivery Person Id") {
            setAlertState("none");
        } else {
            if (chkConfirmAssignment) {
                let booState = false;
                arrDeliveryPerson.map((driver) => {
                    if ((driver.strDriverCode === strDeliveryPersonId) && !driver.booAvailable) {
                        booState = true;
                    }
                })
                if (booState) {
                    setAlertState("driverError");
                } else {
                    //setAlertState("success");
                    const obj = {
                        strOrderNo: props.data.strOrderNo,
                        strDriverCode: strDeliveryPersonId
                    }
                    setLoad(true);
                    const resSave = await PostApiCaller("deliveryManagement/assignDriver", obj);
                    setLoad(false);
                    if (resSave.booStatus) {
                        // alert(resSave.objResponse);
                        fnAlert(true, resSave.objResponse);
                        setStrDeliveryPersonId("Select Delivery Person Id");
                        setChkConfirmAssignment(false);
                        props.handleClose();
                        props.fetchOrderData();
                    } else {
                        // alert(resSave.objResponse);
                        fnAlert(false, resSave.objResponse);
                    }
                }
            } else {
                setAlertState("confirmError");
            }
        }

    }

    return (
        <>
            {isLoad && <SiteLoading />}
            <Modal size="lg" show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Delivery Person</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strOrderNo"
                                    name="strOrderNo"
                                    value={props.data.strOrderNo}
                                    disabled
                                />
                                <label htmlFor="strOrderNo">Order No.</label>
                            </div>
                        </div>
                        <div className="col-md-8 m-0 p-2">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strAddress"
                                    name="strAddress"
                                    value={props.data.strAddress}
                                    //onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strAddress">Order Location</label>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 p-0">
                        {/* <div className="col-md-4 m-0 p-2"></div> */}
                        <div className="col-md-6 m-0 p-2">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    id="strDeliveryPersonId"
                                    name="strDeliveryPersonId"
                                    value={strDeliveryPersonId}
                                    onChange={(e) => {
                                        setStrDeliveryPersonId(e.target.value);
                                    }}
                                >
                                    <option selected>Select Delivery Person Id</option>
                                    {arrDeliveryPerson.map((obj) => {
                                        return <option value={obj.strDriverCode}>{obj.booAvailable ? "(available) " + obj.strDriverName : "(unavailable) " + obj.strDriverName}</option>
                                    })}
                                </select>
                                <label for="strDeliveryPersonId">Select Delivery Person Id</label>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <div className="form-check">
                                <input className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    checked={chkConfirmAssignment}
                                    id="chkConfirmAssignment"
                                    onChange={(e) => {
                                        if (!chkConfirmAssignment) {
                                            setAlertState("none");
                                        }
                                        setChkConfirmAssignment(!chkConfirmAssignment);
                                    }}
                                />
                                <label className="form-check-label" for="chkConfirmAssignment">
                                    Confirm Assignment
                                </label>
                            </div>
                        </div>
                    </div>
                    {alertState === "success" ? <Alert variant="success">
                        {/* <Alert.Heading>Hey, nice to see you</Alert.Heading> */}
                        <p className="mb-0">
                            Driver Assigned successfully.
                        </p>
                    </Alert> : alertState === "driverError" ? <Alert variant="danger">
                        {/* <Alert.Heading>Hey, nice to see you</Alert.Heading> */}
                        <p className="mb-0">
                            Sorry! Driver is not available.
                        </p>
                    </Alert> : alertState === "confirmError" ? <Alert variant="danger">
                        {/* <Alert.Heading>Hey, nice to see you</Alert.Heading> */}
                        <p className="mb-0">
                            Please confirm before submit.
                        </p>
                    </Alert> : null}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={fnDeliverPersonAssignSave}>
                        SUBMIT
                    </Button>
                    <Button variant="secondary" onClick={props.handleClose}>
                        CLOSE
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default AssignDeliveryPerson