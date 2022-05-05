import React from "react";
import { useHistory } from "react-router-dom";

import pp1 from "./img/pp.gif";
import pp from "./img/pp2.gif";
import pp3 from "./img/pp3.gif";
import prinImg from "./img/prin.jpg.JPG";

function Home(props) {
  const history = useHistory();

  const fnOnClickSupplier = () => {
    history.push("/Shop");
  };
  const fnOnClickLogin = () => {
    history.push("/Login");
  };
  return (
    <div class="container">
      <div class="row row-content align-items-center">
        <div class="col col-sm col-md">
          <div class="media">
          <div className="row">
          <div className="col-12">
            <div
              className="jumbotron jumbotron-fluid mt-4 p-4"
              style={{ backgroundColor: "#CD5C5C" }}
            >
              <div className="container">
                <center>
                <h1 className="display-4">Welcome to our online store!</h1>
                </center>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
            <table>
                <th>
                    <tr>
            <img
                src={pp1}
              class="d-flex ml-3 img-thumbnail align-self-center"
              style={{ width: "52vh" ,height:"40vh"}}
              
            ></img>
            </tr>
            </th>
            <th>
                <tr>
                <img
                src={pp}
              class="d-flex ml-3 img-thumbnail align-self-center"
              style={{ width: "52vh",marginLeft:"3vh" }}
              
            ></img>
            </tr>
            </th>
            <th>
                <tr>
                <img
                src={pp3}
              class="d-flex ml-3 img-thumbnail align-self-center"
              style={{ width: "52vh",marginLeft:"4vh",height:"40vh" }}
              
            ></img>
                </tr>
            </th>
            </table>
          </div>
        </div>
      </div>

      <div class="row row-content align-items-center">
        <div class="col col-sm col-md">
          <div class="media">
            <div class="media-body">
              <h2>
                <span class="badge badge-secondary">
                  Message from Principal
                </span>
              </h2>{" "}
              <br></br>
              <p class=" d-none d-sm-block">
                
              </p>
            
            </div>
           <center>
                <img
                src={prinImg}
                class="d-flex ml-3 img-thumbnail align-self-center"
                style={{ width: "120vh",marginLeft:"5vh" }}
            ></img>
            </center>
          </div>
        </div>
      </div>
      <br/>

      <div class="row row-content align-items-center">
        <div class="con-12 col-sm-4 col-md-3">
          <h3></h3>
        </div>
        <div class="col col-sm col-md">
          <h2></h2>
          <p>
            {" "}
          </p>
        </div>
      </div>

      <div class="row mb-5 align-items-center">
        <div class="card card-body bg-light">
          <blockquote class="blockquote">
            <p class="mb-0">
              
            </p>
            <br/>
            <footer class="blockquote-footer">
              <cite title="Source Title"></cite>
            </footer>
          </blockquote>
        </div>
      </div>
      <table>
        <th>
          <tr>
      <div className="card-body">
                      <button
                      style={{ backgroundColor: "#970647" ,marginRight:"750px"}}
                        type="button"
                        class="btn btn-dark"
                        onClick={fnOnClickSupplier}
                      >
                        Shop Now
                      </button>
                    </div>
                    </tr>
                    </th>
                   
                   
                    <th>
                    <tr>
                    <div className="card-body">
                      <button
                      style={{ backgroundColor: "#970647" }}
                        type="button"
                        class="btn btn-dark"
                        onClick={fnOnClickLogin}
                      >
                        Login Now
                      </button>
                    </div>
                    </tr>
                    </th>
                    </table>

    </div>
  );
}

export default Home;
