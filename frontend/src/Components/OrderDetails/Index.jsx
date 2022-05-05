import React from 'react'
import { useEffect, useState, createContext } from "react";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";
import Swal from "sweetalert2";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import GridFunctions from "../Common/Grid/GridFunctions";
import printJS from "print-js";

const OrderDetails = () =>{
  useEffect( () => {
    FnGetOrderDetails("D");
  }, []);
     
  const [isLoad, setLoad] = useState(false);
  const [DatasetGrid,setDatasetGrid] = useState([]);
  const showValidationError = (booSucess, msg) => {
    return Swal.fire({
      icon: booSucess ? "success" : "error",
      title: booSucess ? msg : "Something wrong",
      text: !booSucess ? msg : "",
    });
  };

  const FnGetOrderDetails = async (strParams) => {
    setLoad(true);
    const resItem = await PostApiCaller("shop/GetOrder",{strType : strParams});
    setLoad(false);
    if (resItem.booStatus) {
        if(strParams === "D"){
            if(resItem.objResponse.length>0){
                setDatasetGrid(resItem.objResponse);
            } 
        }
        else{
            printJS({ printable: resItem.objResponse, type: "pdf", base64: true });
        }
    } else {
      showValidationError(false, resItem.objResponse);
    }
  };

  const columns = [
    {
      name: "Order ID",
      grow: 1,
      selector: "strOrderNo",
    },
    {
      name: "Customer name",
      grow: 2,
      selector: "strCustName",
    },
    {
      name: "Order Date",
      grow: 1,
      selector: "dtmOrderDate",
    },
    {
      name: "No. of item",
      grow: 1,
      selector: "intItemCount",
      center:true
    },
    {
        name: "Total price",
        grow: 1,
        selector: "dblTotPrice",
        right:true
    },
    {
        name: "Status",
        grow: 1,
        selector: "strDeliveryStatus",
    },
  ];


  return (
    <>
    {isLoad && <SiteLoading />}
      <div className="container-fluid">
        <div className="row mt-2">
          <div className="col-3"></div>
          <div className="col-8"></div>
          <div className="col-1 mt-1 pr-1">
           <button type="button" class="btn btn-success" onClick={()=>FnGetOrderDetails("P")} style={{width:"90%",border:"none", backgroundColor:"#970647"}}>Print</button>
          </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <GridFunctions
                    title="Order Details"
                    columns={columns}
                    dataSet={DatasetGrid}
                    strHeight={"70vh"}
                />
            </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails 