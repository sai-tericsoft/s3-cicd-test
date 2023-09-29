import "./PasswordResetSuccessfulScreen.scss";
import {useCallback} from "react";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../../shared/services";
import {useNavigate, useLocation} from "react-router-dom";
import commonService from "../../../shared/services/common.service";

interface PasswordResetSuccessfulScreenProps {

}

const PasswordResetSuccessfulScreen = (props: PasswordResetSuccessfulScreenProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = useCallback((route: string) => {
        let returnUrl = CommonService._routeConfig.Dashboard();
        const query = CommonService.parseQueryString(location.search);
        if (Object.keys(query).includes('returnUrl')) {
            returnUrl = query.returnUrl;
        }
        navigate(route + `?returnUrl=${returnUrl}`);
    }, [location, navigate]);

    return (
        <div className="auth-screen password-reset-successful-screen">
            <div className="auth-form-container">
                <div className="auth-form-helper-text">
                    Password Reset
                </div>
                <div className="auth-form-welcome-text">
                    Your password has been successfully reset. Please proceed to login.
                </div>
                <div className="success_avatar">
                    {<ImageConfig.SuccessAvatar className="d-block"/>}
                </div>
                <LinkComponent onClick={() => handleNavigation(commonService._routeConfig.LoginRoute())}>
                    <ButtonComponent
                        fullWidth
                    >
                        Proceed to Login
                    </ButtonComponent>
                </LinkComponent>
            </div>
        </div>
    );

};

export default PasswordResetSuccessfulScreen;