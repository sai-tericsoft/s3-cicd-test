import "./OtpVerificationScreen.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {LOGIN_ROUTE, OTP_VERIFICATION_ROUTE} from "../../../constants/RoutesConfig";
import {ImageConfig} from "../../../constants";
import FormikOTPComponent from "../../../shared/components/form-controls/formik-otp/FormikOtpComponent";
import {IAccountLoginCredentials, ILoginResponse} from "../../../shared/models/account.model";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setLoggedInUserData, setLoggedInUserToken} from "../../../store/actions/account.action";
import * as Yup from "yup";

interface OtpVerificationScreenProps {

}

const loginFormValidationSchema = Yup.object({
    otp: Yup.string()
        .min(6, "OTP must be 6 digits")
        .max(6, "OTP must be 6 digits")
        .required("OTP is required")
});

const OtpVerificationScreen = (props: OtpVerificationScreenProps) => {
    const [loginFormInitialValues, setLoginFormInitialValues] = useState<any>({
        email: "",
        password: "",
        otp: ""
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
        <div className="login-screen otp-verification-screen">
            <div className="login-form-container">
                <div className="login-form-helper-text">
                    One Time Password (OTP) Verification
                </div>
                <div className="login-form-welcome-text">
                    Please enter the OTP we sent to you.
                </div>
                <Formik
                    validationSchema={loginFormValidationSchema}
                    initialValues={loginFormInitialValues}
                    // validateOnChange={false}
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
                                    <Field name={'otp'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikOTPComponent
                                                    label={'OTP'}
                                                    // placeholder={'Enter Email Address'}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
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
                                        {isLoggingIn ? "Submitting" : "Submit"}
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

export default OtpVerificationScreen;