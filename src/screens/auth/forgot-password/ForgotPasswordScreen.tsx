import "./ForgotPasswordScreen.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import * as Yup from "yup";
import {CommonService} from "../../../shared/services";
import {LOGIN_ROUTE} from "../../../constants/RoutesConfig";
import {ImageConfig} from "../../../constants";
import commonService from "../../../shared/services/common.service";
import useHandleNavigation from "../../../shared/hooks/useHandleNavigation";
import {Misc} from "../../../constants";


interface ForgotPasswordScreenProps {

}

const forgotFormValidationSchema = Yup.object({
    email: Yup.string()
        .email("Email is invalid")
        .matches(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Enter a valid Email ID")
        .required("Email is required"),
});
const forgotFormInitialValues = {
    email: ""
}

const ForgotPasswordScreen = (props: ForgotPasswordScreenProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleNavigation = useHandleNavigation();
    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
        setIsLoading(true);
        CommonService._account.SendForgotPasswordMail(values)
            .then((response: any) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsLoading(false);
                handleNavigation(commonService._routeConfig.OtpVerificationRoute(values.email));
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors, 'error');
                // CommonService.handleErrors(setErrors, error);
                setIsLoading(false);
            })
    }, [handleNavigation]);

    return (
        <div className="auth-screen forgot-password-screen">
            <div className="auth-form-container">
                <div className="auth-form-helper-text">
                    Forgot your password?
                </div>
                <div className="auth-form-welcome-text">
                    Please enter your phone number/email address to receive a
                    One Time Password (OTP).
                </div>
                <Formik
                    validationSchema={forgotFormValidationSchema}
                    initialValues={forgotFormInitialValues}
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
                                        isLoading={isLoading}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"forgot_btn"}
                                    >
                                        {isLoading ? "Sending OTP" : "Send OTP"}
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

export default ForgotPasswordScreen;
