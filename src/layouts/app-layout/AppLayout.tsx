import React from "react";
import {Outlet} from "react-router-dom";
import BrandingComponent from "../../shared/components/layout/branding/BrandingComponent";
import SideMenuComponent from "../../shared/components/layout/side-menu/SideMenuComponent";
import HeaderComponent from "../../shared/components/layout/header/HeaderComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../store/reducers";
import {ImageConfig} from "../../constants";
import {setSideMenuView} from "../../store/actions/navigation.action";

export interface AppLayoutProps {

}

const AppLayout = (props: AppLayoutProps) => {

    const {sideMenuView} = useSelector((state: IRootReducerState) => state.navigation);
    const dispatch = useDispatch();

    return (
        <div className="app-layout">
            <div className={`side-bar-holder ${sideMenuView}-view`}>
                <div className="logo-holder">
                    <BrandingComponent/>
                </div>
                <div className="side-menu-holder">
                    <SideMenuComponent/>
                </div>
                <div className="side-menu-toggle-icon" onClick={() => {
                    dispatch(setSideMenuView(sideMenuView === "default" ? "compact" : "default"));
                }}>
                    {
                        sideMenuView === "default" && <ImageConfig.LeftArrow/>
                    }
                    {
                        sideMenuView === "compact" && <ImageConfig.RightArrow/>
                    }
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




