import "./ClientBasicDetailsFormComponent.scss";
import * as Yup from "yup";
import {useCallback, useEffect, useState} from "react";
import {IClientBasicDetailsForm} from "../../../shared/models/client.model";
import _ from "lodash";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IServiceAdd} from "../../../shared/models/service.model";
import {ImageConfig, Misc} from "../../../constants";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";

interface ClientBasicDetailsFormComponentProps {
    mode: "add" | "edit";
}

const ClientBasicDetailsFormValidationSchema = Yup.object({
    // name: Yup.string()
    //     .required('The name field is required'),
    // description: Yup.string()
    //     .nullable(),
    // image: Yup.mixed()
    //     .required('The image field is required'),
    // initial_consultation: Yup.array(Yup.object({
    //         title: Yup.string().required("Initial Consultation Title is required"),
    //         consultation_details: Yup.array(Yup.object({
    //             duration: Yup.number().required("Duration is required"),
    //             price: Yup.number().required("Price is required"),
    //         })),
    //     })
    // ),
    // followup_consultation: Yup.array(Yup.object({
    //         title: Yup.string().required("Followup Consultation Title is required"),
    //         consultation_details: Yup.array(Yup.object({
    //             duration: Yup.number().required("Duration is required"),
    //             price: Yup.number().required("Price is required"),
    //         })),
    //     })
    // ),
});

const ClientBasicDetailsFormInitialValues: IClientBasicDetailsForm = {
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    nick_name: "",
    ssn: "",
    primary_email: "",
    secondary_emails: [{
        email: ""
    }],
    primary_contact_info: {
        phone_type: "",
        phone: ""
    },
    secondary_contact_info: [
        {
            phone_type: "",
            phone: ""
        }
    ],
    emergency_contact_info: {
        primary_emergency: {
            name: "",
            relationship: "",
            language: "",
            primary_contact_info: {
                phone_type: "",
                phone: ""
            },
            secondary_contact_info: [
                {
                    phone_type: "",
                    phone: ""
                }
            ]
        },
        secondary_emergency: {
            name: "",
            relationship: "",
            language: "",
            primary_contact_info: {
                phone_type: "",
                phone: ""
            }
        }
    },
    work_info: {
        occupation: "",
        employment_status: ""
    },
    address: {
        address_line: "",
        city: "",
        country: "",
        zip_code: "",
        state: ""
    }
};


const ClientBasicDetailsFormComponent = (props: ClientBasicDetailsFormComponentProps) => {

    const [clientBasicDetailsFormInitialValues] = useState<IClientBasicDetailsForm>(_.cloneDeep(ClientBasicDetailsFormInitialValues));
    const [isClientBasicDetailsSavingInProgress, setIsClientBasicDetailsSavingInProgress] = useState(false);
    const {
        genderList,
        employmentStatusList,
        phoneTypeList
    } = useSelector((state: IRootReducerState) => state.staticData);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        console.log(values);
        setIsClientBasicDetailsSavingInProgress(true);
        setTimeout(() => {
            setIsClientBasicDetailsSavingInProgress(false);
        }, 2000);
        return;
        CommonService._client.ClientBasicDetailsAddAPICall(values)
            .then((response: IAPIResponseType<IServiceAdd>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientBasicDetailsSavingInProgress(false);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientBasicDetailsSavingInProgress(false);
            })
    }, []);

    return (
        <div className={'client-basic-details-form-component'}>
            <Formik
                validationSchema={ClientBasicDetailsFormValidationSchema}
                initialValues={clientBasicDetailsFormInitialValues}
                onSubmit={onSubmit}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}>
                {({values, touched, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form noValidate={true} className={"t-form"}>
                            <CardComponent title={"Personal Details"} size={"md"}>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'first_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'First Name'}
                                                        placeholder={'First Name'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-5">
                                        <Field name={'last_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Last Name'}
                                                        placeholder={'Last Name'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-2"></div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'nick_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Nickname/Preferred Name'}
                                                        placeholder={'Nickname/Preferred Name'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-5">
                                        <Field name={'dob'}>
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
                                    </div>
                                    <div className="ts-col-md-2"></div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'gender'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={genderList}
                                                        label={'Gender'}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-5">
                                        <Field name={'ssn'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'SSN'}
                                                        placeholder={'SSN'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-2"></div>
                                </div>
                            </CardComponent>
                            <CardComponent title={"Contact Information"} size={"md"}>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'primary_contact_info.phone_type'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={phoneTypeList}
                                                        label={'Phone Type (Primary)'}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-5">
                                        <Field name={'primary_contact_info.phone'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Phone Number (Primary)'}
                                                        placeholder={'Phone Number (Primary)'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-2">
                                        <IconButtonComponent className={"form-helper-icon"}>
                                            <ImageConfig.InfoIcon/>
                                        </IconButtonComponent>
                                    </div>
                                </div>
                                <FieldArray
                                    name="secondary_contact_info"
                                    render={(arrayHelpers) => (
                                        <>
                                            {values?.secondary_contact_info && values?.secondary_contact_info?.map((item: any, index: any) => {
                                                return (
                                                    <div className="ts-row" key={index}>
                                                        <div className="ts-col-md-5">
                                                            <Field name={`secondary_contact_info[${index}].phone_type`}>
                                                                {
                                                                    (field: FieldProps) => (
                                                                        <FormikSelectComponent
                                                                            options={phoneTypeList}
                                                                            label={'Phone Type'}
                                                                            formikField={field}
                                                                            fullWidth={true}
                                                                        />
                                                                    )
                                                                }
                                                            </Field>
                                                        </div>
                                                        <div className="ts-col-md-5">
                                                            <Field name={`secondary_contact_info[${index}].phone`}>
                                                                {
                                                                    (field: FieldProps) => (
                                                                        <FormikInputComponent
                                                                            label={'Phone Number'}
                                                                            placeholder={'Phone Number'}
                                                                            type={"text"}
                                                                            formikField={field}
                                                                            fullWidth={true}
                                                                        />
                                                                    )
                                                                }
                                                            </Field>
                                                        </div>
                                                        <div className="ts-col-md-2">
                                                            <IconButtonComponent className={"form-helper-icon"}
                                                                                 onClick={() => {
                                                                                     arrayHelpers.push({
                                                                                         phone_type: undefined,
                                                                                         phone: undefined
                                                                                     });
                                                                                 }}
                                                            >
                                                                <ImageConfig.AddCircleIcon/>
                                                            </IconButtonComponent>
                                                            {index > 0 &&
                                                                <IconButtonComponent className={"form-helper-icon"}
                                                                                     onClick={() => {
                                                                                         arrayHelpers.remove(index);
                                                                                     }}
                                                                >
                                                                    <ImageConfig.DeleteIcon/>
                                                                </IconButtonComponent>}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </>
                                    )}/>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'primary_email'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Email (Primary)'}
                                                        placeholder={'Email (Primary)'}
                                                        type={"email"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-2">
                                        <IconButtonComponent className={"form-helper-icon"}>
                                            <ImageConfig.InfoIcon/>
                                        </IconButtonComponent>
                                    </div>
                                </div>
                                <FieldArray
                                    name="secondary_emails"
                                    render={(arrayHelpers) => (
                                        <>
                                            {values?.secondary_emails && values?.secondary_emails?.map((item: any, index: any) => {
                                                return (
                                                    <div className="ts-row" key={index}>
                                                        <div className="ts-col-md-5">
                                                            <Field name={`secondary_emails[${index}].email`}>
                                                                {
                                                                    (field: FieldProps) => (
                                                                        <FormikInputComponent
                                                                            label={'Email'}
                                                                            placeholder={'Email'}
                                                                            type={"email"}
                                                                            formikField={field}
                                                                            fullWidth={true}
                                                                        />
                                                                    )
                                                                }
                                                            </Field>
                                                        </div>
                                                        <div className="ts-col-md-2">
                                                            <IconButtonComponent className={"form-helper-icon"}
                                                                                 onClick={() => {
                                                                                     arrayHelpers.push({
                                                                                         email: undefined,
                                                                                     });
                                                                                 }}
                                                            >
                                                                <ImageConfig.AddCircleIcon/>
                                                            </IconButtonComponent>
                                                            {index > 0 &&
                                                                <IconButtonComponent className={"form-helper-icon"}
                                                                                     onClick={() => {
                                                                                         arrayHelpers.remove(index);
                                                                                     }}
                                                                >
                                                                    <ImageConfig.DeleteIcon/>
                                                                </IconButtonComponent>}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </>
                                    )}/>
                            </CardComponent>
                            <CardComponent title={"Address Information"} size={"md"}>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'address.address_line'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Address Line'}
                                                        placeholder={'Address Line'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-5">
                                        <Field name={'address.city'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'City'}
                                                        placeholder={'City'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-2"></div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'address.state'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'State'}
                                                        placeholder={'State'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-5">
                                        <Field name={'address.zip_code'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Zip Code'}
                                                        placeholder={'Zip Code'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-2"></div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'address.country'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Country'}
                                                        placeholder={'Country'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-5">
                                    </div>
                                    <div className="ts-col-md-2"></div>
                                </div>
                            </CardComponent>
                            <CardComponent title={"Work Information"} size={"md"}>
                                <div className="ts-row">
                                    <div className="ts-col-md-5">
                                        <Field name={'work_info.occupation'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Occupation'}
                                                        placeholder={'Occupation'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-5">
                                        <Field name={'work_info.employment_status'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={employmentStatusList}
                                                        label={'Employment Status'}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-md-2"></div>
                                </div>
                            </CardComponent>
                            <div className="ts-row t-form-actions">
                                <div className="ts-col-md-4">&nbsp;</div>
                                <div className="ts-col-md-4">
                                    <ButtonComponent
                                        variant={"outlined"}
                                    >
                                        Cancel
                                    </ButtonComponent>&nbsp;
                                    <ButtonComponent
                                        isLoading={isClientBasicDetailsSavingInProgress}
                                        type={"submit"}
                                    >
                                        {isClientBasicDetailsSavingInProgress ? "Saving" : "Save"}
                                    </ButtonComponent>
                                </div>
                                <div className="ts-col-md-4">&nbsp;</div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default ClientBasicDetailsFormComponent;