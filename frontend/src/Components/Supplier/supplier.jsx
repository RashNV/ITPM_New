import { useEffect, useState } from "react";
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import Swal from "sweetalert2";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";
import { Button, Modal } from "react-bootstrap";

const SupplierDetails = () => {
    const [isLoad, setLoad] = useState(false);
    const [strFormState, setFormState] = useState("Add");

    const [strSupplierName]=useState("");

    const [objSupplier, setSupplierObj] = useState({
        strSupplierID: "",
        strSupplierName: "",
        strSupplierEmail: "",
        strSupplierContact: "",
        strSupplierAddress:"",
        strSupplierItemNo:"",
        strSupplierItemName:"",
    
    });

    const [arrSupplierDetails, setSupplierDetials] = useState([]);

    const columns = [
        {
            name: "Supplier ID",
            grow: 1,
            selector: "strSupplierID",
        },
        {
            name: "Supplier name",
            grow: 1,
            selector: "strSupplierName",
        },
        {
            name: "Email",
            grow: 1,
            selector: "strSupplierEmail",
        },
        {
            name: "Contact",
            grow: 1,
            selector: "strSupplierContact",
        },
        {
            name: "Address",
            grow: 1,
            selector: "strSupplierAddress",
        },
        {
            name: "NoOfItems",
            grow: 1,
            selector: "strSupplierItemNo",
        },
        {
            name: "ItemNames",
            grow: 1,
            selector: "strSupplierItemName",
        },
        {
            name: "Action",
            grow: 0.5,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-info m-0 p-2"
                        onClick={() => fnSelectSupplier(row)}
                    >
                        <i className="fas fa-edit" />
                    </button>
                </>
            )
        }
        
      ];

      useEffect(() => {
        fetchSupplierData();
      }, []);

      const fetchSupplierData = async () => {
        setLoad(true);
        const resSupplier = await GetApiCaller("supplier/GetSupplier");
        setLoad(false);
        if (resSupplier.booStatus) {
            setSupplierDetials(resSupplier.objResponse);
        } else {
            showValidationError(false, resSupplier.objResponse);
        }
    };

    const fnSelectSupplier = (objRow) => {
        setSupplierObj({
            strSupplierID: objRow.strSupplierID,
            strSupplierName: objRow.strSupplierName,
            strSupplierEmail: objRow.strSupplierEmail,
            strSupplierContact: objRow.strSupplierContact,
            strSupplierAddress: objRow.strSupplierAddress,
            strSupplierItemNo: objRow.strSupplierItemNo,
            strSupplierItemName: objRow.strSupplierItemName,
          
      
        });

    setFormState("Inq");
    };

    const fnSave = async () => {

        if (objSupplier.strSupplierID === "") {
            showValidationError(false, "Please enter staff ID!");
         } 
          else if (objSupplier.strSupplierName === "") {
             showValidationError(false, "Please enter Staff name!")
        
         }
         else if(!objSupplier.strSupplierEmail.includes('@')){
             showValidationError(false, "Please enter valid email!")
    
         }
         else if (objSupplier.strSupplierAddress === "") {
            showValidationError(false, "Please enter Address!")
         }
         else if (objSupplier.strSupplierItemNo === "") {
            showValidationError(false, "Please enter Number of Items!")
         }
         else if (objSupplier.strSupplierItemName === "") {
            showValidationError(false, "Please enter Item Names!")
         }
         else {
          
          const saveObj = {
              ...objSupplier,
           
              
    
          };
          setLoad(true);
          const resSave = await PostApiCaller(
              strFormState === "Add" ? "supplier/SaveSupplier" : "supplier/UpdateSupplier",
              saveObj
          );
    
          setLoad(false);
          if (resSave.booStatus) {
              showValidationError(true, resSave.objResponse);
              fnClear();
              fetchSupplierData();
          } else {
              showValidationError(false, resSave.objResponse);
          }
        }
    };

    const fnDelete = async () => {
        setLoad(true);
        const resDelete = await PostApiCaller("supplier/DeleteSupplier", {
            strSupplierID: objSupplier.strSupplierID,
        });
        setLoad(false);
        if (resDelete.booStatus) {
            showValidationError(true, resDelete.objResponse);
            fnClear();
            fetchSupplierData();
        } else {
            showValidationError(false, resDelete.objResponse);
        }
    };

    const fnHandleOnChange = (e) => {
        e.persist();
        setSupplierObj((objSupplier) => ({
            ...objSupplier,
            [e.target.name]: e.target.value,
        }));
    };

    const showValidationError = (booSucess, msg) => {
        return Swal.fire({
            icon: booSucess ? "success" : "error",
            title: booSucess ? msg : "Something wrong in Supplier form!",
            text: !booSucess ? msg : "",
        });
    };

    const fnClear = () => {

        setSupplierObj({
            strSupplierID: "",
            strSupplierName: "",
            strSupplierEmail: "",
            strSupplierContact: "",
            strSupplierAddress:"",
            strSupplierItemNo:"",
            strSupplierItemName:"",
      
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
                            <h4>Supplier Information</h4>
                        </div>
                    </div>
                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                        <label htmlFor="strGrade">SupplierID</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strSupplierID"
                                    name="strSupplierID"
                                    value={objSupplier.strSupplierID}
                                    onChange={(e) => fnHandleOnChange(e)}

                                />
                                <label htmlFor="strSupplierID">Supplier ID</label>
                            </div>
                        </div>
                        <div className="col-md-8 m-0 p-2">
                        <label htmlFor="strGrade">Supplier Name</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strSupplierName"
                                    name="strSupplierName"
                                    value={objSupplier.strSupplierName}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strSupplierName">Name</label>
                            </div>
                        </div>
                    </div>

                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strGrade">Email</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strSupplierEmail"
                                    name="strSupplierEmail"
                                    value={objSupplier.strSupplierEmail}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strSupplierEmail">Email</label>
                            </div>
                        </div>
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strSubject">Contact No</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strSupplierContact"
                                    name="strSupplierContact"
                                    value={objSupplier.strSupplierContact}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strSupplierContact">Contact No</label>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strTime">Address</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strSupplierAddress"
                                    name="strSupplierAddress"
                                    value={objSupplier.strSupplierAddress}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strSupplierAddress">Address</label>
                            </div>
                        </div>                     
                    </div>

                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strTime">Items Supplied</label>
                            <div className="form-floating">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="strSupplierItemNo"
                                    name="strSupplierItemNo"
                                    value={objSupplier.strSupplierItemNo}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strSupplierItemNo">Items Supplied</label>
                            </div>
                        </div>
                        </div>

                        <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strTime">Item Names</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="strSupplierItemName"
                                    name="strSupplierItemName"
                                    value={objSupplier.strSupplierItemName}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="strSupplierItemName">Item Names</label>
                            </div>
                        </div>
                        </div>


                    <div className="row m-0 p-0 mt-1 ms-2">
                        <div className="col-md-2 m-0 p-0 d-grid">
                            <button
                                className="btn btn-success fw-bold"
                                onClick={() => fnSave()}
                            >
                                {strFormState === "Add" ? "Save Supplier" : "Update Supplier"}
                            </button>
                        </div>
                        {strFormState === "Inq" && (
                            <div
                                className="col-md-2 m-0 p-0 d-grid ms-2"
                                onClick={() => fnDelete()}
                            >
                                <button className="btn btn-danger fw-bold">Delete Supplier</button>
                            </div>
                        )}
                        <div className="col-md-2 m-0 p-0 d-grid ms-2">
                            <button
                                className="btn btn-secondary fw-bold"
                                onClick={() => fnClear()}
                            >
                                Clear Supplier
                            </button>
                        </div>
                    </div>
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Supplier Details"
                                columns={columns}
                                dataSet={arrSupplierDetails}
                                strHeight={"24vh"}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
        </>
    );
};


export default SupplierDetails;




