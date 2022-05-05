import React from 'react'
import logo from "./logo.jpeg";
import './NavBar.css';
import { IoMdMail, IoIosCall, IoLogoFacebook, IoLogoInstagram, IoLogoYoutube, IoLogoWhatsapp } from "react-icons/io";
import { FaPowerOff, FaShoppingCart, FaUser } from 'react-icons/fa';

function NavBar() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <img
              src={logo}
              alt="logo"
              //   className="rounded mx-auto d-block"
              style={{ width: "14vw", height: "24vh" }}
            />
          </div>
          <div className="col-10">
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <span className="headline-navbar">
                  Zerlin Beauty Choose Your Own Fashion...
                </span>
              </div>
              <div className="col-12">
                <div className="card text-white card-navbar mb-1">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="row">
                          <div className="col-6">
                            <h6 className="card-title-navbar">
                              {<IoMdMail />}
                              <span className="ms-2">
                                ZerlinBeauty@gmail.com
                              </span>
                            </h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <h6 className="card-title-navbar">
                              {<IoIosCall />}
                              <span className="ms-2">0776007547</span>
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <span className="card-icon-navbar">
                          {<IoLogoFacebook />}
                        </span>
                        <span className="card-icon-navbar">
                          {<IoLogoInstagram />}
                        </span>
                        <span className="card-icon-navbar">
                          {<IoLogoYoutube />}
                        </span>
                        <span className="card-icon-navbar">
                          {<IoLogoWhatsapp />}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <span className="icon-navbar">
                  {<FaPowerOff />}
                  <span className="ms-1">Log Out</span>
                </span>
                <span className="icon-navbar">
                  {<FaUser />}
                  <span className="ms-1">Account</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="container-fluid">
            <hr className="new1 mt-2" />
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar