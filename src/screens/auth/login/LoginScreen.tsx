import "./LoginScreen.scss";
import * as Yup from "yup";
import {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikPasswordInputComponent
    from "../../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../shared/services";
import {setLoggedInUserData, setLoggedInUserToken} from "../../../store/actions/account.action";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IAccountLoginCredentials, ILoginResponse} from "../../../shared/models/account.model";
import {useDispatch} from "react-redux";
import {ENV} from "../../../constants";

interface LoginScreenProps {

}

const loginFormValidationSchema = Yup.object({
    email: Yup.string()
        .email("Email is invalid")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be 8 characters")
        .max(16, "Password must be max 16 characters")
        .required("Password is required")
});


const LoginScreen = (props: LoginScreenProps) => {

    const [loginFormInitialValues, setLoginFormInitialValues] = useState<IAccountLoginCredentials>({
        email: "",
        password: "",
    });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (ENV.ENV_MODE === "dev") {
            setLoginFormInitialValues({
                email: "terrill@gmail.com",
                password: "12345678",
            })
        }
    }, []);

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
                // CommonService.handleErrors(setErrors, error);
                setIsLoggingIn(false);
            })
    }, [dispatch]);

    return (
        <div className="login-screen">
            <div className="login-form-container">
                <div className="login-form-welcome-text">
                    Welcome!
                </div>
                <div className="login-form-helper-text">
                    Login to continue
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
                                                    placeholder={'Enter Email'}
                                                    type={"email"}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    id={"email_input"}
                                                />
                                            )
                                        }
                                    </Field>
                                    <Field name={'password'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikPasswordInputComponent
                                                    label={'Password'}
                                                    placeholder={'Enter Password'}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    canToggle={true}
                                                    id={"password_input"}
                                                />
                                            )
                                        }
                                    </Field>
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isLoggingIn}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"login_btn"}
                                    >
                                        {isLoggingIn ? "Logging in" : "Login"}
                                    </ButtonComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )

};

export default LoginScreen;