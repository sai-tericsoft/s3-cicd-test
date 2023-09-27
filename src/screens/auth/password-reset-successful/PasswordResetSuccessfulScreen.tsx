import "./PasswordResetSuccessfulScreen.scss";
import {Field, FieldProps, Form, Formik} from "formik";
import {useEffect} from "react";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikPasswordInputComponent
    from "../../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {FORGOT_PASSWORD_ROUTE, LOGIN_ROUTE} from "../../../constants/RoutesConfig";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";

interface PasswordResetSuccessfulScreenProps {

}

const PasswordResetSuccessfulScreen = (props: PasswordResetSuccessfulScreenProps) => {

    return (
        <div className="login-screen password-reset-successful-screen">
            <div className="login-form-container">
                <div className="login-form-helper-text">
                    Password Reset
                </div>
                <div className="login-form-welcome-text">
                    Your password has been successfully reset. Please proceed to login.
                </div>
                <div className="success_avatar">
                    {<ImageConfig.SuccessAvatar className="d-block"/>}
                </div>
                <LinkComponent route={LOGIN_ROUTE}>
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