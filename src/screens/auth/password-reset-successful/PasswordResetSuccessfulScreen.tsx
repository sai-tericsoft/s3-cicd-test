import "./PasswordResetSuccessfulScreen.scss";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import commonService from "../../../shared/services/common.service";
import useHandleNavigation from "../../../shared/hooks/useHandleNavigation";

interface PasswordResetSuccessfulScreenProps {

}

const PasswordResetSuccessfulScreen = (props: PasswordResetSuccessfulScreenProps) => {
    const handleNavigation = useHandleNavigation();

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
                <ButtonComponent
                    fullWidth
                    onClick={() => handleNavigation(commonService._routeConfig.LoginRoute())}
                >
                    Proceed to Login
                </ButtonComponent>
            </div>
        </div>
    );

};

export default PasswordResetSuccessfulScreen;
