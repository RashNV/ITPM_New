import { useEffect, useState } from "react";
import GridFunctions from "../Common/Grid/GridFunctions";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import Swal from "sweetalert2";
import { GetApiCaller, PostApiCaller } from "../../services/ApiCaller";
import { Button, Modal } from "react-bootstrap";

const Index = () => {
  const [isLoad, setLoad] = useState(false);
  const [isShowInqModal, setShowInqModal] = useState(false);
  const [arrInqDetails, setInqDetails] = useState([]);

  useEffect(() => {
    fetchInqData();
  }, []);

  const [objInput, setInput] = useState({
    strMessage: "",
    dtmInqDate: "",
    strCustMobileNo: "",
    strInqType: "",
    strAdminReply: "",
    strStatus: "",
    strInqId: "",
    strOrderNo: ""
  });

  const fnOnChange = (e) => {
    setInput((objInput) => ({
      ...objInput,
      [e.target.name]: e.target.value,
    }));
  };

  const columns = [
    {
      name: "Inquiry ID",
      grow: 1,
      selector: "strInqId",
    },
    {
      name: "Message",
      grow: 3,
      selector: "strMessage",
    },
    {
      name: "Date",
      grow: 1,
      cell: (row) => (
        <span>{new Date(row.dtmInqDate).toLocaleDateString()}</span>
      ),
    },
    {
      name: "Contact",
      grow: 1,
      selector: "strCustMobileNo",
    },
    {
      name: "Type of Inquiry",
      grow: 1,
      selector: "strInqType",
    },
    {
        name: "Status",
        grow: 1,
        cell: (row) => (
            <span>{row.strStatus === "N" ? "Not replied" : "Replied"}</span>
          ),
      },
    {
      name: "Action",
      grow: 1,
      cell: (row) => (
        <>
          <button
            className={
                row.strStatus === "R"
                ? "btn btn-sm btn-warning m-0 p-2"
                : "btn btn-sm btn-primary m-0 p-2"
            }
            onClick={() => {
                setInput({
                  strMessage: row.strMessage,
                  dtmInqDate: new Date(row.dtmInqDate).toLocaleDateString(),
                  strCustMobileNo: row.strCustMobileNo,
                  strInqType: row.strInqType,
                  strAdminReply: row.strAdminReply,
                  strStatus: row.strStatus,
                  strInqId: row.strInqId,
                  strOrderNo: row.strOrderNo
                });

                setShowInqModal(true);
            }}
          >
            {row.strStatus === "R" ? "VIEW INQUIRY" : "REPLY"}
          </button>
        </>
      ),
    },
  ];

  const fetchInqData = async () => {
    setLoad(true);
    const resInq = await GetApiCaller("inquiry/getInquiries");
    setLoad(false);
    if (resInq.booStatus) {
      setInqDetails(resInq.objResponse);
    } else {
      fnAlert(false, resInq.objResponse);
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

  const btnOnClick = async (strType) => {
    switch (strType) {
      case "C": //reply
        if (objInput.strAdminReply === "" || objInput.strAdminReply === undefined) {
          fnAlert(false, "Please enter reply message");
        } else {
          const objData = {
            strInqId: objInput.strInqId,
            strAdminReply: objInput.strAdminReply,
          };
          setLoad(true);
          const res = await PostApiCaller("inquiry/adminReply", objData);
          setLoad(false);
          if (res.booStatus) {
            fnClearData();
            fnAlert(true, res.objResponse);
            fetchInqData();
          } else {
            fnAlert(false, res.objResponse);
          }
        }
        break;
      case "D":
        const objData = {
          strInqId: objInput.strInqId,
          strOrderNo: objInput.strOrderNo
        };
        setLoad(true);
        const res = await PostApiCaller("inquiry/deleteInquiry", objData);
        setLoad(false);
        if (res.booStatus) {
          fnClearData();
          fnAlert(true, res.objResponse);
          fetchInqData();
        } else {
          fnAlert(false, res.objResponse);
        }
        break;
      default:
        break;
    }
  };

  const fnInqReplyModal = () => {
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
            <Modal.Title>Reply to the Inquiry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <div className="row mt-3">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="strMessage"
                      placeholder="Message"
                      name="strMessage"
                      onChange={(e) => fnOnChange(e)}
                      value={objInput.strMessage}
                      disabled={true}
                    />
                    <label htmlFor="strMessage">Message</label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="dtmInqDate"
                      placeholder="Date"
                      name="dtmInqDate"
                      onChange={(e) => fnOnChange(e)}
                      value={objInput.dtmInqDate}
                      disabled={true}
                    />
                    <label htmlFor="dtmInqDate">Date</label>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="strCustMobileNo"
                      placeholder="Contact"
                      name="strCustMobileNo"
                      onChange={(e) => fnOnChange(e)}
                      value={objInput.strCustMobileNo}
                      disabled={true}
                    />
                    <label htmlFor="strCustMobileNo">Contact</label>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="strInqType"
                      placeholder="Type of the inquiry"
                      name="strInqType"
                      onChange={(e) => fnOnChange(e)}
                      value={objInput.strInqType}
                      disabled={true}
                    />
                    <label htmlFor="strInqType">Type of the inquiry</label>
                  </div>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="strAdminReply"
                      placeholder="Reply"
                      name="strAdminReply"
                      onChange={(e) => fnOnChange(e)}
                      value={objInput.strAdminReply}
                    />
                    <label htmlFor="strAdminReply">Reply</label>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-3">
                  <button
                    type="button"
                    className={
                      objInput.strStatus === "R"
                        ? "btn btn-warning w-100"
                        : "btn btn-primary w-100"
                    }
                    onClick={() => {
                      btnOnClick("C");
                    }}
                  >
                    {objInput.strStatus === "R" ? "EDIT" : "REPLY"}
                  </button>
                </div>
                {objInput.strStatus === "R" && (
                  <div className="col-3">
                    <button
                      type="button"
                      className="btn btn-danger w-100"
                      onClick={() => btnOnClick("D")}
                    >
                      DELETE
                    </button>
                  </div>
                )}
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

  const fnClearData = () =>{
    setShowInqModal(false);
    setInput({
        strMessage: "",
        dtmInqDate: "",
        strCustMobileNo: "",
        strInqType: "",
        strAdminReply: "",
        strStatus: "",
        strInqId: "",
        strOrderNo: ""
    })
  }

  return (
    <>
      {isLoad && <SiteLoading />}
      {fnInqReplyModal()}
      <div className="row">
        <div className="col-md-12">
          <GridFunctions
            title="Inquiry Details"
            columns={columns}
            dataSet={arrInqDetails}
            strHeight={"40vh"}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
