import { useEffect, useState } from "react";
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import Swal from "sweetalert2";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";
import { Button, Modal } from "react-bootstrap";
import "./createInq.css";

const Index = () => {
    const [isLoad, setLoad] = useState(false);
    const [arrOrderDetails, setOrderDetails] = useState([]);
    const [isShowInqModal, setShowInqModal] = useState(false);
    const [objSelectedRowData, setSelectedRowData] = useState({
        strOrderNo: "",
        booInquiry: false,
        strMessage: "",
        strAdminReply: "",
        dtmReplyDate: "",
        dtmInqDate: "",
        booAdminReply: "N",
        strInqId: ""
    });

    useEffect(() => {
      fetchOrderData();
    }, []);

    const [objInput, setInput] = useState({
      strMessage: "",
      strAdminReply: "",
    });

    const fnOnChange = (e) => {
      setInput((objInput) => ({
        ...objInput,
        [e.target.name]: e.target.value,
      }));
    };

    const columns = [
      {
        name: "Order No",
        grow: 1,
        selector: "strOrderNo",
      },
      {
        name: "Address",
        grow: 3,
        selector: "strAddress",
      },
      {
        name: "Order Date",
        grow: 1,
        cell: (row) => (
          <span>{new Date(row.dtmOrderDate).toLocaleDateString()}</span>
        ),
      },
      {
        name: "Total Price",
        grow: 1,
        selector: "dblTotPrice",
      },
      {
        name: "Delivery Status",
        grow: 1,
        selector: "strDeliveryStatus",
      },
      {
        name: "Action",
        grow: 1,
        cell: (row) => (
          <>
            <button
              className={
                row.booInquiry
                  ? "btn btn-sm btn-warning m-0 p-2"
                  : "btn btn-sm btn-primary m-0 p-2"
              }
              onClick={() => {
                if(row.booInquiry){
                    setInput({
                        strMessage: row.inq_info.strMessage,
                        strAdminReply: row.inq_info.strStatus === "R" ? row.inq_info.strAdminReply : "",
                    })
                }
                setSelectedRowData({
                    strOrderNo: row.strOrderNo,
                    booInquiry: row.booInquiry,
                    strMessage: row.booInquiry ? row.inq_info.strMessage : "",
                    strAdminReply: row.booInquiry ? row.inq_info.strAdminReply : "",
                    dtmReplyDate: row.booInquiry ? row.inq_info.dtmReplyDate : "",
                    dtmInqDate: row.booInquiry ? row.inq_info.dtmInqDate : "",
                    booAdminReply: row.booInquiry ? row.inq_info.strStatus : "N",
                    strInqId:  row.booInquiry ? row.inq_info.strInqId : "",
                });
                setShowInqModal(true);
              }}
            >
              {row.booInquiry ? "VIEW INQUIRY" : "CREATE INQUIRY"}
            </button>
          </>
        ),
      },
    ];

    const fetchOrderData = async () => {
      setLoad(true);
      const resOrder = await GetApiCaller("inquiry/getOrder");
      setLoad(false);
      if (resOrder.booStatus) {
        setOrderDetails(resOrder.objResponse);
      } else {
        fnAlert(false, resOrder.objResponse);
      }
    };

    const fnAlert = (booSucess, msg) => {
      return Swal.fire({
        icon: booSucess ? "success" : "error",
        title: booSucess ? msg : "Something wrong!",
        text: !booSucess ? msg : "",
      });
    };

    const handleCloseModal = () => {
        setShowInqModal(false);
        fnClearData();
    };

    const btnOnClick = async () => {
      if (objSelectedRowData.booInquiry) {
        if(objSelectedRowData.booAdminReply === "R"){
            fnAlert(false, "The inquiry manager responds to your questions, you are unable to delete inquiry");
        } else{
            const objData = {
              strInqId: objSelectedRowData.strInqId,
              strOrderNo: objSelectedRowData.strOrderNo,
            };
            setLoad(true);
            const res = await PostApiCaller("inquiry/deleteInquiry", objData);
            setLoad(false);
            if (res.booStatus) {
              fnClearData();
              fnAlert(true, res.objResponse);
              fetchOrderData();
            } else {
              fnAlert(false, res.objResponse);
            }
        }

      } else {
        if (objInput.strMessage === "" || objInput.strMessage === undefined) {
          fnAlert(false, "Please enter message.");
        } else {
          const objData = {
            strInqId: Date.now(),
            strCustFName: "Kusal",
            strCustLName: "Mendis",
            strCustMobileNo: "0761234567",
            strInqType: "Complain",
            strMessage: objInput.strMessage,
            strOrderNo: objSelectedRowData.strOrderNo,
          };
          setLoad(true);
          const res = await PostApiCaller("inquiry/createInquiry", objData);
          setLoad(false);
          if (res.booStatus) {
            fnClearData();
            fnAlert(true, res.objResponse);
            fetchOrderData();
          } else {
            fnAlert(false, res.objResponse);
          }
        }
      }
    };

    const fnCreateInqModal = () => {
      return (
        <>
          <Modal
            size="xl"
            centered
            show={isShowInqModal}
            onHide={handleCloseModal}
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#970647", color: "white" }}
            >
              <Modal.Title>My Inquiries</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container-fluid">
                <div className="row">
                  {/* <div className="col-6">
                    <span className="me-1" style={{fontWeight:"800"}}>Order Number :</span>
                    <span style={{fontWeight:"400"}}>{objSelectedRowData.strOrderNo}</span>
                  </div> */}
                  <div className="col-12 d-flex justify-content-end">
                    <span className="me-1" style={{ fontWeight: "800" }}>
                      Date :
                    </span>
                    <span style={{ fontWeight: "400" }}>
                      {objSelectedRowData.booInquiry
                        ? new Date(
                            objSelectedRowData.dtmInqDate
                          ).toLocaleDateString()
                        : new Date().getMonth() +
                          1 +
                          "/" +
                          new Date().getDate() +
                          "/" +
                          new Date().getFullYear()}
                    </span>
                  </div>
                </div>
                {/* <div className="row mt-5">
                  <div className="col-4">
                    <span className="badge badge-create-inq">My Message</span>
                  </div>
                </div> */}
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <textarea
                        className="form-control"
                        id="strMessage"
                        placeholder="My Message"
                        name="strMessage"
                        onChange={(e) => fnOnChange(e)}
                        value={objInput.strMessage}
                      />
                      <label htmlFor="strMessage">My Message</label>
                    </div>
                  </div>
                </div>

                {objSelectedRowData.booAdminReply === "R" && (
                  <>
                    <div className="row mt-5">
                      <div className="col-12 d-flex justify-content-end">
                        <span className="me-1" style={{ fontWeight: "800" }}>
                          Recieved Date :
                        </span>
                        <span style={{ fontWeight: "400" }}>
                          {new Date(objSelectedRowData.dtmReplyDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <textarea
                            disabled={true}
                            className="form-control"
                            id="strAdminReply"
                            placeholder="My Message"
                            name="strAdminReply"
                            onChange={(e) => fnOnChange(e)}
                            value={objInput.strAdminReply}
                          />
                          <label htmlFor="strAdminReply">Responces</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="row">
                  <div className="col-3">
                    <button
                      type="button"
                      className={
                        objSelectedRowData.booInquiry
                          ? "btn btn-danger w-100"
                          : "btn btn-primary w-100"
                      }
                      onClick={btnOnClick}
                    >
                      {objSelectedRowData.booInquiry ? "DELETE" : "SUBMIT"}
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };

    const fnClearData = () => {
      setShowInqModal(false);
      setSelectedRowData({
        strOrderNo: "",
        booInquiry: false,
        strMessage: "",
        strAdminReply: "",
        dtmReplyDate: "",
        dtmInqDate: "",
        booAdminReply: "N",
        strInqId: ""
      });
      setInput({
        strMessage: "",
        strAdminReply: "",
      });
    };

    return (
      <>
       {isLoad && <SiteLoading />}
       {fnCreateInqModal()}
        <div className="row">
          <div className="col-md-12">
            <GridFunctions
              title="Order Details"
              columns={columns}
              dataSet={arrOrderDetails}
              strHeight={"40vh"}
            />
          </div>
        </div>
      </>
    );
};

export default Index;
