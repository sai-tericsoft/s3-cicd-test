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
        {title: "Name", dataIndex: "name"},
        {title: "Age", dataIndex: "age"},
        {title: "Address", dataIndex: "address"},
        {
            title: "Action",
            dataIndex: "",
            render: () => <a>Delete</a>
        }
    ];

    const data: any = [
        {
            key: 1,
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            description:
                "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
        },
        {
            key: 2,
            name: "Jim Green",
            age: 42,
            address: "London No. 1 Lake Park",
            description:
                "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
        },
        {
            key: 3,
            name: "Not Expandable",
            age: 29,
            address: "Jiangsu No. 1 Lake Park",
            description: "This not expandable"
        },
        {
            key: 4,
            name: "Joe Black",
            age: 32,
            address: "Sidney No. 1 Lake Park",
            description:
                "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park."
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
                            <TableComponent
                                columns={columns}
                                defaultExpandAllRows
                                showExpandColumn={false}
                                expandRow={(record: any) => (
                                    <p style={{margin: 0}}>
                                        <div><ImageConfig.ChartNotes/> {record.description}</div>
                                    </p>
                                )}
                                data={data}
                            />
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
