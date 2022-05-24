import { useEffect, useState } from "react";
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import Swal from "sweetalert2";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";
import { Button, Modal } from "react-bootstrap";

const Brand = () => {
    const [isLoad, setLoad] = useState(false);
    const [strFormState, setFormState] = useState("Add");

    const [brandName]=useState("");

    const [objBrand, setBrandObj] = useState({
        brandID: "",
        brandName: "",
        brandDescription: "",
    
    });

    const [arrBrandDetails, setBrandDetials] = useState([]);

    const columns = [
        {
            name: "Brand ID",
            grow: 1,
            selector: "brandID",
        },
        {
            name: "Brand name",
            grow: 1,
            selector: "brandName",
        },
        {
            name: "Brand Description",
            grow: 1,
            selector: "brandDescription",
        },
        {
            name: "Action",
            grow: 0.5,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-info m-0 p-2"
                        onClick={() => fnSelectBrand(row)}
                    >
                        <i className="fas fa-edit" />
                    </button>
                </>
            )
        }
        
      ];

      useEffect(() => {
        fetchBrandData();
      }, []);

      const fetchBrandData = async () => {
        setLoad(true);
        const resBrand = await GetApiCaller("brand/GetBrand");
        setLoad(false);
        if (resBrand.booStatus) {
            setBrandDetials(resBrand.objResponse);
        } else {
            showValidationError(false, resBrand.objResponse);
        }
    };

    const fnSelectBrand = (objRow) => {
        setBrandObj({
            brandID: objRow.brandID,
            brandName: objRow.brandName,
            brandDescription: objRow.brandDescription,
          
      
        });

    setFormState("Inq");
    };

    const fnSave = async () => {

        if (objBrand.brandID === "") {
            showValidationError(false, "Please enter staff ID!");
         } 
          else if (objBrand.brandName === "") {
             showValidationError(false, "Please enter Staff name!")
        
         }
         else if(objBrand.brandDescription=== ""){
             showValidationError(false, "Please enter valid email!")
    
         }else {
          
          const saveObj = {
              ...objBrand,
           
              
    
          };
          setLoad(true);
          const resSave = await PostApiCaller(
              strFormState === "Add" ? "brand/SaveBrand" : "brand/UpdateBrand",
              saveObj
          );
    
          setLoad(false);
          if (resSave.booStatus) {
              showValidationError(true, resSave.objResponse);
              fnClear();
              fetchBrandData();
          } else {
              showValidationError(false, resSave.objResponse);
          }
        }
    };

    const fnDelete = async () => {
        setLoad(true);
        const resDelete = await PostApiCaller("brand/DeleteBrand", {
            brandID: objBrand.brandID,
        });
        setLoad(false);
        if (resDelete.booStatus) {
            showValidationError(true, resDelete.objResponse);
            fnClear();
            fetchBrandData();
        } else {
            showValidationError(false, resDelete.objResponse);
        }
    };

    const fnHandleOnChange = (e) => {
        e.persist();
        setBrandObj((objBrand) => ({
            ...objBrand,
            [e.target.name]: e.target.value,
        }));
    };

    const showValidationError = (booSucess, msg) => {
        return Swal.fire({
            icon: booSucess ? "success" : "error",
            title: booSucess ? msg : "Something wrong in Student Attendance form!",
            text: !booSucess ? msg : "",
        });
    };

    const fnClear = () => {

        setBrandObj({
            brandID: "",
            brandName: "",
            brandDescription: "",
            
      
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
                            <h4>Brand Information</h4>
                        </div>
                    </div>
                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                        <label htmlFor="strGrade">BrandID</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="brandID"
                                    name="brandID"
                                    value={objBrand.brandID}
                                    onChange={(e) => fnHandleOnChange(e)}

                                />
                                <label htmlFor="objBrand">Brand ID</label>
                            </div>
                        </div>
                        <div className="col-md-8 m-0 p-2">
                        <label htmlFor="strGrade">Brand Name</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="brandName"
                                    name="brandName"
                                    value={objBrand.brandName}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="brandName">Brand Name</label>
                            </div>
                        </div>
                    </div>

                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-2">
                            <label htmlFor="strGrade">Brand Description</label>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="brandDescription"
                                    name="brandDescription"
                                    value={objBrand.brandDescription}
                                    onChange={(e) => fnHandleOnChange(e)}
                                    autoComplete="off"
                                />
                                <label htmlFor="brandDescription">Brand Description</label>
                            </div>
                        </div>
                        
                    </div>
                    


                    <div className="row m-0 p-0 mt-1 ms-2">
                        <div className="col-md-2 m-0 p-0 d-grid">
                            <button
                                className="btn btn-success fw-bold"
                                onClick={() => fnSave()}
                            >
                                {strFormState === "Add" ? "Save Brand" : "Update Brand"}
                            </button>
                        </div>
                        {strFormState === "Inq" && (
                            <div
                                className="col-md-2 m-0 p-0 d-grid ms-2"
                                onClick={() => fnDelete()}
                            >
                                <button className="btn btn-danger fw-bold">Delete Brand</button>
                            </div>
                        )}
                        <div className="col-md-2 m-0 p-0 d-grid ms-2">
                            <button
                                className="btn btn-secondary fw-bold"
                                onClick={() => fnClear()}
                            >
                                Clear Brand
                            </button>
                        </div>
                    </div>
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Brand Details"
                                columns={columns}
                                dataSet={arrBrandDetails}
                                strHeight={"24vh"}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
        </>
    );
};


export default Brand;




