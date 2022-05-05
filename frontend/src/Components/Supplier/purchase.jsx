import { useEffect, useState } from "react";
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import Select from "react-select";
import printJS from "print-js";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";
import { Button, Modal } from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";

const PurchaseOrderDetails = () => {
    const [isLoad, setLoad] = useState(false);
    const [strFormState, setFormState] = useState("Add");

    const [strDate, setExamDate] = useState(
        new Date().setDate(new Date().getDate() )
    );

    const [arrSuppliers, setSuppliers] = useState([]);

    const [objPurchase, setPurchaseObj] = useState({
        arrSuppliers: [],
        strPurchaseOderID:"",
        strProductID:"",
        strDate:"",
        strQuantity:"",
        strUnitPrice:"",
    
    });

    const [arrPurchaseDetails, setPurchaseDetials] = useState([]);

    const columns = [
        {
            name: "Purchase Order ID",
            grow: 1,
            selector: "strPurchaseOderID",
        },
        {
            name: "Product ID",
            grow: 1,
            selector: "strProductID",
        },
        {
            name: "Date",
            grow: 1,
            selector: "strDate",
        },
        {
            name: "Quantity",
            grow: 1,
            selector: "strQuantity",
        },
        {
            name: "Unit Price",
            grow: 1,
            selector: "strUnitPrice",
        },
        {
            name: "Action",
            grow: 0.5,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-info m-0 p-2"
                        onClick={() => fnSelectPurchase(row)}
                    >
                        <i className="fas fa-edit" />
                    </button>

            
                        <button
                            className="btn btn-sm btn-success m-0 p-2 ms-2"
                            onClick={() => fnPrint(row.strPurchaseOderID)}
                        >
                            <i className="fas fa-file-pdf" />
                            
                        </button>
                  
                </>
            ),
        },
    ];

    useEffect(() => {
        fetchSupplierData();
        fetchPurchaseData();
    }, []);

    const fetchSupplierData = async () => {
        setLoad(true);
        const resSupplier = await GetApiCaller("supplier/GetSuppliers");
        setLoad(false);
        if (resSupplier.booStatus) {
            setSuppliers(
            resSupplier.objResponse.map((objSupplier) => {
              return {
                label: objSupplier.strSupplierID + "-" + objSupplier.strSupplierName,
                value: objSupplier.strSupplierID,
              };
            })
          );
        } else {
          showValidationError(false, resSupplier.objResponse);
        }
      };

      const fetchPurchaseData = async () => {
        setLoad(true);
        const resPurchase = await GetApiCaller("supplier/GetPurchaseOrder");
        setLoad(false);
        if (resPurchase.booStatus) {
            setPurchaseDetials(resPurchase.objResponse);
        } else {
            showValidationError(false, resPurchase.objResponse);
        }
    };

    const fnSelectPurchase = (objRow) => {
        setPurchaseObj({
            arrSuppliers: objRow.arrSuppliers.map((objSupplier) => {
                return {
                  label: objSupplier.strSupplierID + "-" + objSupplier.strSupplierName,
                  value: objSupplier.strSupplierID,
                };
              }),
            strPurchaseOderID: objRow.strPurchaseOderID,
            strProductID: objRow.strProductID,
            strDate: objRow.strDate,
            strQuantity: objRow.strQuantity,
            strUnitPrice: objRow.strUnitPrice,
          
        });
        setFormState("Inq");
    };

    const fnPrint = async (strPurchaseOderID) => {
        setLoad(true);
        const resPrint = await PostApiCaller("supplier/PurchaseOrderReport", {
            strPurchaseOderID: strPurchaseOderID,
       });
       setLoad(false);
        if (resPrint.booStatus) {
             printJS({ printable: resPrint.objResponse, type: "pdf", base64: true });
         } else {
           showValidationError(false, resPrint.objResponse);
         }
     };

     const fnSave = async () => {
        
        if (objPurchase.strPurchaseOderID === "") {
            showValidationError(false, "Please enter Purchase Order ID!");
         } 
          else if (objPurchase.strProductID === "") {
             showValidationError(false, "Please enter Product ID!")
         } else if (objPurchase.strQuantity === "" ) {
             showValidationError(false, "Please enter Quantity!")
         }else if (objPurchase.strUnitPrice === "" ) {
            showValidationError(false, "Please enter Unit Price!")
        }
        else {
            const saveObj = {
                ...objPurchase,
                arrSuppliers: objPurchase.arrSuppliers.map((objSupplier) => {
                    return {
                        strSupplierID: objSupplier.value,
                        strSupplierName: objSupplier.label.split("-")[1],
                    };
                  }),
                
                  strDate:strDate,

            };

            setLoad(true);
            const resSave = await PostApiCaller(
                strFormState === "Add" ? "supplier/SavePurchaseOrder" : "supplier/UpdatePurchaseOrder",
                saveObj
            );
            setLoad(false);
            if (resSave.booStatus) {
                showValidationError(true, resSave.objResponse);
                fnClear();
                fetchPurchaseData();
            } else {
                showValidationError(false, resSave.objResponse);
            }
        }
    };

    const fnDelete = async () => {
        setLoad(true);
        const resDelete = await PostApiCaller("supplier/DeletePurchaseOrder", {
            strPurchaseOderID: objPurchase.strPurchaseOderID,
        });
        setLoad(false);
        if (resDelete.booStatus) {
            showValidationError(true, resDelete.objResponse);
            fnClear();
            fetchPurchaseData();
        } else {
            showValidationError(false, resDelete.objResponse);
        }
    };

    const fnSelectStudent = (value) => {
        setPurchaseObj((objPurchase) => ({
          ...objPurchase,
          arrSuppliers: value,
        }));
      };


    const fnHandleOnChange = (e) => {
        e.persist();
        setPurchaseObj((objPurchase) => ({
            ...objPurchase,
            [e.target.name]: e.target.value,
        }));
    };

    const showValidationError = (booSucess, msg) => {
        return Swal.fire({
            icon: booSucess ? "success" : "error",
            title: booSucess ? msg : "Something wrong in Purchase Order form!",
            text: !booSucess ? msg : "",
        });
    };

    const fnClear = () => {

        setPurchaseObj({
            arrSuppliers: [],
            strPurchaseOderID:"",
            strProductID:"",
            strDate:"",
            strQuantity:"",
            strUnitPrice:"",
      
        });
        setFormState("Add");
    };

    return (
        <>
            {isLoad && <SiteLoading />}
            <div className="container-fluid">
                <fieldset className="form-group mt-2 me-4">
                    <div className="row m-0 p-0 mt-1 ms-2">
                        <div className="form-floating">
                            <h4>Purchase Order Information</h4>
                        </div>
                    </div>
                    <div className="row m-0 p-0">
                    <div className="row m-0 p-0">
            <label>Select Suppliers</label>
            <div className="col-md-12 m-0 p-2">
              <Select
                isMulti
                value={objPurchase.arrSuppliers}
                name="colors"
                options={arrSuppliers}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Suppliers . . ."
                onChange={(value) => fnSelectStudent(value)}
              />
            </div>
          </div>
                    </div>

                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strPurchaseOderID">Purchase Order ID</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strPurchaseOderID"
                                    name="strPurchaseOderID"
                                    value={objPurchase.strPurchaseOderID}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strPurchaseOderID">Purchase Order ID</label>
                            </div>
                        </div>
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strProductID">Product ID</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strProductID"
                                    name="strProductID"
                                    value={objPurchase.strProductID}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strProductID">Product ID</label>
                            </div>
                        </div>
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strDate">Date</label>
                            <div className="form-floating">
                                <DatePicker
                                   
                                    className="form-control"
                                    selected={strDate}
                                    onChange={(date) => setExamDate(date)}

                                />
                            </div>

                        </div>

                    </div>
                    <div className="row m-0 p-0">
                    <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strQuantity">Quantity</label>
                            <div className="form-floating">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="strQuantity"
                                    name="strQuantity"
                                    value={objPurchase.strQuantity}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strQuantity">Quantity</label>
                            </div>
                        </div>

                        <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strUnitPrice">Unit Price</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strUnitPrice"
                                    name="strUnitPrice"
                                    value={objPurchase.strUnitPrice}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strUnitPrice">Unit Price</label>
                            </div>
                        </div>
                        </div>

                     
                    </div>

                    <div className="row m-0 p-0 mt-1 ms-2">
                        <div className="col-md-2 m-0 p-0 d-grid">
                            <button
                                className="btn btn-success fw-bold"
                                onClick={() => fnSave()}
                            >
                                {strFormState === "Add" ? "Save Purchase Order" : "Update Purchase Order"}
                            </button>
                        </div>
                        {strFormState === "Inq" && (
                            <div
                                className="col-md-2 m-0 p-0 d-grid ms-2"
                                onClick={() => fnDelete()}
                            >
                                <button className="btn btn-danger fw-bold">Delete Purchase Order</button>
                            </div>
                        )}
                        <div className="col-md-2 m-0 p-0 d-grid ms-2">
                            <button
                                className="btn btn-secondary fw-bold"
                                onClick={() => fnClear()}
                            >
                                Clear Purchase Order
                            </button>
                        </div>
                    </div>
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Purchase Order Details"
                                columns={columns}
                                dataSet={arrPurchaseDetails}
                                strHeight={"24vh"}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
        </>
    );

};

export default PurchaseOrderDetails;