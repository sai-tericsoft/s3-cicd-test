import React, {useEffect} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../store/reducers";
import {CommonService} from "../../shared/services";
import {ImageConfig} from "../../constants";

export interface AuthLayoutProps {

}

const AuthLayout = (props: React.PropsWithChildren<AuthLayoutProps>) => {

    const navigate = useNavigate();
    const location = useLocation();
    const {token} = useSelector((state: IRootReducerState) => state.account);

    useEffect(() => {
        let returnUrl = CommonService._routeConfig.Dashboard();
        if (!!token) {
            const query = CommonService.parseQueryString(location.search);
            if (Object.keys(query).includes('returnUrl')) {
                returnUrl = query.returnUrl;
            }
            navigate(returnUrl);
        }
    }, [token, navigate, location])

    return (
        <div className="auth-layout">
            <div className="auth-wrapper">
                <div className="auth-form">
                    <div className="logo-wrapper">
                        <img src={ImageConfig.sdiLogo} alt={'sdiLogo'}/>
                    </div>
                    <Outlet/>
                </div>
            </div>
        </div>

    )
}


export default AuthLayout;
