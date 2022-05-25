import React, { useState } from "react";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";

import { FiHome, FiBook, FiFileText, FiTrello,FiBriefcase } from "react-icons/fi";
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
                            <MenuItem active={strUseApp === "Report" ? true : false} icon={<FiTrello />} onClick={() => setUseApp("Report")}>
                                REPORT
                                <Link to="/report" />
                            </MenuItem>
                            <MenuItem active={strUseApp === "supplier" ? true : false} icon={<FiTrello />} onClick={() => setUseApp("supplier")}>
                                SUPPLIER
                                <Link to="/supplierIndex" />
                            </MenuItem>
                        </Menu>
                    </SidebarContent>
                </ProSidebar>
            </div>
        </>
    );
};

export default Header;