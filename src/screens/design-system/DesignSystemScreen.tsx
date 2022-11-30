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
import FormikSwitchComponent from "../../shared/components/form-controls/formik-switch/FormikSwitchComponent";
import ModalComponent from "../../shared/components/modal/ModalComponent";
import CardComponent from "../../shared/components/card/CardComponent";
import FormikRadioButtonGroupComponent
    from "../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import FormikSelectComponent from "../../shared/components/form-controls/formik-select/FormikSelectComponent";
import DataLabelValueComponent from "../../shared/components/data-label-value/DataLabelValueComponent";

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

    const options = [{title: 'Male', code: 'm'}, {title: 'Female', code: 'f'}];
    const users = [{fName: 'Mick', lName: 'John', id: 1}, {fName: 'John', lName: 'Doe', id: 2}];

    const [designSystemFormInitialValues] = useState({
        username: "",
        password: "",
        tnc: true,
        gender: "m",
        rm: 1,
        accessAsAdmin: true,

    });

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [isTnCModalOpened, setIsTnCModalOpened] = useState(false);

    const onSubmit = useCallback((values: any) => {
        console.log(values);
        setIsFormSubmitting(true);
        setTimeout(() => {
            setIsFormSubmitting(false);
        }, 2000);
    }, []);

    const address = {
        fNo: "101",
        city: "Las Vegas",
        state: "NV 89123 USA"
    }

    return (
        <div className="design-system-screen screen">
            <div className="design-system-form-container">
                <CardComponent title={"Login"}>
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
                                        <Field name={'gender'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikRadioButtonGroupComponent
                                                        formikField={field}
                                                        options={options}/>
                                                )
                                            }
                                        </Field>
                                        <Field name={'rm'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        formikField={field}
                                                        fullWidth={true}
                                                        displayWith={item => item.fName + " " +item.lName}
                                                        valueExtractor={item => item.id}
                                                        keyExtractor={item => item.id}
                                                        label={"Reporting Manager"}
                                                        options={users}/>
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
                                        <Field name={'accessAsAdmin'} className="t-form-control">
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSwitchComponent
                                                        label={"Access as Admin"}
                                                        formikField={field}
                                                        id={"access_as_admin"}
                                                        onChange={(isChecked) => {
                                                            console.log(isChecked, isChecked ? "accepted" : "not accepted");
                                                        }}/>
                                                )
                                            }
                                        </Field>
                                        <div className="text-decoration-underline mrg-bottom-10 cursor-pointer"
                                             onClick={() => {
                                                 setIsTnCModalOpened(true);
                                             }}>
                                            Terms and Conditions
                                        </div>
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
                        <ModalComponent isOpen={isTnCModalOpened}
                                        title={"Terms & Conditions"}
                                        showClose={true}
                                        direction={"up"}
                                        closeOnBackDropClick={true}
                                        closeOnEsc={true}
                                        onClose={() => {
                                            setIsTnCModalOpened(false);
                                        }}
                                        modalFooter={<>
                                            <ButtonComponent
                                                variant={"outlined"}
                                                onClick={() => {
                                                    setIsTnCModalOpened(false);
                                                }}>
                                                Accept
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent
                                                color={"error"}
                                                onClick={() => {
                                                    setIsTnCModalOpened(false);
                                                }}>
                                                Reject
                                            </ButtonComponent>
                                        </>
                                        }
                        >
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, repellendus! <br/><br/>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque cupiditate dignissimos
                            eligendi,
                            nam non numquam provident recusandae! Culpa, maxime sint! <br/><br/>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci aut eius eos est
                            expedita
                            hic itaque, maxime minus voluptatibus.
                        </ModalComponent>
                    </div>
                </CardComponent>
            </div>
        </div>
    )
};


export default DesignSystemScreen;
