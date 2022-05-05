import React, { useState,useEffect } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import Dropdown from 'react-bootstrap/Dropdown'
import "./Assets/shop.css";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";
import SiteLoading from "../Common/Siteloading/SiteLoading";

const Payment = (props) => {
    const [StrType,setStrType] = useState({type:"Card type",value:""});
    const [StrCusName,setStrCusName] = useState("");
    const [StrCusAddr,setStrCusAddr] = useState("");
    const [StrCusCity,strStrCusCity] = useState("");
    const [StrCardHolderName,setStrCardHolderName] = useState("");
    const [StrCardNo,setStrCardNo] = useState("");
    const [DtmMonth,setDtmMonth] = useState("");
    const [DtmYear,setDtmYear] = useState("");
    const [StrMobileNo,setStrMobileNo] = useState("");
    const [isLoad, setLoad] = useState(false);

  useEffect(() => {

  }, []);

  const showValidationError = (booSucess, msg) => {
    return Swal.fire({
      icon: booSucess ? "success" : "error",
      title: booSucess ? msg : "Something wrong",
      text: !booSucess ? msg : "",
    });
  };

  const fnSubmit =async ()=>{
    if(StrType.type ==="Card type" || StrCusName ==="" || StrCusAddr ==="" || StrCusCity ==="" || 
    StrCardHolderName==="" || StrCardNo ==="" || DtmMonth ===""|| DtmYear === "" || StrMobileNo ===""){
      showValidationError(false,"Enter all the values.")
    }
    else if(StrMobileNo.length<10){
      showValidationError(false,"Enter valid phone number.")
    }
    else if(StrCardNo.length<16){
      showValidationError(false,"Enter valid cards number.")
    }
    else if(parseFloat(DtmMonth) < 1 || parseFloat(DtmMonth) > 12){
      showValidationError(false,"Enter valid month.")
    }
    else if(parseFloat(DtmYear) < new Date().getFullYear() || parseFloat(DtmYear) > new Date().getFullYear() + 10){
      showValidationError(false,"Enter valid year.")
    }
    else if(parseFloat(DtmYear) === new Date().getFullYear() && parseFloat(DtmMonth) < (new Date().getMonth()+1)){
      showValidationError(false,"Enter valid expiry date.")
    }
    else{
      let saveObj = {
        StrType : StrType.type.toUpperCase(),
        StrCusName : StrCusName.toUpperCase(),
        StrCusAddr : StrCusAddr.toUpperCase(),
        StrCusCity : StrCusCity.toUpperCase(),
        StrCardHolderName : StrCardHolderName.toUpperCase(),
        StrCardNo : StrCardNo,
        DtmMonth : DtmMonth,
        DtmYear : DtmYear,
        StrMobileNo:StrMobileNo,
        datasetGrid: props.datasetGrid,
        strTotal : parseFloat(props.strTotal.toString().replace(/,/g, "")),
        DtmExp : DtmMonth + "/" + DtmYear
      }
      const resItem = await PostApiCaller("shop/SetOrder",saveObj);
      if (resItem.booStatus) {
        showValidationError(true, "Successfully saved.");
        setTimeout(() => {
          props.onHide()
        }, 20);
        props.fnResetCart();
      } else {
        showValidationError(false, resItem.objResponse);
      }
    }
  }
  return (
    <div>
      {isLoad && <SiteLoading />}
      <Modal size="lg" show={props.isShow} centered backdrop="static">
        <Modal.Header
          className="modal-modal-header m-0 p-2 h5 modal-text-white modal-font-weight-bold"
          style={{ backgroundColor: "rgb(132 44 86)" }}
        >
          Payment
          <i
            style={{ cursor: "pointer" }}  
            className="fas fa-times-circle"
            onClick={() => {props.onHide()}}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <input onChange={(e)=>setStrCusName(e.target.value)} type="text" value={StrCusName} placeholder="Customer Name" className="full-width input-item input-text"/>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-6">
                    <input onChange={(e)=>setStrMobileNo(e.target.value.replace(/[^0-9]+/g, ''))} value={StrMobileNo} type="text" maxLength={10} placeholder="Mobile No" className="full-width input-item input-text"/>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-6">
                    <input onChange={(e)=>setStrCusAddr(e.target.value)} value={StrCusAddr} type="text" placeholder="Address" className="full-width input-item input-text"/>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-6">
                    <input onChange={(e)=>strStrCusCity(e.target.value)} value={StrCusCity} type="text" placeholder="City" className="full-width input-item input-text"/>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-6">
                    <span><b>Card Details</b></span>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-3"></div>
                    <div className="col-6">
                    <Dropdown>
                        <Dropdown.Toggle style={{backgroundColor:"white",borderColor:"grey",color:"grey"}} className="full-width input-item">
                            {StrType.type}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{width:"100%"}}>
                            <Dropdown.Item onClick={()=>setStrType({type:"Credit Card",value:"CREDIT CARD"})}>Credit Card</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setStrType({type:"Debit Card",value:"DEBIT CARD"})}>Debit Card</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-6">
                    <input onChange={(e)=>setStrCardHolderName(e.target.value)} value={StrCardHolderName} type="text" placeholder="Card Holder Name" className="input-text full-width input-item"/>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-6">
                    <input maxLength={16} onChange={(e)=>setStrCardNo(e.target.value.replace(/[^0-9]+/g, ''))} value={StrCardNo} type="text" placeholder="Card No." className="input-text full-width input-item"/>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-3">
                <label><b>Expiry Date</b></label>
                    <input onChange={(e)=>setDtmMonth(e.target.value)} maxLength={2} value={DtmMonth} type="number" max={12} min={1} placeholder="Month" className="input-text full-width input-item"/>
                </div>
                <div className="col-3 mt-4">
                    <input onChange={(e)=>setDtmYear(e.target.value)} maxLength={4} value={DtmYear} type="number" min={2022} placeholder="Year" className="input-text full-width input-item"/>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-6">
                    <input type="button" onClick={fnSubmit} className="btn btn-primary" style={{width:"100%"}} value={"Submit"}/>
                </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Payment;
