import React, { useState } from "react";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    SubMenu
} from "react-pro-sidebar";
import { Link } from "react-router-dom";

import { FiHome, FiBook, FiFileText, FiTrello,FiBriefcase } from "react-icons/fi";
import { GrDeliver } from "react-icons/gr";
import { FaUserCircle } from 'react-icons/fa';

import "react-pro-sidebar/dist/css/styles.css";
import "./Header.css";

const Header = () => {
    const [strUseApp, setUseApp] = useState("Home");

    return (
        <>
            <div id="header">
                <ProSidebar collapsed={false}>
                    <SidebarContent>
                        <Menu iconShape="square">
                            <MenuItem active={strUseApp === "Dashboard" ? true : false} icon={<FiHome />} onClick={() => setUseApp("Dashboard")}>
                                DASHBOARD
                                <Link to="/" />
                            </MenuItem>
                            <MenuItem active={strUseApp === "Shop" ? true : false} icon={<FiBriefcase />} onClick={() => setUseApp("Shop")}>
                                SHOP
                                <Link to="/Shop" />
                            </MenuItem>
                            <MenuItem active={strUseApp === "inquiryManagement" ? true : false} icon={<FiTrello />} onClick={() => setUseApp("inquiryManagement")}>
                                INQUIRY MANAGEMENT
                                <Link to="/inquiryManagement" />
                            </MenuItem>
                            <MenuItem active={strUseApp === "createInquiries" ? true : false} icon={<FiFileText />} onClick={() => setUseApp("createInquiries")}>
                                CREATE INQUIRIES
                                <Link to="/createInquiries" />
                            </MenuItem>
                            <MenuItem active={strUseApp === "Return" ? true : false} icon={<FiTrello />} onClick={() => setUseApp("Return")}>
                                RETURNS & REFUND
                                <Link to="/returnRefund" />
                            </MenuItem>
                            <MenuItem active={strUseApp === "OrderDetails" ? true : false} icon={<FiFileText />} onClick={() => setUseApp("OrderDetails")}>
                                ORDER DETAILS
                                <Link to="/orderDetails" />
                            </MenuItem>
                            <SubMenu title="DELIVERY MANAGEMENT" icon={<GrDeliver />}>
                                <SubMenu title="DELIVERY LOCATION" icon={<GrDeliver />}>
                                    <MenuItem active={strUseApp === "ordersToDeliver" ? true : false} onClick={() => setUseApp("ordersToDeliver")}>
                                        ORDERS TO DELIVER
                                        <Link to="/ordersToDeliver" />
                                    </MenuItem>
                                </SubMenu>
                                <MenuItem active={strUseApp === "Assignments" ? true : false} onClick={() => setUseApp("Assignments")}>
                                    ASSIGNMENTS
                                    <Link to="/assignments" />
                                </MenuItem>
                                <MenuItem active={strUseApp === "orderedItems" ? true : false} onClick={() => setUseApp("orderedItems")}>
                                    ORDERED ITEMS
                                    <Link to="/orderedItems" />
                                </MenuItem>
                                <MenuItem active={strUseApp === "DeliveryReport" ? true : false} onClick={() => setUseApp("DeliveryReport")}>
                                    DELIVERY REPORT
                                    <Link to="/deliveryReport" />
                                </MenuItem>
                            </SubMenu>
                            <MenuItem active={strUseApp === "supplier" ? true : false} icon={<FiTrello />} onClick={() => setUseApp("supplier")}>
                                SUPPLIER
                                <Link to="/supplierIndex" />
                            </MenuItem>
                            <SubMenu title="STOCK MANAGEMENT" icon={<GrDeliver />}>
                                
                                <MenuItem active={strUseApp === "stock" ? true : false} onClick={() => setUseApp("stock")}>
                                    STOCK INFORMATION
                                    <Link to="/stock" />
                                </MenuItem>
                                <MenuItem active={strUseApp === "brand" ? true : false} onClick={() => setUseApp("brand")}>
                                    BRAND DETAILS
                                    <Link to="/brand" />
                                </MenuItem>
                                <MenuItem active={strUseApp === "stockReport" ? true : false} onClick={() => setUseApp("stockReport")}>
                                    STOCK REPORT
                                    <Link to="/stockReport" />
                                </MenuItem>
                            </SubMenu>
                           
                        </Menu>
                    </SidebarContent>
                </ProSidebar>
            </div>
        </>
    );
};

export default Header;