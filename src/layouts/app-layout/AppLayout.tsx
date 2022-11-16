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

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const {token} = useSelector((state: IRootReducerState) => state.account);
    const logoutSubscriptionRef = useRef(true);

    console.log(props, location);

    useEffect(() => {
        // if (!token) {
        //     navigate('/login?returnUrl=' + encodeURIComponent(location.pathname + location.search));
        // }
    }, [token, navigate, location]);

    useEffect(() => {
        CommonService._communications.logoutSubject.subscribe(() => {
            // CommonService._alert.showToast('Session expired, Please register', 'info');
            if (!logoutSubscriptionRef.current) return null;
            dispatch(logout());
        });
        return () => {
            logoutSubscriptionRef.current = false;
        }
    }, [dispatch]);

    useEffect(() => { // TODO: move to appropriate position later
        if (token) {
           // call and store static apis data
        }
    }, [dispatch, token]);

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




