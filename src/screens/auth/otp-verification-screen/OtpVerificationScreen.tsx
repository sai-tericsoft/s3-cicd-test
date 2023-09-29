import "./OtpVerificationScreen.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {LOGIN_ROUTE, OTP_VERIFICATION_ROUTE, RESET_PASSWORD_ROUTE} from "../../../constants/RoutesConfig";
import FormikOTPComponent from "../../../shared/components/form-controls/formik-otp/FormikOtpComponent";
import {useDispatch} from "react-redux";
import {useNavigate, useLocation} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import * as Yup from "yup";
import commonService from "../../../shared/services/common.service";

interface OtpVerificationScreenProps {

}

const otpFormValidationSchema = Yup.object({
    otp: Yup.string()
        .min(6, "OTP must be 6 digits")
        .max(6, "OTP must be 6 digits")
        .required("OTP is required")
});

const otpFormInitialValues = {
    otp: ""
}

const OtpVerificationScreen = (props: OtpVerificationScreenProps) => {
    const [isLoading, setIsLoading] = useState(false);
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

    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
        setIsLoading(true);
        CommonService._account.SendVerificationOtp(values)
            .then((response: any) => {
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsLoading(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors, 'error');
                // CommonService.handleErrors(setErrors, error);
                setIsLoading(false);
            }).finally(() => {
            handleNavigation(commonService._routeConfig.ResetPasswordRoute());
        })
    }, []);

    return (
        <div className="auth-screen otp-verification-screen">
            <div className="auth-form-container">
                <div className="auth-form-helper-text">
                    One Time Password (OTP) Verification
                </div>
                <div className="auth-form-welcome-text">
                    Please enter the OTP we sent to you.
                </div>
                <Formik
                    validationSchema={otpFormValidationSchema}
                    initialValues={otpFormInitialValues}
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
                                    <div className="form-option otp-option">
                                        <div className="error-message">Entered wrong code please try again</div>
                                        <div className="resend-otp">Resend</div>
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isLoading}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"otp_btn"}
                                    >
                                        {isLoading ? "Submitting" : "Submit"}
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