import "./DesignSystemScreen.scss";
import * as Yup from "yup";
import {useCallback, useState} from "react";
import {Field, FieldProps, Form, Formik} from 'formik';
import FormikInputComponent from "../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikPasswordInputComponent
    from "../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";

interface DesignSystemScreenProps {

}

const designSystemFormSchema = Yup.object({
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
    });

    const onSubmit = useCallback((values: any) => {
        console.log("form values", values);
    }, []);

    return (
        <div className="design-system-screen screen">
            <h2>Design System</h2>
            <div>
                <Formik
                    validationSchema={designSystemFormSchema}
                    initialValues={designSystemFormInitialValues}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={onSubmit}
                >
                    {({isSubmitting, values, isValid, validateForm}) => {
                        return (
                            <Form className={"login-holder"}>
                                <Field name={'username'} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={'Email'}
                                                placeholder={'Enter Email'}
                                                type={"email"}
                                                required={true}
                                                formikField={field}
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
                                            />
                                        )
                                    }
                                </Field>
                                <button type="submit">
                                    Save
                                </button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
};

export default DesignSystemScreen;
