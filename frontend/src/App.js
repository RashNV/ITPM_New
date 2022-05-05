import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Header from "./Components/Common/Header/Header";
import NavBar from "./Components/Common/NavBar/NavBar";
import InquiryManagement from "./Components/InquiryManagement";
import CreateInquiry from "./Components/CreateInquiry";
import Shop from "./Components/Shop/Shop";
import Login from "./Components/Login/Login";
import Footer from "./Components/Common/Footer/Footer"
import OrderDetails from "./Components/OrderDetails/Index";

import ReturnAndRefund from './Components/ReturnAndRefundMgr/ReturnAndRefund';
import ReturnRequest from "./Components/ReturnAndRefundMgr/ReturnRequest";
import ReturnRequestMgr from "./Components/ReturnAndRefundMgr/ReturnRequestMgr";

import OrdersToBeDelivered from "./Components/DeliveryManagement/OrdersToBeDelivered";
import Assignments from "./Components/DeliveryManagement/Assignments";
import SearchOrderItems from "./Components/DeliveryManagement/SearchOrderItems";
import GenerateReport from "./Components/DeliveryManagement/GenerateReport";

import SupplierDetails from "./Components/Supplier/supplier";
import PurchaseOrderDetails from "./Components/Supplier/purchase"
import SupplierIndex from "./Components/Supplier/index";

import Stock from "./Components/StockManagement/stock";
import Brand from "./Components/BrandManagement/brand";
import Stockinfo from "./Components/StockManagement/Stockinfo";
  
const App = () =>{
  return (
    <Router>
      <NavBar/>
      <div className="container-fluid m-0 p-0" style={{ userSelect: "none" }}>
        <div className="row m-0 p-0">
          <div className="col-md-2 m-0 p-0">
            <Header />
          </div>
          <div className="col-md-10 m-0 p-0">
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route exact path="/inquiryManagement">
                <InquiryManagement />
              </Route>
              <Route exact path="/createInquiries">
                <CreateInquiry />
              </Route>
              <Route exact path="/Shop">
                <Shop />
              </Route> 
              <Route exact path="/Login">
                <Login />
              </Route> 
              <Route exact path="/orderDetails">
                <OrderDetails />
              </Route> 
              <Route path="/returnRefund" exact>
                <ReturnAndRefund />
              </Route>
              <Route path="/returnRefund/returnRequest" exact>
                <ReturnRequest />
              </Route>
              <Route path="/returnRefund/returnMgr" exact>
                <ReturnRequestMgr />
              </Route>
              <Route path="/ordersToDeliver">
                <OrdersToBeDelivered />
              </Route>
              <Route path="/assignments">
                <Assignments />
              </Route>
              <Route path="/orderedItems">
                <SearchOrderItems />
              </Route>
              <Route path="/deliveryReport">
                <GenerateReport />
              </Route>
              <Route exact path="/SupplierDetails">
                <SupplierDetails />
              </Route> 
              <Route exact path="/SupplierIndex">
                <SupplierIndex />
              </Route> 
              <Route exact path="/PurchaseOrderDetails">
                <PurchaseOrderDetails />
              </Route> 
              <Route exact path="/stock">
                <Stock />
              </Route> 
              <Route exact path="/brand">
                <Brand />
              </Route> 
              <Route exact path="/StockReport">
                <Stockinfo />
              </Route> 
            </Switch>
          </div>
         
          
        </div>
      
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Footer/>
    </Router>
  );
}

export default App;