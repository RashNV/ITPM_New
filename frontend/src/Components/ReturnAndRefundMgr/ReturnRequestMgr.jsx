import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";

import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";

const ReturnRequest = () => {
    const [isLoad, setLoad] = useState(false);
    const [isViewMoreModalShow, setViewMoreModalShow] = useState(false);
    const [isApproveModalshow, setApproveModalShow] = useState(false);
    const [strReqOrderNo, setReqOrderNo] = useState("");
    const [arrReturnReq, setReturnReq] = useState([]);
    const [arrEvidence, setEvidence] = useState([]);

    const ReturnReqColumns = [
        {
            name: "Order Replace No",
            grow: 1,
            selector: "strOrderReplaceNo",
        },
        {
            name: "Order No",
            grow: 1,
            selector: "strOrderNo",
        },
        {
            name: "Return Item Code",
            grow: 1,
            cell: (row) => (<> <span>{row.arrItem[0].strItemCode}</span> </>)
        },
        {
            name: "Replace Item Code",
            grow: 1,
            cell: (row) => (<> <span>{row.arrItem[0].strOldItemCode}</span> </>)
        },
        {
            name: "Status",
            grow: 1,
            cell: (row) => (<> {row.booApproveStatus ? <span className="badge rounded-pill bg-success">Approved</span> : <span className="badge rounded-pill bg-warning text-dark">Pending</span>} </>)
        }, 
        {
            name: "Action",
            grow: 3,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-warning m-2 p-2 w-100"
                        onClick={() => { setViewMoreModalShow(true); setEvidence(row.arrEvidenceImgPath); }}
                    >
                        <i className="fas fa-eye" /> <span className='fw-bold'> View More </span>
                    </button>
                    <button
                        hidden={row.booApproveStatus}
                        className="btn btn-sm btn-info m-2 p-2 w-100"
                        onClick={() => { setApproveModalShow(true); setReqOrderNo(row.strOrderReplaceNo); }}
                    >
                        <i className="fas fa-edit" /> <span className='fw-bold'> Approve / Reject </span>
                    </button>
                </>
            ),
        }
    ];

    useEffect(() => {
        fetchReturnReqData();
    }, []);

    const fetchReturnReqData = async () => {
        setLoad(true);
        const resReturnReq = await GetApiCaller("returnAndRefund/getReturnReqDetails");
        setLoad(false);
        if (resReturnReq.booStatus) {
            setReturnReq(resReturnReq.objResponse);
        }
        else {
            showValidationError(false, resReturnReq.objResponse);
        }
    };

    const showValidationError = (booSucess, msg) => {
        return Swal.fire({
            icon: booSucess ? "success" : "error",
            title: booSucess ? msg : "Something wrong in Return Request form!",
            text: !booSucess ? msg : "",
        });
    };

    const ViewMoreModal = (props) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        View Return and Refund Request Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row m-0 p-0">
                        <div className="col-md-12 m-0 p-0">
                            <h5>Please refer the attached evidence photos...</h5>
                            <div className="row m-0 p-0 justify-content-center">
                                {
                                    arrEvidence.map((item) => (
                                        <div className="card m-1" style={{ width: '15rem' }}>
                                            <div className="card-body m-0 p-0">
                                                <img src={`http://localhost:5000${item}`} className="card-img-top" style={{ width: "220px", height: "180px" }} />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 m-0 p-0"><button className='mt-2 btn btn-danger w-100 fw-bold' onClick={() => { setViewMoreModalShow(false); setEvidence([]); }}>Cancel</button></div>
                </Modal.Body>
            </Modal>
        )
    };

    const ApproveModal = (props) => {
        const [strAdminMessage, setAdminMessage] = useState("");

        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        View Return and Refund Request Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row m-0 p-0">
                        <div className="col-md-12 m-0 p-0">
                            <div className="row m-0 p-0 justify-content-center">
                            <div className="col-md-12 m-0 p-2">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="strUserMessage"
                                            name="strUserMessage"
                                            value={strAdminMessage}
                                            onChange={(e) => setAdminMessage(e.target.value)}
                                            autoComplete="off"
                                        />
                                        <label htmlFor="strUserMessage">Enter Admin Message</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 p-0 justify-content-center">
                        <button className='col-md-4 m-2 p-1 btn btn-success fw-bold' onClick={() => { setApproveModalShow(false); fnHandleApproveOrReject(true, strAdminMessage); }}>Approve</button>
                        <button className='col-md-4 m-2 p-1 btn btn-danger fw-bold' onClick={() => { setApproveModalShow(false); fnHandleApproveOrReject(false, strAdminMessage);}}>Reject</button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    };

    const fnHandleApproveOrReject = async (isApprove, strMsg) => {
        setLoad(true);
        const resApproveOrReject = await PostApiCaller(isApprove ? "returnAndRefund/ApproveRefundReq" : "returnAndRefund/RejectRefundReq", {
            strReqOrderNo: strReqOrderNo,
            isApprove : isApprove,
            strAdminMsg: strMsg 
        });
        setLoad(false);
        setReqOrderNo("");
        if (resApproveOrReject.booStatus) {
            showValidationError(true, resApproveOrReject.objResponse);
            fetchReturnReqData();
        }
        else {
            showValidationError(false, resApproveOrReject.objResponse);
        }
    }

    return (
        <>
            {isLoad && <SiteLoading />}
            <ViewMoreModal show={isViewMoreModalShow} onHide={() => setViewMoreModalShow(false)} />
            <ApproveModal show={isApproveModalshow} onHide={() => setApproveModalShow(false)} />
            <div className="container-fluid m-1 p-1">
                <div className="row m-1 p-1">
                    <div className="col-md-12 m-0 p-0">
                        <h2>Return And Refund Request Management</h2>
                    </div>
                </div>
            </div>
            <div className="row m-0 p-0 col-md-12">
                <div className="col-md-12 m-0">
                    <GridFunctions
                        title="Return And Refund Request Details"
                        columns={ReturnReqColumns}
                        dataSet={arrReturnReq}
                        strHeight={"40vh"}
                    />
                </div>
            </div>
        </>
    )
}

export default ReturnRequest;