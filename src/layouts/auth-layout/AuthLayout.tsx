import React from "react";
import {Outlet} from "react-router-dom";
import {ImageConfig, Misc} from "../../constants";

export interface AuthLayoutProps {

}

const AuthLayout = (props: React.PropsWithChildren<AuthLayoutProps>) => {

    return (
        <div className="auth-layout">
            <div className="logo-wrapper">
                <img src={ImageConfig.Logo} alt={Misc.APP_NAME + 'Logo'}/>
            </div>
            <div className="auth-wrapper">
                <div className="auth-form">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}


export default AuthLayout;
