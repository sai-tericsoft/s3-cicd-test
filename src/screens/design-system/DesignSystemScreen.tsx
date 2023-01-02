import "./DesignSystemScreen.scss";
import * as Yup from "yup";
import React, {useCallback, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from 'formik';
import FormikPasswordInputComponent
    from "../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import FormikInputComponent from "../../shared/components/form-controls/formik-input/FormikInputComponent";
import CardComponent from "../../shared/components/card/CardComponent";
import FormAutoSave from "../../shared/utils/FormAutoSave";
import {Login} from "@mui/icons-material";
import ButtonComponent from "../../shared/components/button/ButtonComponent";

interface DesignSystemScreenProps {

}

const designSystemFormValidationSchema = Yup.object({
    // username: Yup.string()
    //     .required("Username is required"),
    // password: Yup.string()
    //     .min(8, "Password must contain at least 8 characters")
    //     .required("Password is required")
});

const DesignSystemScreen = (props: DesignSystemScreenProps) => {

    const [designSystemFormInitialValues] = useState({
        username: "terrill@gmail.com",
        password: "123455",
    });

    const onSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        console.log(values);
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
        }, 500);
    }, [])

    return (
        <div className="design-system-screen screen">
            <div className="design-system-form-container">
                <CardComponent title={"Sign up"}>
                    <Formik
                        validationSchema={designSystemFormValidationSchema}
                        initialValues={designSystemFormInitialValues}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}
                        onSubmit={onSubmit}
                    >
                        {(formik) => {
                            return (
                                <Form className={"login-holder"} noValidate={true}>
                                    <FormAutoSave formikCtx={formik} delay={4000}/>
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
                                    <ButtonComponent
                                        suffixIcon={<Login/>}
                                        isLoading={formik.isSubmitting}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"login_btn"}
                                    >
                                        {formik.isSubmitting ? "Submitting" : "Submit"}
                                    </ButtonComponent>
                                </Form>
                            )
                        }}
                    </Formik>
                </CardComponent>
            </div>
        </div>
    );
};


export default DesignSystemScreen;
