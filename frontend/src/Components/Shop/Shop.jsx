import React from 'react'
import { useEffect, useState, createContext } from "react";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";
import Swal from "sweetalert2";
import Dropdown from 'react-bootstrap/Dropdown'
import "./Assets/shop.css";
import NoImage from './Assets/noImage.jpg';
import Cart from './Cart';
import SiteLoading from "../Common/Siteloading/SiteLoading";

const Shop = () =>{
  useEffect( () => {
    FnGetItemDetails("Gents");
  }, []);

  const [isLoad, setLoad] = useState(false);
  const [StrCatType,setStrCatType] = useState("Gents");
  const [ArrItem,setArrItem] = useState([]);
  const [BoolShow,setBoolShow] =useState(false);
  const [ArrCartItem,setArrCartItem] = useState([]);

  const showValidationError = (booSucess, msg) => {
    return Swal.fire({
      icon: booSucess ? "success" : "error",
      title: booSucess ? msg : "Something wrong",
      text: !booSucess ? msg : "",
    });
  };

  const FnGetItemDetails = async (strParams) => {
    setLoad(true);
    const resItem = await PostApiCaller("shop/GetItems",{strType : strParams});
    setLoad(false);
    if (resItem.booStatus) {
      if(resItem.objResponse.length>0){
        let arrItem = [];
        resItem.objResponse.map(val=>{
          arrItem.push({
            strItemCode : val.strItemCode,
            dblPrice : val.dblPrice,
            strName : val.strName,
            strType: val.strType,
            strFile: val.strFile,
            dblQty:val.dblQty
         })
        })
        setArrItem(arrItem);
      }
    } else {
      showValidationError(false, resItem.objResponse);
      setArrItem([])
    }
  };

  const fnClickDropDwn = (strParams)=>{
    setStrCatType(strParams)
    FnGetItemDetails(strParams)
  }

  const FnAddToCart = (strItemCode, dblPrice, strItemName)=>{
    const arrTemp = [...ArrCartItem];
    let index = arrTemp.findIndex(e => e.strItemCode === strItemCode);

    if(index === -1){
      arrTemp.push({
        strItemCode:strItemCode,
        strItemName:strItemName,
        dblPrice:dblPrice,
        intQty:1,
      })
    }
    else{
      arrTemp[index].intQty = arrTemp[index].intQty + 1;
    }
    setArrCartItem(arrTemp);
    showValidationError("success","Item added to the cart.")
  }

  const fnCart =()=>{
    setBoolShow(true)
  }

  return (
    <>
    {isLoad && <SiteLoading />}
      <div className="container-fluid">
        <div className="row mt-2">
          <div className="col-3">

            <label><b>Category</b></label>
            <Dropdown>
              <Dropdown.Toggle style={{width:"100%" , backgroundColor:"#970647"}} id="dropdown-button-dark-example1" variant="secondary">{StrCatType}</Dropdown.Toggle>
              <Dropdown.Menu style={{width:"100%"}} variant="dark">
                <Dropdown.Item onClick={()=>fnClickDropDwn("Gents")} >Gents</Dropdown.Item>
                <Dropdown.Item onClick={()=>fnClickDropDwn("Ladies")} >Ladies</Dropdown.Item>
                <Dropdown.Item onClick={()=>fnClickDropDwn("Kids")} >Kids</Dropdown.Item>
                <Dropdown.Item onClick={()=>fnClickDropDwn("Bags")} >Bags</Dropdown.Item>
                <Dropdown.Item onClick={()=>fnClickDropDwn("Shoes")} >Shoes</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-8"></div>
          <div className="col-1 mt-1 pr-1">
           <button type="button" class="btn btn-success" onClick={fnCart} style={{width:"100%",border:"none", backgroundColor:"#970647"}}><i class="fa fa-cart-arrow-down">Cart</i></button>
          </div>
        </div>
        <div className="row mt-4 item-row">
        {ArrItem.length > 0 && ArrItem.map(val =>{
          return (
            <div className="col-3 mt-4">
              <div style={{width:"100%", height:"fit-content", border:"solid 2px", borderRadius:"10px"}}>
                <div className="row mt-2">
                  <div className="col-12">
                    <div style={{width:"100%"}}>
                      <p>{val.strFile}</p>
                      {/* <img src={`http://localhost:5000${val.strFile}`} className="card-img-top" style={{ width: "220px", height: "180px" }} /> */}
                      <img className="shop-item-image" src={val.strFile ? `http://localhost:5000${val.strFile}` : NoImage} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                    <b>{val.strName}</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                      <b>{val.dblPrice}/=</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mb">
                    <button type="button" onClick={()=>FnAddToCart(val.strItemCode, val.dblPrice,val.strName)} className="btn btn-success input-item-btn" style={{width:"100%",border:"none",backgroundColor:"rgb(151, 6, 71)"}}>Add to cart <i class="fa fa-cart-arrow-down"></i></button>
                  </div>
                </div>
              </div>
            </div>
          )
        })
        }
        </div>
      </div>
      {BoolShow && (
        <Cart 
        isShow={BoolShow}
        onHide={() => setBoolShow(false)}
        ArrCartItem = {ArrCartItem}
        setArrCartItem = {setArrCartItem}
        />
      )}
    </>
  );
}

export default Shop 