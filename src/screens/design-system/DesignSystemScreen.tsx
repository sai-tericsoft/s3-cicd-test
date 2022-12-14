import "./DesignSystemScreen.scss";
import * as Yup from "yup";
import React, {useCallback, useState} from "react";
import {Field, FieldProps, Form, Formik} from 'formik';
import FormikPasswordInputComponent
    from "../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import FormikInputComponent from "../../shared/components/form-controls/formik-input/FormikInputComponent";
import {Login} from "@mui/icons-material";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import FormikCheckBoxComponent from "../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import FormikSwitchComponent from "../../shared/components/form-controls/formik-switch/FormikSwitchComponent";
import ModalComponent from "../../shared/components/modal/ModalComponent";
import CardComponent from "../../shared/components/card/CardComponent";
import FormikRadioButtonGroupComponent
    from "../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import FormikAutoCompleteComponent
    from "../../shared/components/form-controls/formik-auto-complete/FormikAutoCompleteComponent";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../shared/components/tabs/TabsComponent";
import FormikDatePickerComponent
    from "../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {ITableColumn} from "../../shared/models/table.model";
import TableComponent from "../../shared/components/table/TableComponent";
import {ImageConfig} from "../../constants";
import IconButtonComponent from "../../shared/components/icon-button/IconButtonComponent";
import InputComponent from "../../shared/components/form-controls/input/InputComponent";
import FormikSelectComponent from "../../shared/components/form-controls/formik-select/FormikSelectComponent";

interface DesignSystemScreenProps {

}

const designSystemFormValidationSchema = Yup.object({
    name: Yup.string()
        .required("Name is required"),
    username: Yup.string()
        .required("Username is required"),
    dob: Yup.string()
        .required("Date of Birth is required"),
    password: Yup.string()
        .min(8, "Password must contain at least 8 characters")
        .required("Password is required")
});

const DesignSystemScreen = (props: DesignSystemScreenProps) => {

    const options = [{title: 'Male', code: 'm', _id: 'm'}, {title: 'Female', code: 'f', _id: 'f'}];
    const users = [{fName: 'Mick', lName: 'John', _id: 1}, {fName: 'John', lName: 'Doe', _id: 2}];

    const [designSystemFormInitialValues] = useState({
        name: "",
        username: "",
        password: "",
        tnc: true,
        gender: "m",
        dob: "",
        rm: users[0],
        accessAsAdmin: true,

    });

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [isTnCModalOpened, setIsTnCModalOpened] = useState(false);
    const [currentTab, setCurrentTab] = useState<string>("tab2");


    const onSubmit = useCallback((values: any) => {
        console.log(values);
        setIsFormSubmitting(true);
        setTimeout(() => {
            setIsFormSubmitting(false);
        }, 2000);
    }, []);

    const columns: ITableColumn[] = [
        {
            title: "Movement",
            dataIndex: "movement",
            key: "movement"
        },
        {
            title: "AROM",
            dataIndex: "arom",
            key: "arom",
            render: (index: number, item: any) => <Field name={`arom-${item?.movement}`} className="t-form-control">
                {
                    (field: FieldProps) => (
                        <FormikInputComponent
                            required={true}
                            formikField={field}
                            size={"small"}
                        />
                    )
                }
            </Field>
        },
        {
            title: "PROM",
            dataIndex: "prom",
            key: "prom",
            render: (index: number, item: any) => <Field name={`prom-${item?.movement}`} className="t-form-control">
                {
                    (field: FieldProps) => (
                        <FormikInputComponent
                            required={true}
                            formikField={field}
                            size={"small"}
                        />
                    )
                }
            </Field>
        },
        {
            title: "Strength",
            dataIndex: "strength",
            key: "strength",
            render: (index: number, item: any) => <Field name={`strength-${item?.movement}`} className="t-form-control">
                {
                    (field: FieldProps) => (
                        <FormikSelectComponent
                            options={[
                                {
                                    code: "1/5",
                                    title: "1/5"
                                },
                                {
                                    code: "2/5",
                                    title: "2/5"
                                }
                            ]}
                            autoWidth={true}
                            required={true}
                            formikField={field}
                            size={"small"}
                        />
                    )
                }
            </Field>
        },
        {
            title: "Comments",
            dataIndex: "",
            render: (item: any) => <IconButtonComponent color={"inherit"}>
                <ImageConfig.CommentIcon/>
            </IconButtonComponent>
        }
    ];

    const data: any = [
        {
            key: 1,
            movement: "Flexion",
        },
        {
            key: 2,
            movement: "Extension",
        },
        {
            key: 3,
            movement: "Supination",
        },
        {
            key: 4,
            movement: "Pronation",
        }
    ];

    return (
        <div className="design-system-screen screen">
            <div className="design-system-form-container">
                <CardComponent>
                    <TabsWrapperComponent>
                        <TabsComponent
                            value={currentTab}
                            allowScrollButtonsMobile={false}
                            onUpdate={(e: any, v: any) => {
                                setCurrentTab(v);
                            }}
                            variant={"fullWidth"}
                        >
                            <TabComponent label="Login" value={"tab1"}/>
                            <TabComponent label="Register" value={"tab2"}/>
                            <TabComponent label="SSO" value={"tab3"}/>
                        </TabsComponent>
                        <TabContentComponent selectedTab={currentTab} value={"tab1"}>
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
                                                <Field name={'name'} className="t-form-control">
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikInputComponent
                                                                label={'Name'}
                                                                titleCase={true}
                                                                placeholder={'Enter Name'}
                                                                type={"email"}
                                                                required={true}
                                                                formikField={field}
                                                                fullWidth={true}
                                                                id={"email_input"}
                                                            />
                                                        )
                                                    }
                                                </Field>
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
                                                <Field name={'dob'} className="t-form-control">
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikDatePickerComponent
                                                                label={'Date of Birth'}
                                                                placeholder={'Date of Birth'}
                                                                required={true}
                                                                formikField={field}
                                                                fullWidth={true}
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
                                                {/*<Field name={'rm'}>*/}
                                                {/*    {*/}
                                                {/*        (field: FieldProps) => (*/}
                                                {/*            <FormikSelectComponent*/}
                                                {/*                formikField={field}*/}
                                                {/*                fullWidth={true}*/}
                                                {/*                displayWith={item => item.fName + " " +item.lName}*/}
                                                {/*                valueExtractor={item => item.id}*/}
                                                {/*                keyExtractor={item => item.id}*/}
                                                {/*                label={"Reporting Manager"}*/}
                                                {/*                options={users}/>*/}
                                                {/*        )*/}
                                                {/*    }*/}
                                                {/*</Field>*/}
                                                <Field name={'rm'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikAutoCompleteComponent
                                                                formikField={field}
                                                                fullWidth={true}
                                                                displayWith={item => item ? (item.fName || "") + " " + (item.lName || "") : ""}
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
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione,
                                    repellendus! <br/><br/>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque cupiditate
                                    dignissimos
                                    eligendi,
                                    nam non numquam provident recusandae! Culpa, maxime sint! <br/><br/>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci aut eius eos
                                    est
                                    expedita
                                    hic itaque, maxime minus voluptatibus.
                                </ModalComponent>
                            </div>
                        </TabContentComponent>
                        <TabContentComponent selectedTab={currentTab} value={"tab2"}>
                            <Formik
                                initialValues={{}}
                                validateOnChange={false}
                                validateOnBlur={true}
                                enableReinitialize={true}
                                validateOnMount={true}
                                onSubmit={onSubmit}
                            >
                                {(formik) => {
                                    return (
                                        <Form className={"login-holder"} noValidate={true}>
                                            <TableComponent data={data} columns={columns}/>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </TabContentComponent>
                        <TabContentComponent selectedTab={currentTab} value={"tab3"}>
                            SSO
                        </TabContentComponent>
                    </TabsWrapperComponent>
                </CardComponent>
            </div>
        </div>
    );
};


export default DesignSystemScreen;
