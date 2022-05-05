import React, { useState,useEffect } from "react";
import { Modal } from "react-bootstrap";
import GridFunctions from "../Common/Grid/GridFunctions";
import Swal from "sweetalert2";
import Payment from "./Payment"

const Cart = (props) => {
  const [datasetGrid, setDatasetGrid] = useState(props.ArrCartItem);
  const [strTotal,setTotal] = useState("");
  const [IsPayment,setIsPayment] = useState(false);
  useEffect(() => {
    let tot = 0;
    props.ArrCartItem.map(val =>{
      tot = (parseFloat(val.dblPrice.toString().replace(/,/g, "")) * parseFloat(val.intQty)) + tot;
    })
    setTotal(tot.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }, []);

  const showValidationError = (booSucess, msg) => {
    return Swal.fire({
      icon: booSucess ? "success" : "error",
      title: booSucess ? msg : "Something wrong in cart",
      text: !booSucess ? msg : "",
    });
  };

  const columns = [
    {
      name: "Item Code",
      grow: 1,
      selector: "strItemCode",
    },
    {
      name: "Item Name",
      grow: 1,
      selector: "strItemName",
    },
    {
      name: "Unit Price",
      grow: 3,
      selector: "dblPrice",
    },
    {
      name: "Qty",
      grow: 1,
      cell: (row) => (
        <input type="number" onChange={(e) =>fnOnChange(row, e.target.value)} value={row.intQty} id="quantity" name="quantity" min="1" max="200"/>
      ),
    },
    {
      name: "Action",
      grow: 0.5,
      cell: (row) => (
        <>
          <button
            type="button"
            onClick={() => fnGridDeleteRow(row)}
            className="btn btn-outline-danger"
          >
            <i className="fa fa-trash"></i>
          </button>
        </>
      ),
    },
  ];
  const fnGridDeleteRow = (row) => {
    setDatasetGrid((arr) =>
      arr.filter((x) => x.strItemCode !== row.strItemCode)
    );
    props.setArrCartItem((arr) =>
    arr.filter((x) => x.strItemCode !== row.strItemCode)
    )
    let Total = parseFloat(strTotal.replace(/,/g, "")) - (parseFloat(row.dblPrice.replace(/,/g, "")) * parseFloat(row.intQty));
    setTotal(Total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  };

  const fnOnChange =(row, value)=>{
    if(value !=="" && parseFloat(value) !==0 && parseFloat(value) < 1000){
      const arrTemp = [...datasetGrid];
      let index = arrTemp.findIndex(e => e.strItemCode === row.strItemCode);
      arrTemp[index].intQty = parseFloat(value);
      setDatasetGrid(arrTemp);

      let tot = 0;
      arrTemp.map(val =>{
        tot = (parseFloat(val.dblPrice.toString().replace(/,/g, "")) * parseFloat(val.intQty)) + tot;
      })
      setTotal(tot.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }
  }
  const fnOpenPayment =()=>{
    if(datasetGrid.length === 0){
      showValidationError(false,"Cart is empty!!")
    }
    else{
      setIsPayment(true)
    }
  }

  const fnResetCart =()=>{
    props.setArrCartItem([]);
    props.onHide()
  }
  return (
    <div>
      <Modal size="lg" show={props.isShow} centered backdrop="static">
        <Modal.Header
          className="modal-modal-header m-0 p-2 h5 modal-text-white modal-font-weight-bold"
          style={{ backgroundColor: "rgb(132 44 86)" }}
        >
          Cart
          <i
            style={{ cursor: "pointer" }}  
            className="fas fa-times-circle"
            onClick={() => {props.onHide()}}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row m-0 p-0 col-md-12">
              <div className="col-md-12 m-0">
                <fieldset>
                <GridFunctions
                  title="Cart Details"
                  columns={columns}
                  dataSet={datasetGrid}
                  strHeight={"40vh"}
                />
                </fieldset>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-6">
                <span><b>Total Price : {strTotal + "/="}</b></span>
            </div>
            <div className="col-3"></div>
            <div className="col-3">
              <button className="btn btn-primary" onClick={fnOpenPayment} style={{width:"100%"}} type="button">Continue</button>
            </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {IsPayment && (
        <Payment 
          isShow={IsPayment}
          onHide={() => setIsPayment(false)}
          fnResetCart = {fnResetCart}
          datasetGrid = {datasetGrid}
          strTotal = {strTotal}
         />
                  )}
    </div>
  );
};

export default Cart;
