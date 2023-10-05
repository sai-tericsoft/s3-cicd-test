import "./ResetPasswordScreen.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
import FormikPasswordInputComponent
    from "../../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {
    IPasswordResetCredentials
} from "../../../shared/models/account.model";
import {useDispatch} from "react-redux";
import {CommonService} from "../../../shared/services";
import * as Yup from "yup";
import PasswordValidationComponent from "../../../shared/components/password-validation/PasswordValidationComponent";
import commonService from "../../../shared/services/common.service";
import useHandleNavigation from "../../../shared/hooks/useHandleNavigation";

interface ResetPasswordScreenProps {

}

const resetFormValidationSchema = Yup.object({
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
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
});
const resetFormInitialValues: IPasswordResetCredentials = {
    new_password: "",
    confirm_password: "",
}
const ResetPasswordScreen = (props: ResetPasswordScreenProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const handleNavigation = useHandleNavigation();

    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
        setIsLoading(true);
        CommonService._account.SetNewPassword(values)
            .then((response: any) => {
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsLoading(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors, 'error');
                // CommonService.handleErrors(setErrors, error);
                setIsLoading(false);
            }).finally(() => {
            handleNavigation(commonService._routeConfig.PasswordResetSuccessRoute())
        });
    }, [dispatch,handleNavigation]);

    return (
        <div className="auth-screen reset-password-screen">
            <div className="auth-form-container">
                <div className="auth-form-welcome-text">
                    Reset Password
                </div>
                <div className="auth-form-helper-text">
                    Choose a new and secure password. Please do not share this with anyone.
                </div>
                <Formik
                    validationSchema={resetFormValidationSchema}
                    initialValues={resetFormInitialValues}
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
                                        isLoading={isLoading}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"reset_btn"}
                                    >
                                        {isLoading ? "Saving" : "Save"}
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
