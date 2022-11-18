import "./DesignSystemScreen.scss";
import * as Yup from "yup";
import {useCallback, useState} from "react";
import {Field, FieldProps, Form, Formik} from 'formik';
import FormikPasswordInputComponent
    from "../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import FormikInputComponent from "../../shared/components/form-controls/formik-input/FormikInputComponent";
import {Login} from "@mui/icons-material";
import ChipComponent from "../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import FormikCheckBoxComponent from "../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import SwitchComponent from "../../shared/components/form-controls/switch/SwitchComponent";

interface DesignSystemScreenProps {

}

const designSystemFormValidationSchema = Yup.object({
    username: Yup.string()
        .required("Username is required"),
    password: Yup.string()
        .min(8, "Password must contain at least 8 characters")
        .required("Password is required")
});

const DesignSystemScreen = (props: DesignSystemScreenProps) => {

    const [designSystemFormInitialValues] = useState({
        username: "",
        password: "",
        tnc: true,
    });

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const onSubmit = useCallback((values: any) => {
        setIsFormSubmitting(true);
        setTimeout(() => {
            setIsFormSubmitting(false);
        }, 10000);
    }, []);

    return (
        <div className="design-system-screen screen">
            <div className="design-system-form-container">
                <h2>Login</h2>
                <ChipComponent
                    id={"login_info"}
                    label={"Login to access"}
                    onClick={() => {
                        console.log("do some action...!");
                    }}/>
                <div className="design-system-form">
                    <Formik
                        validationSchema={designSystemFormValidationSchema}
                        initialValues={designSystemFormInitialValues}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}
                        onSubmit={onSubmit}
                    >
                        {({isSubmitting, values, isValid, validateForm}) => {
                            return (
                                <Form className={"login-holder"} noValidate={true}>
                                    <Field name={'username'} className="t-form-control">
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
                                    <Field name={'tnc'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikCheckBoxComponent
                                                    label={"Accept TnC"}
                                                    formikField={field}
                                                    id={"accept_t_n_c"}
                                                    onChange={(isChecked) => {
                                                        console.log(isChecked, isChecked ? "accepted" : "not accepted");
                                                    }}/>
                                            )
                                        }
                                    </Field>
                                    <SwitchComponent label={'Switch'}
                                                     color={'primary'}
                                                     disabled={true}
                                                     onChange={() => {
                                                         console.log('switched')
                                                     }}/>
                                    <ButtonComponent
                                        suffixIcon={<Login/>}
                                        isLoading={isFormSubmitting}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"login_btn"}
                                    >
                                        {isFormSubmitting ? "Submitting" : "Submit"}
                                    </ButtonComponent>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    )
};

export default DesignSystemScreen;
