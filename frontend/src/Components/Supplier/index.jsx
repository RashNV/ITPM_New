import { useState } from "react";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import examImg from "./img/unnamed.jpg";
import stdImg from "./img/std.png";
import supplier from "./img/s2.jpg";
import purchase from "./img/1234.jpg";
import { useHistory } from "react-router-dom";


const SupplierIndex = () => {
  const history = useHistory();
  const [isLoad, setLoad] = useState(false);

  const fnOnClickSupplier = () => {
    history.push("/supplierDetails");
  };

  const fnOnClickPurchase = () => {
    history.push("/purchaseOrderDetails");
  };



  return (
    <>
        {isLoad && <SiteLoading />}
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div
              className="jumbotron jumbotron-fluid mt-4 p-4"
              style={{ backgroundColor: "#ffe9ec" }}
            >
              <div className="container">
                <h1 className="display-4">Supplier Management</h1>
              </div>
            </div>
          </div>
        </div>
        <br/>

      <br/>

        <div className="row mt-5 ">
          <div className="col-12 d-flex justify-content-center">
            <fieldset className="form-group">
              <div className="row mt-4 mb-4">
                <div className="col-md-6 d-flex justify-content-center">
                  <div
                    className="card text-center card-finance"
                    style={{ width: "30rem" }}
                  >
                    <br/>
                   
                    <img
                      src={supplier}
                      alt="Fees"
                      className="card-img-top rounded mx-auto d-block"
                      style={{ width: "32vh" }}
                    />
                    <div className="card-body">
                      <button
                        type="button"
                        class="btn btn-dark"
                        onClick={fnOnClickSupplier}
                      >
                        Suppliers
                      </button>
                    </div>
                  </div>
                  </div>
                  <div className="col-md-6 d-flex justify-content-center">
                  <div
                    className="card text-center card-finance"
                    style={{ width: "30rem" }}
                  >
                    <img
                      src={purchase}
                      alt="Fees"
                      className="card-img-top rounded mx-auto d-block"
                      style={{ width: "29vh" , padding:"2vh"}}
                    />
                    <div className="card-body">
                      <button
                        type="button"
                        class="btn btn-dark"
                        onClick={fnOnClickPurchase}
                      >
                        Purchace Order
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
};

export default SupplierIndex;
