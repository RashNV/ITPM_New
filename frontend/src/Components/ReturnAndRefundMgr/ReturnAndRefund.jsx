import React from 'react'
import { useHistory } from "react-router-dom";

import refundmgrImg from "./img/refundmgr.jpg";
import refundreqImg from "./img/refundreq.webp";

const ReturnAndRefund = () => {
  const history = useHistory();

  const fnOnClickReturnRequest = () => {
    history.push("/returnRefund/returnRequest");
  };

  const fnOnClickReturnMgr = () => {
    history.push("/returnRefund/returnMgr");
  };

  return (
    <>
      <div className="container-fluid">
      <div className="row">
          <div className="col-12">
            <div
              className="jumbotron jumbotron-fluid mt-4 p-4"
              style={{ backgroundColor: "#ffe9ec" }}
            >
              <div className="container">
                <h1 className="display-4">Returns And Refund</h1>
              </div>
            </div>
          </div>
        </div>
        <br/>

      <br/>


        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <fieldset className="form-group">
              <div className="row mt-4 mb-4">
                <div className="col-md-6 d-flex justify-content-center">
                  <div
                    className="card text-center card-finance"
                    style={{ width: "20rem" }}
                    onClick={fnOnClickReturnRequest}
                  >
                    <img
                      src={refundreqImg}
                      alt="Return and Refund Request"
                      className="card-img-top rounded mx-auto d-block"
                      style={{ width: "35vh", height: "32vh" }}
                    />
                    <div className="card-body">
                      <button
                        type="button"
                        className="btn btn_financial w-100 fw-bold"
                      >
                        Create Return and Refund Request
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d-flex justify-content-center">
                  <div
                    className="card text-center card-finance"
                    style={{ width: "20rem" }}
                    onClick={fnOnClickReturnMgr}
                  >
                    <img
                      src={refundmgrImg}
                      alt="Return and Refund Management"
                      className="card-img-top rounded mx-auto d-block"
                      style={{ width: "36vh", height: "32vh" }}
                    />
                    <div className="card-body">
                      <button
                        type="button"
                        className="btn btn_financial w-100 fw-bold"
                      >
                        Return and Refund Management
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReturnAndRefund;