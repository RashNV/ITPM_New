import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";

import SiteLoading from "../Common/Siteloading/SiteLoading";
import GridFunctions from "../Common/Grid/GridFunctions";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";

const ReturnRequest = () => {
    const [isLoad, setLoad] = useState(false);
    const [isReplaceModalShow, setReplaceModalShow] = useState(false);
    const [arrOrders, setOrders] = useState([]);
    const [arrItems, setItems] = useState([]);
    const [strOldItemCode, setOldItemCode] = useState("");
    const [fileArray, setFileArray] = useState([]);

    const [objReturnReq, setReturnReq] = useState({
        strOrderNo: '',
        strUserMessage: '',
        arrItemsReplace: [],
        arrEvidence: [],
    });

    const OrderItemsColumns = [
        {
            name: "Item Code",
            grow: 1,
            selector: "strItemId",
        },
        {
            name: "Item Name",
            grow: 3,
            selector: "strItemName",
        },
        {
            name: "Item Qty",
            grow: 1,
            selector: "intQty",
        },
        {
            name: "Item Price",
            grow: 2,
            selector: "dblUnitPrice",
        },
        {
            name: "Action",
            grow: 1,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-warning m-0 p-2 w-100"
                        onClick={() => fnReturn(row.strItemId)}
                    >
                        <i className="fas fa-edit" /> <span className='fw-bold'> Return </span>
                    </button>
                </>
            ),
        },
    ];

    useEffect(() => {
        fetchOrderData();
    }, []);

    const fetchOrderData = async () => {
        setLoad(true);
        const resOrder = await GetApiCaller("returnAndRefund/getOrderDetails");
        setLoad(false);
        if (resOrder.booStatus) {
            setOrders(resOrder.objResponse);
        }
        else {
            showValidationError(false, resOrder.objResponse);
        }
    };

    const showValidationError = (booSucess, msg) => {
        return Swal.fire({
            icon: booSucess ? "success" : "error",
            title: booSucess ? msg : "Something wrong in Return Request form!",
            text: !booSucess ? msg : "",
        });
    };

    const fnHandleOnChange = (e) => {
        e.persist();
        setReturnReq((objReturnReq) => ({
            ...objReturnReq,
            [e.target.name]: e.target.value,
        }));
    };

    const fnReturn = async (strOldItemCode) => {
        setLoad(true);
        const resItem = await GetApiCaller("returnAndRefund/getItemDetails");
        setLoad(false);
        if (resItem.booStatus) {
            setOldItemCode(strOldItemCode);
            setItems(resItem.objResponse);
            setReplaceModalShow(true);
        }
        else {
            showValidationError(false, resItem.objResponse);
        }
    };

    const fnSave = async () => {
        setLoad(true);
        const formData = new FormData();
        let count = 1;

        formData.append('ReturnReqObj', JSON.stringify(objReturnReq));
        for(const img of objReturnReq.arrEvidence[0]) {
            formData.append('Evidence' + count, img);
            count = count + 1;
        }
        
        const resSave = await PostApiCaller("returnAndRefund/createRefundReq", formData);
        setLoad(false);
        if (resSave.booStatus) {
            fnClear();
            showValidationError(true, resSave.objResponse);
            fetchOrderData();
        }
        else {
            fnClear();
            showValidationError(false, resSave.objResponse);
        }
    };

    const fnClear = () => {
        setReturnReq({
            strOrderNo: '',
            strUserMessage: '',
            arrItemsReplace: [],
            arrEvidence: []
        });
        setItems([]);
        setFileArray([]);
        setOldItemCode("");
        document.getElementById("EvidenceImg").value = "";
    };

    const fnSelectReplaceItem = (objItem) => {
        objReturnReq.arrItemsReplace.push({
            strItemCode: objItem.strItemCode,
            strOldItemCode: strOldItemCode,
            strName: objItem.strName,
        });
        setItems([]); 
        setReplaceModalShow(false); 
        setOldItemCode("");
    };

    const uploadMultipleFiles = (e) => {
        debugger
        const arrDataset = [];
        const arrImgUrl = [];
        const fileObj = e.target.files;

        for (let i = 0; i < fileObj.length; i++) {
            arrImgUrl.push(URL.createObjectURL(fileObj[i]));
            arrDataset.push(fileObj[i]);
        }

        setFileArray(arrImgUrl);
        objReturnReq.arrEvidence.push(arrDataset);
    };

    const ItemReplacementModal = (props) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Item Replacement
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row m-0 p-0">
                    <div className="col-md-12 m-0 p-0"><h4>Please select the replacement item ...</h4></div>
                        <div className="col-md-12 m-0 p-0">
                            <div className="row m-0 p-0">
                            {
                                arrItems.map((item) => (
                                    <div className="card m-1" style={{ width: '15rem' }}>
                                        <img src={`http://localhost:5000${item.strFileName}`} className="card-img-top" style={{ width: "220px", height: "180px" }}/>
                                        <div className="card-body m-0 p-0">
                                            <h5 className="card-title m-0 p-0">{item.strName}</h5>
                                            <p className="card-text m-0 p-0">Price: LKR {item.dblPrice} /= </p>
                                            <button className="btn btn-primary fw-bold m-1 p-1 w-100" onClick={() => fnSelectReplaceItem(item)}>Select Item</button>
                                        </div>
                                    </div>
                                ))
                            }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 m-0 p-0"><p>
                        By clicking "Select Item" button I agree to the terms and conditions about the return policy
                    </p></div>
                    <div className="col-md-12 m-0 p-0"><button className='btn btn-danger w-100 fw-bold' onClick={() => { setItems([]); setReplaceModalShow(false); setOldItemCode(""); }}>Cancel</button></div>
                </Modal.Body>
            </Modal>
        )
    };

    return (
        <>
            {isLoad && <SiteLoading />}
            <ItemReplacementModal show={isReplaceModalShow} onHide={() => setReplaceModalShow(false)} />
            <div className="container-fluid m-1 p-1">
                <div className="row m-1 p-1">
                    <div className="col-md-12 m-0 p-0">
                        <h2>Return And Refund Request</h2>
                    </div>
                </div>
                <div className="row m-0 p-0">
                    <div className="col-md-4 m-0 p-2">
                        <div className="form-floating">
                            <select
                                class="form-select"
                                id="strOrderNo"
                                name="strOrderNo"
                                value={objReturnReq.strOrderNo}
                                onChange={(e) => fnHandleOnChange(e)}
                            >
                                <option value="" selected>Select Order No</option>
                                {arrOrders.length > 0 && arrOrders.map((order) => <option value={order.strOrderNo}> Order Id: {order.strOrderNo} - Total Amount: LKR {order.dblTotPrice} /=</option>)}
                            </select>
                            <label for="strExamSubject">Select Order No</label>
                        </div>
                    </div>
                </div>
                <div className="row m-0 p-0 col-md-12">
                    <div className="col-md-12 m-0">
                        <GridFunctions
                            title="Order Item Details"
                            columns={OrderItemsColumns}
                            dataSet={objReturnReq.strOrderNo ? arrOrders.filter((order) => order.strOrderNo === objReturnReq.strOrderNo)[0].arrItem : []}
                            strHeight={"24vh"}
                        />
                    </div>
                </div>
                <div className="row m-0 p-0 col-md-12">
                    <div className="col-md-8 m-0 p-2">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="strUserMessage"
                                name="strUserMessage"
                                value={objReturnReq.strUserMessage}
                                onChange={(e) => fnHandleOnChange(e)}
                                autoComplete="off"
                            />
                            <label htmlFor="strUserMessage">Enter Message</label>
                        </div>
                    </div>
                </div>
                <div className="row m-0 p-0 col-md-12">
                    <div className="col-md-8 m-0 p-2">
                        <span>Evidence Upload</span>
                        <div className="form-group">
                            {
                                (fileArray.slice(0, 2) || []).map(url => (
                                    <img src={url} alt="..." style={{ maxWidth: "100px", padding: "5px" }} />
                                ))
                            }
                        </div>
                        <div className="form-group">
                            <input type="file" id="EvidenceImg" name="EvidenceImg" className="form-control mt-1" onChange={uploadMultipleFiles} multiple />
                        </div>
                    </div>
                </div>
                <div className="row m-0 p-0 mt-1 ms-2">
                    <div className="col-md-2 m-0 p-0 d-grid">
                        <button
                            className="btn btn-success fw-bold"
                            onClick={() => fnSave()}
                        >
                            Save Return Request
                        </button>
                    </div>
                    <div className="col-md-2 m-0 p-0 d-grid ms-2">
                        <button
                            className="btn btn-danger fw-bold"
                            onClick={() => fnClear()}
                        >
                            Clear Return Request
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReturnRequest;