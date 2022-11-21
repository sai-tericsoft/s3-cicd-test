import React, {useEffect, useRef} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../store/reducers";
import {CommonService} from "../../shared/services";
import {logout} from "../../store/actions/account.action";
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




