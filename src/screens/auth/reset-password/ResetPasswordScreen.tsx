import "./ResetPasswordScreen.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState, useRef} from "react";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikPasswordInputComponent
    from "../../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {FORGOT_PASSWORD_ROUTE, PASSWORD_RESET_SUCCESS_ROUTE} from "../../../constants/RoutesConfig";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {
    IAccountLoginCredentials,
    ILoginResponse,
    IPasswordResetCredentials
} from "../../../shared/models/account.model";
import {useDispatch} from "react-redux";
import {ENV} from "../../../constants";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setLoggedInUserData, setLoggedInUserToken} from "../../../store/actions/account.action";
import * as Yup from "yup";
import PasswordValidationComponent from "../../../shared/components/password-validation/PasswordValidationComponent";
import {useNavigate} from "react-router-dom";

interface ResetPasswordScreenProps {

}

const loginFormValidationSchema = Yup.object({
    new_password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(16, 'Password must be no more than 16 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one digit')
        .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirm_password: Yup.string()
        .required('Confirm Password is required')

});
const ResetPasswordScreen = (props: ResetPasswordScreenProps) => {
    const [loginFormInitialValues, setLoginFormInitialValues] = useState<IPasswordResetCredentials>({
        new_password: "",
        confirm_password: "",
    });
    const navigate = useNavigate();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const dispatch = useDispatch();

    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
        setIsLoggingIn(true);
        CommonService._account.LoginAPICall(values)
            .then((response: IAPIResponseType<ILoginResponse>) => {
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                dispatch(setLoggedInUserData(response.data.user));
                dispatch(setLoggedInUserToken(response.data.token));
                setIsLoggingIn(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors, 'error');
                // CommonService.handleErrors(setErrors, error);
                setIsLoggingIn(false);
            }).finally(() => {
            console.log("navigate");
            navigate(PASSWORD_RESET_SUCCESS_ROUTE)
        });
    }, [dispatch]);
    return (
        <div className="login-screen reset-password-screen">
            <div className="login-form-container">
                <div className="login-form-welcome-text">
                    Reset Password
                </div>
                <div className="login-form-helper-text">
                    Choose a new and secure password. Please do not share this with anyone.
                </div>
                <Formik
                    validationSchema={loginFormValidationSchema}
                    initialValues={loginFormInitialValues}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={onSubmit}
                >
                    {({values, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form className="t-form" noValidate={true}>
                                <div className="t-form-controls">
                                    <Field name={'new_password'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikPasswordInputComponent
                                                    label={'New Password'}
                                                    placeholder={'New Password'}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    canToggle={true}
                                                    id={"new_password_input"}
                                                />
                                            )
                                        }
                                    </Field>
                                    <Field name={'confirm_password'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikPasswordInputComponent
                                                    label={'Confirm Password'}
                                                    placeholder={'Confirm Password'}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    canToggle={true}
                                                    id={"confirm_password_input"}
                                                />
                                            )
                                        }
                                    </Field>
                                    <div className="password-validator-container">
                                        <PasswordValidationComponent password={values.new_password}/>
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isLoggingIn}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"login_btn"}
                                    >
                                        {isLoggingIn ? "Saving" : "Save"}
                                    </ButtonComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );

};

export default ResetPasswordScreen;