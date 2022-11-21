import React from "react";
import {Outlet} from "react-router-dom";
import BrandingComponent from "../../shared/components/layout/branding/BrandingComponent";
import SideMenuComponent from "../../shared/components/layout/side-menu/SideMenuComponent";
import HeaderComponent from "../../shared/components/layout/header/HeaderComponent";

export interface AppLayoutProps {

}

const AppLayout = (props: AppLayoutProps) => {

    return (
        <div className="app-layout">
            <div className="side-bar-holder">
                <div className="logo-holder">
                    <BrandingComponent/>
                </div>
                <div className="side-menu-holder">
                    <SideMenuComponent/>
                </div>
            </div>
            <div className="header-and-page-container">
                <div className="header-holder">
                    <HeaderComponent/>
                </div>
                <div className="page-content-holder">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}


export default AppLayout;




