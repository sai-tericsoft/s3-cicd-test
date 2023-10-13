import "./OtpVerificationScreen.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import FormikOTPComponent from "../../../shared/components/form-controls/formik-otp/FormikOtpComponent";
import {CommonService} from "../../../shared/services";
import * as Yup from "yup";
import commonService from "../../../shared/services/common.service";
import useHandleNavigation from "../../../shared/hooks/useHandleNavigation";
import { useParams} from "react-router-dom";
import {ImageConfig, Misc} from "../../../constants";
import {LOGIN_ROUTE} from "../../../constants/RoutesConfig";


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

const OTP_VALIDITY = 60;

const OtpVerificationScreen = (props: OtpVerificationScreenProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isOTPBeingRequested, setIsOTPBeingRequested] = useState<boolean>(false);
    const handleNavigation = useHandleNavigation();
    const {email} = useParams();
    const runOTPCountdown = useCallback(() => {
        let timer = OTP_VALIDITY;
        setOtpTimer(timer);
        const interval = setInterval(() => {
            timer--;
            setOtpTimer(timer);
            if (timer === 0) {
                clearInterval(interval);
            }
        }, 1000);
    }, []);

    const handleResendOTP = useCallback((values: any) => {
        setIsOTPBeingRequested(true);
        CommonService._account.SendForgotPasswordMail({email})
            .then((response: any) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                runOTPCountdown();
                setIsOTPBeingRequested(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || 'Error sending OTP', "error");
                setIsOTPBeingRequested(false);
            }).finally(() => {
            runOTPCountdown();
            setIsOTPBeingRequested(false);
        });
    }, [runOTPCountdown,email]);

    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
        const payload = {
            username: email,
            login_mode: "email",
            otp: values.otp,
        }
        setIsLoading(true);
        CommonService._account.SendVerificationOtp(payload)
            .then((response: any) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsLoading(false);
                const token = response.data?.token;
                handleNavigation(commonService._routeConfig.ResetPasswordRoute(), `token=${token}`);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors, 'error');
                // CommonService.handleErrors(setErrors, error);
                setErrorMessage(error.errors || "Entered wrong code please try again")
                setIsLoading(false);
            })
    }, [handleNavigation,email]);
    useEffect(() => {
        if (OTP_VALIDITY > 0) {
            runOTPCountdown();
        }
    }, [runOTPCountdown])

    return (
        <div className="auth-screen otp-verification-screen">
            <div className="auth-form-container">
                <div className="auth-form-helper-text">
                    One Time Password (OTP) Verification
                </div>
                <div className="auth-form-welcome-text">
                    Please enter the OTP we sent to you on <br/>
                    <b>{email}</b>
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
                                    <div className={`form-option otp-option ${errorMessage ? "space-between" : ""}`}>
                                        {
                                            errorMessage && <div className="error-message">{errorMessage}</div>
                                        } {
                                        otpTimer > 0 ?
                                            <LinkComponent
                                                disabled={true}
                                                className={'otp-info text-decoration-none'}>
                                                {"Resend OTP in "}
                                                {CommonService.getMinsAndSecondsFromSeconds(otpTimer).minutes + " : " + CommonService.getMinsAndSecondsFromSeconds(otpTimer).seconds}
                                            </LinkComponent>
                                            :
                                            <LinkComponent
                                                onClick={() => handleResendOTP(values)}
                                                disabled={isOTPBeingRequested}
                                                className={'otp-info'}
                                            >
                                                {isOTPBeingRequested ? "Sending OTP" : "Resend OTP"}
                                            </LinkComponent>
                                    }
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
                                <div className="t-form-actions mrg-top-10">
                                    <ButtonComponent
                                        prefixIcon={<ImageConfig.LeftArrow/>}
                                        fullWidth={true}
                                        variant={"text"}
                                        onClick={() => handleNavigation(LOGIN_ROUTE)}
                                    >
                                        Back to Login
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
