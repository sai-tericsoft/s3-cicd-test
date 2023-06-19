import "./ClientBasicDetailsFormComponent.scss";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {ImageConfig, Misc} from "../../../constants";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {IClientBasicDetails} from "../../../shared/models/client.model";
import {getClientBasicDetails, setClientBasicDetails} from "../../../store/actions/client.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import FormikSwitchComponent from "../../../shared/components/form-controls/formik-switch/FormikSwitchComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {useParams} from "react-router-dom";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";

interface ClientBasicDetailsFormComponentProps {
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientBasicDetails: any) => void;
}

const ClientBasicDetailsFormValidationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    dob: Yup.mixed().required('Date of Birth is required'),
    ssn: Yup.string()
        .required('SSN Number is required')
        .min(9, 'Enter valid SSN Number')
        .max(9, 'SSN cannot be more than 9-digits'),
    gender: Yup.string().required('Gender is required'),
    work_info: Yup.object({
        occupation: Yup.string().required('Occupation is required'),
        employment_status: Yup.string().required('Employment Status is required'),
    }),
    primary_email: Yup.string().required('Email is required'),
    primary_contact_info: Yup.object({
        phone_type: Yup.string().required('Phone Type is required'),
        phone: Yup.string().required('Phone Number is required'),
    }),
    emergency_contact_info: Yup.object({
        primary_emergency: Yup.object({
            name: Yup.string().required('Full Name is required'),
            relationship: Yup.string().required('Relationship is required'),
            language: Yup.string().required('Language is required'),
            primary_contact_info: Yup.object({
                phone_type: Yup.string().required('Phone Type is required'),
                phone: Yup.string().required('Phone Number is required'),
            })
        })
    }),
    address: Yup.object({
        address_line: Yup.string().required('Address Line is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        zip_code: Yup.string().required('ZIP Code is required'),
        state: Yup.string().required('State is required'),
    })
});

const ClientBasicDetailsFormInitialValues: IClientBasicDetails = {
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    nick_name: "",
    ssn: "",
    primary_email: "",
    show_secondary_emergency_form: false,
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
            },
            secondary_contact_info: [
                {
                    phone_type: "",
                    phone: ""
                }
            ]
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
    },
    send_invite: false
};


const ClientBasicDetailsFormComponent = (props: ClientBasicDetailsFormComponentProps) => {

    const {onCancel, mode, onSave} = props;
    const {clientId} = useParams();
    const [clientBasicDetailsFormInitialValues, setClientBasicDetailsFormInitialValues] = useState<IClientBasicDetails>(_.cloneDeep(ClientBasicDetailsFormInitialValues));
    const [isClientBasicDetailsSavingInProgress, setIsClientBasicDetailsSavingInProgress] = useState<boolean>(false);
    const dispatch = useDispatch();

    const {
        clientBasicDetails,
        isClientBasicDetailsLoaded,
        isClientBasicDetailsLoadingFailed,
        isClientBasicDetailsLoading
    } = useSelector((state: IRootReducerState) => state.client);

    const {
        genderList,
        employmentStatusList,
        phoneTypeList,
        languageList,
        relationshipList
    } = useSelector((state: IRootReducerState) => state.staticData);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {
            ...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['language_details', 'phone_type_details', 'relationship_details', 'gender_details', 'employment_status_details']),
            mode
        };
        payload['dob'] = CommonService.convertDateFormat(payload['dob']);
        setIsClientBasicDetailsSavingInProgress(true);
        if (clientId) {
            if (mode === 'add' || mode === 'edit') {
                CommonService._client.ClientBasicDetailsEditAPICall(clientId, payload)
                    .then((response: IAPIResponseType<IClientBasicDetails>) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        setIsClientBasicDetailsSavingInProgress(false);
                        dispatch(setClientBasicDetails(response.data));
                        onSave(response.data);
                    }).catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    console.log('errors', error);
                    setIsClientBasicDetailsSavingInProgress(false);
                })
            }
        }
        // let apiCall;
        // if (mode === "edit" && clientId) {
        //     apiCall = CommonService._client.ClientBasicDetailsEditAPICall(clientId, payload);
        // } else {
        //     apiCall = CommonService._client.ClientBasicDetailsAddAPICall(payload);
        // }
        // apiCall.then((response: IAPIResponseType<IClientBasicDetails>) => {
        //     CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
        //     setIsClientBasicDetailsSavingInProgress(false);
        //     dispatch(setClientBasicDetails(response.data));
        //     onSave(response.data);
        // }).catch((error: any) => {
        //     CommonService.handleErrors(setErrors, error, true);
        //     setIsClientBasicDetailsSavingInProgress(false);
        // })
    }, [onSave, clientId, dispatch, mode]);

    const patchClientBasicDetails = useCallback(() => {
        if (clientBasicDetails) {
            if (!clientBasicDetails.emergency_contact_info?.primary_emergency?.secondary_contact_info ||
                (clientBasicDetails.emergency_contact_info?.primary_emergency?.secondary_contact_info && clientBasicDetails.emergency_contact_info?.primary_emergency?.secondary_contact_info?.length === 0)) {
                clientBasicDetails.emergency_contact_info.primary_emergency.secondary_contact_info = [{
                    phone: "",
                    phone_type: ""
                }]
            }
            if (Object.keys(clientBasicDetails.emergency_contact_info.secondary_emergency).length) {
                clientBasicDetails.show_secondary_emergency_form = true;
                if (!clientBasicDetails.emergency_contact_info?.secondary_emergency?.secondary_contact_info ||
                    (clientBasicDetails.emergency_contact_info?.secondary_emergency?.secondary_contact_info && clientBasicDetails.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.length === 0)) {
                    clientBasicDetails.emergency_contact_info.secondary_emergency.secondary_contact_info = [{
                        phone: "",
                        phone_type: ""
                    }]
                }
            }
            if (clientBasicDetails?.secondary_contact_info?.length === 0) {
                clientBasicDetails.secondary_contact_info = [{
                    phone: "",
                    phone_type: ""
                }];
            }
            if (clientBasicDetails?.secondary_emails?.length === 0) {
                clientBasicDetails.secondary_emails = [{
                    email: "",
                }];
            }
            setClientBasicDetailsFormInitialValues(clientBasicDetails);
        }
    }, [clientBasicDetails])

    useEffect(() => {
        if (clientBasicDetails) {
            patchClientBasicDetails();
        }
    }, [clientBasicDetails, patchClientBasicDetails]);

    useEffect(() => {
        if (clientId) {
            dispatch(getClientBasicDetails(clientId));
        }
    }, [clientId, dispatch]);


    return (
        <div className={'client-basic-details-form-component'}>
            <>
                {
                    isClientBasicDetailsLoading && <div>
                        <LoaderComponent/>
                    </div>
                }
                {
                    isClientBasicDetailsLoadingFailed &&
                    <StatusCardComponent title={"Failed to fetch client Details"}/>
                }
            </>
            {
                ((mode === "edit" && isClientBasicDetailsLoaded && clientBasicDetails) || mode === "add") && <> <Formik
                    validationSchema={ClientBasicDetailsFormValidationSchema}
                    initialValues={clientBasicDetailsFormInitialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values, touched, errors, setFieldValue, validateForm, isValid}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true} className={"t-form"}>
                                {/*<FormDebuggerComponent showDebugger={true} values={values} errors={errors}/>*/}
                                {
                                    mode === "edit" &&
                                    <div
                                        className={"display-flex ts-justify-content-between mrg-bottom-15 align-items-center"}>
                                        <div className={'edit-client-heading'}>Edit Client</div>
                                        <div className={"display-flex align-items-center"}>

                                            <div>Status:</div>
                                            <Field name={'is_active'} className="t-form-control">
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSwitchComponent
                                                            label={values.is_active ? "Active" : "Inactive"}
                                                            required={true}
                                                            formikField={field}
                                                            labelPlacement={"start"}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                }


                                {
                                    mode === 'add' &&
                                    <div className={'add-client-heading'}>Add Client</div>

                                }
                                <CardComponent title={"Personal Details"} size={"md"}>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'first_name'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'First Name'}
                                                            placeholder={'E.g. John'}
                                                            type={"text"}
                                                            required={true}
                                                            titleCase={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                            <Field name={'last_name'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'Last Name'}
                                                            placeholder={'E.g. Doe'}
                                                            type={"text"}
                                                            required={true}
                                                            titleCase={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1"></div>
                                    </div>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'nick_name'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'Nickname/Preferred Name'}
                                                            placeholder={'Enter Nickname/Preferred Name'}
                                                            type={"text"}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                            <Field name={'dob'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikDatePickerComponent
                                                            label={'Date of Birth'}
                                                            placeholder={'MM-DD-YYYY'}
                                                            required={true}
                                                            maxDate={CommonService._staticData.today}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1"></div>
                                    </div>
                                    <div className="ts-row">
                                        <div className="ts-col">
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
                                        <div className="ts-col">
                                            <Field name={'ssn'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'SSN'}
                                                            placeholder={'Enter SSN'}
                                                            type={"text"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1"></div>
                                    </div>
                                </CardComponent>
                                <CardComponent title={"Contact Information"} size={"md"}>
                                    <FormControlLabelComponent size={'sm'} label={'Primary Phone :'}/>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'primary_contact_info.phone_type'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            options={phoneTypeList}
                                                            label={'Phone Type'}
                                                            required={true}
                                                            id={'primary_phone_type'}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                            <Field name={'primary_contact_info.phone'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikPhoneInputComponent
                                                            label={'Phone Number'}
                                                            // placeholder={'Phone Number (Primary)'}
                                                            required={true}
                                                            formikField={field}
                                                            id={'primary_phone_number'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1">
                                            <IconButtonComponent className={"form-helper-icon"}>
                                                <ToolTipComponent
                                                    showArrow={true}
                                                    position={"left"}
                                                    tooltip={"This phone number will be used as the primary number for your account. Please ensure that this number is constantly operational."}>
                                                    <ImageConfig.InfoIcon/>
                                                </ToolTipComponent>
                                            </IconButtonComponent>
                                        </div>
                                    </div>
                                    {/*<HorizontalLineComponent className={'primary-phone-divider'}/>*/}
                                    <FormControlLabelComponent size={'sm'} label={'Alternate Phone :'}/>
                                    <FieldArray
                                        name="secondary_contact_info"
                                        render={(arrayHelpers) => (
                                            <>
                                                {values?.secondary_contact_info && values?.secondary_contact_info?.map((item: any, index: any) => {
                                                    return (
                                                        <div className="ts-row" key={index}>
                                                            <div className="ts-col">
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
                                                            <div className="ts-col">
                                                                <Field name={`secondary_contact_info[${index}].phone`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikPhoneInputComponent
                                                                                label={'Phone Number'}
                                                                                // placeholder={'Phone Number'}
                                                                                formikField={field}
                                                                                fullWidth={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col-1">
                                                                <div className="d-flex">
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
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        )}/>
                                    <HorizontalLineComponent/>
                                    <FormControlLabelComponent size={'sm'} label={'Primary Email :'}/>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'primary_email'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'Email'}
                                                            placeholder={'example@email.com'}
                                                            type={"email"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1">
                                            <IconButtonComponent className={"form-helper-icon"}>
                                                <ToolTipComponent
                                                    showArrow={true}
                                                    position={"right"}
                                                    tooltip={"This email address will be used as the primary email address for your account. Please ensure that this email address is constantly operational."}>
                                                    <ImageConfig.InfoIcon/>
                                                </ToolTipComponent>
                                            </IconButtonComponent>
                                        </div>
                                        <div className="ts-col"/>
                                    </div>
                                    {/*<HorizontalLineComponent className={'primary-phone-divider'}/>*/}
                                    <FormControlLabelComponent size={'sm'} label={'Alternate Email :'}/>
                                    <FieldArray
                                        name="secondary_emails"
                                        render={(arrayHelpers) => (
                                            <>
                                                {values?.secondary_emails && values?.secondary_emails?.map((item: any, index: any) => {
                                                    return (
                                                        <div className="ts-row" key={index}>
                                                            <div className="ts-col">
                                                                <Field name={`secondary_emails[${index}].email`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikInputComponent
                                                                                label={'Email'}
                                                                                placeholder={'example@email.com'}
                                                                                type={"email"}
                                                                                formikField={field}
                                                                                fullWidth={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col-1">
                                                                <div className="d-flex">
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
                                                            <div className="ts-col" />
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        )}/>
                                </CardComponent>
                                <CardComponent title={"Address Information"} size={"md"}>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'address.address_line'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'Address Line'}
                                                            placeholder={'Enter Address Line'}
                                                            type={"text"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                            <Field name={'address.city'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'City'}
                                                            placeholder={'Enter City'}
                                                            type={"text"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1"></div>
                                    </div>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'address.state'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'State'}
                                                            placeholder={'Enter State'}
                                                            type={"text"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                            <Field name={'address.zip_code'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'ZIP Code'}
                                                            placeholder={'Enter ZIP Code'}
                                                            type={"text"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1"></div>
                                    </div>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'address.country'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'Country'}
                                                            placeholder={'Enter Country'}
                                                            type={"text"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                        </div>
                                        <div className="ts-col-1"></div>
                                    </div>
                                </CardComponent>
                                <CardComponent title={"Emergency Contact Information"} size={"md"}>
                                    <FormControlLabelComponent label={"Primary Emergency Contact"} size={'sm'}/>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'emergency_contact_info.primary_emergency.name'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'Full Name'}
                                                            placeholder={'E.g. John Doe'}
                                                            type={"text"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                            <Field name={'emergency_contact_info.primary_emergency.relationship'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            options={relationshipList}
                                                            label={'Relationship'}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1"></div>
                                    </div>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'emergency_contact_info.primary_emergency.language'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            options={languageList}
                                                            label={'Language'}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                        </div>
                                        <div className="ts-col-1"></div>
                                    </div>
                                    <FormControlLabelComponent size={'sm'} label={'Primary Phone :'}/>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field
                                                name={'emergency_contact_info.primary_emergency.primary_contact_info.phone_type'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            options={phoneTypeList}
                                                            label={'Phone Type'}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                            <Field
                                                name={'emergency_contact_info.primary_emergency.primary_contact_info.phone'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikPhoneInputComponent
                                                            label={'Phone Number'}
                                                            // placeholder={'Phone Number'}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1">
                                            <IconButtonComponent className={"form-helper-icon"}>
                                                <ToolTipComponent
                                                    showArrow={true}
                                                    position={"left"}
                                                    tooltip={"This phone number will be used to communicate with your emergency contact in case of emergency. Please ensure that this number is constantly operational."}>
                                                    <ImageConfig.InfoIcon/>
                                                </ToolTipComponent>
                                            </IconButtonComponent>
                                        </div>
                                    </div>
                                    {/*<HorizontalLineComponent className={'primary-phone-divider'}/>*/}
                                    <FormControlLabelComponent size={'sm'} label={'Alternate Phone :'}/>
                                    <FieldArray
                                        name="emergency_contact_info.primary_emergency.secondary_contact_info"
                                        render={(arrayHelpers) => (
                                            <>
                                                {values?.emergency_contact_info?.primary_emergency?.secondary_contact_info && values?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.map((item: any, index: any) => {
                                                    return (
                                                        <div className="ts-row" key={index}>
                                                            <div className="ts-col">
                                                                <Field
                                                                    name={`emergency_contact_info.primary_emergency.secondary_contact_info[${index}].phone_type`}>
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
                                                            <div className="ts-col">
                                                                <Field
                                                                    name={`emergency_contact_info.primary_emergency.secondary_contact_info[${index}].phone`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikPhoneInputComponent
                                                                                label={'Phone Number'}
                                                                                // placeholder={'Phone Number'}
                                                                                formikField={field}
                                                                                fullWidth={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col-1">
                                                                <div className="d-flex">
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
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        )}/>
                                    {/*{*/}
                                    {/*    values.show_secondary_emergency_form && <div className={"h-v-center"}>*/}
                                    {/*        <ButtonComponent variant={"contained"}*/}
                                    {/*                         prefixIcon={<ImageConfig.AddIcon/>}*/}
                                    {/*                         onClick={() => {*/}
                                    {/*                             setFieldValue('show_secondary_emergency_form', true);*/}
                                    {/*                         }}*/}
                                    {/*        >*/}
                                    {/*            Add Secondary Contact*/}
                                    {/*        </ButtonComponent>*/}
                                    {/*    </div>*/}
                                    {/*}*/}

                                    {!values.show_secondary_emergency_form &&
                                        <div className={'display-flex justify-content-center flex-1'}>
                                            <ButtonComponent
                                                className={'add-another-contact-cta'}
                                                onClick={() => {
                                                    setFieldValue('show_secondary_emergency_form', true)
                                                }}
                                                prefixIcon={<ImageConfig.AddIcon/>}>
                                                Add Another
                                                Contact</ButtonComponent>
                                        </div>}
                                    <>
                                        {values.show_secondary_emergency_form &&
                                            <>
                                                <HorizontalLineComponent className={'secondary-emergency-divider'}/>
                                                <div className={'d-flex ts-align-items-center mrg-bottom-24'}>
                                                    <FormControlLabelComponent label={"Secondary Emergency Contact"}/>
                                                    <ButtonComponent className={'remove-contact-button'}
                                                                     prefixIcon={<ImageConfig.CloseIcon/>}
                                                                     variant={'contained'} color={'error'}
                                                                     onClick={() => {
                                                                         setFieldValue('show_secondary_emergency_form', false)
                                                                     }}
                                                    >Remove
                                                        Contact</ButtonComponent>
                                                </div>
                                                <div className="ts-row">
                                                    <div className="ts-col">
                                                        <Field name={'emergency_contact_info.secondary_emergency.name'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikInputComponent
                                                                        label={'Full Name'}
                                                                        placeholder={'E.g John Doe'}
                                                                        type={"text"}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                    <div className="ts-col">
                                                        <Field
                                                            name={'emergency_contact_info.secondary_emergency.relationship'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikSelectComponent
                                                                        options={relationshipList}
                                                                        label={'Relationship'}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                    <div className="ts-col-1"></div>
                                                </div>
                                                <div className="ts-row">
                                                    <div className="ts-col">
                                                        <Field name={'emergency_contact_info.secondary_emergency.language'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikSelectComponent
                                                                        options={languageList}
                                                                        label={'Language'}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                    <div className="ts-col">
                                                    </div>
                                                    <div className="ts-col-1"></div>
                                                </div>
                                                <div className="ts-row">
                                                    <div className="ts-col">
                                                        <Field
                                                            name={'emergency_contact_info.secondary_emergency.primary_contact_info.phone_type'}>
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
                                                    <div className="ts-col">
                                                        <Field
                                                            name={'emergency_contact_info.secondary_emergency.primary_contact_info.phone'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikPhoneInputComponent
                                                                        label={'Phone Number'}
                                                                        // placeholder={'Phone Number (Primary)'}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                    <div className="ts-col-1">
                                                        <IconButtonComponent className={"form-helper-icon"}>
                                                            <ToolTipComponent
                                                                showArrow={true}
                                                                position={"left"}
                                                                tooltip={"This phone number will be used to communicate with your emergency contact in case of emergency. Please ensure that this number is constantly operational."}>
                                                                <ImageConfig.InfoIcon/>
                                                            </ToolTipComponent>
                                                        </IconButtonComponent>
                                                    </div>
                                                </div>
                                                <FieldArray
                                                    name="emergency_contact_info.secondary_emergency.secondary_contact_info"
                                                    render={(arrayHelpers) => (
                                                        <>
                                                            {values?.emergency_contact_info?.secondary_emergency?.secondary_contact_info && values?.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.map((item: any, index: any) => {
                                                                return (
                                                                    <div className="ts-row" key={index}>
                                                                        <div className="ts-col">
                                                                            <Field
                                                                                name={`emergency_contact_info.secondary_emergency.secondary_contact_info[${index}].phone_type`}>
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
                                                                        <div className="ts-col">
                                                                            <Field
                                                                                name={`emergency_contact_info.secondary_emergency.secondary_contact_info[${index}].phone`}>
                                                                                {
                                                                                    (field: FieldProps) => (
                                                                                        <FormikPhoneInputComponent
                                                                                            label={'Phone Number'}
                                                                                            // placeholder={'Phone Number'}
                                                                                            formikField={field}
                                                                                            fullWidth={true}
                                                                                        />
                                                                                    )
                                                                                }
                                                                            </Field>
                                                                        </div>
                                                                        <div className="ts-col-1">
                                                                            <div className="d-flex">
                                                                                <IconButtonComponent
                                                                                    className={"form-helper-icon"}
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
                                                                                    <IconButtonComponent
                                                                                        className={"form-helper-icon"}
                                                                                        onClick={() => {
                                                                                            arrayHelpers.remove(index);
                                                                                        }}
                                                                                    >
                                                                                        <ImageConfig.DeleteIcon/>
                                                                                    </IconButtonComponent>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </>
                                                    )}/>
                                            </>
                                        }
                                    </>
                                </CardComponent>
                                <CardComponent title={"Work Information"} size={"md"}>
                                    <div className="ts-row">
                                        <div className="ts-col">
                                            <Field name={'work_info.occupation'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'Occupation'}
                                                            placeholder={'Enter Occupation'}
                                                            type={"text"}
                                                            required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
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
                                        <div className="ts-col-1"></div>
                                    </div>
                                </CardComponent>
                                <div className="t-form-actions">
                                    <LinkComponent route={CommonService._routeConfig.ClientList()}>
                                        <ButtonComponent
                                            id={"cancel_btn"}
                                            variant={"outlined"}
                                            size={'large'}
                                            disabled={isClientBasicDetailsSavingInProgress}
                                            onClick={onCancel}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>
                                    &nbsp;
                                    <ButtonComponent
                                        id={"save_btn"}
                                        size={'large'}
                                        isLoading={isClientBasicDetailsSavingInProgress}
                                        disabled={isClientBasicDetailsSavingInProgress || !isValid}
                                        type={"submit"}
                                    >
                                        {isClientBasicDetailsSavingInProgress ? "Saving" : "Save"}
                                    </ButtonComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
                </>
            }
        </div>
    );

};

export default ClientBasicDetailsFormComponent;
