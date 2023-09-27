import "./ForgotPasswordScreen.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikPasswordInputComponent
    from "../../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import * as Yup from "yup";
import {IAccountLoginCredentials, ILoginResponse} from "../../../shared/models/account.model";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setLoggedInUserData, setLoggedInUserToken} from "../../../store/actions/account.action";
import {useDispatch} from "react-redux";
import {OTP_VERIFICATION_ROUTE, LOGIN_ROUTE} from "../../../constants/RoutesConfig";
import {ImageConfig} from "../../../constants";
import {useNavigate} from "react-router-dom";

interface ForgotPasswordScreenProps {

}

const loginFormValidationSchema = Yup.object({
    email: Yup.string()
        .email("Email is invalid")
        .required("Email is required"),
});

const ForgotPasswordScreen = (props: ForgotPasswordScreenProps) => {
    const [loginFormInitialValues, setLoginFormInitialValues] = useState<IAccountLoginCredentials>({
        email: "",
        password: "",
    });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            navigate(OTP_VERIFICATION_ROUTE)
        })
    }, [dispatch]);

    return (
        <div className="login-screen forgot-password-screen">
            <div className="login-form-container">
                <div className="login-form-helper-text">
                    Forgot your password?
                </div>
                <div className="login-form-welcome-text">
                    Please enter your phone number/email address to receive a
                    One Time Password (OTP).
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
                                    <Field name={'email'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikInputComponent
                                                    label={'Email'}
                                                    placeholder={'Enter Email Address'}
                                                    type={"email"}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    id={"email_input"}
                                                />
                                            )
                                        }
                                    </Field>
                                    {/*<div className="form-option">*/}
                                    {/*    <LinkComponent route={"/forgot-password"}>Enter Email Address</LinkComponent>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isLoggingIn}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"login_btn"}
                                    >
                                        {isLoggingIn ? "Sending OTP" : "Send OTP"}
                                    </ButtonComponent>
                                </div>
                                <div className="t-form-actions mrg-top-10">
                                    <LinkComponent route={LOGIN_ROUTE}>
                                        <ButtonComponent
                                            prefixIcon={<ImageConfig.LeftArrow/>}
                                            fullWidth={true}
                                            variant={"text"}
                                        >
                                            Back to Login
                                        </ButtonComponent>
                                    </LinkComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );

};

export default ForgotPasswordScreen;