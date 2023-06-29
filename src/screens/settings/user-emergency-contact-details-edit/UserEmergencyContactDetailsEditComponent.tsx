import "./UserEmergencyContactDetailsEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {ImageConfig} from "../../../constants";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setUserBasicDetails} from "../../../store/actions/user.action";

interface UserEmergencyContactDetailsEditComponentProps {
    handleNext: () => void
    handlePrevious: () => void
}

const formValidationSchema = Yup.object({
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
});

const formInitialValues: any = {
    show_secondary_emergency_form: false,
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
}

const UserEmergencyContactDetailsEditComponent = (props: UserEmergencyContactDetailsEditComponentProps) => {
    const {handleNext, handlePrevious} = props
    const {
        phoneTypeList,
        languageList,
        relationshipList
    } = useSelector((state: IRootReducerState) => state.staticData);

    const [initialValues, setInitialValues] = useState<any>(_.cloneDeep(formInitialValues));
    const dispatch = useDispatch();

    const {
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);


    useEffect(() => {
        if (userBasicDetails) {
            if (!userBasicDetails.emergency_contact_info?.primary_emergency?.secondary_contact_info ||
                (userBasicDetails.emergency_contact_info?.primary_emergency?.secondary_contact_info && userBasicDetails.emergency_contact_info?.primary_emergency?.secondary_contact_info?.length === 0)) {
                userBasicDetails.emergency_contact_info.primary_emergency.secondary_contact_info = [{
                    phone: "",
                    phone_type: ""
                }]
            }
            if (Object.keys(userBasicDetails.emergency_contact_info.secondary_emergency).length) {
                userBasicDetails.show_secondary_emergency_form = true;
                if (!userBasicDetails.emergency_contact_info?.secondary_emergency?.secondary_contact_info ||
                    (userBasicDetails.emergency_contact_info?.secondary_emergency?.secondary_contact_info && userBasicDetails.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.length === 0)) {
                    userBasicDetails.emergency_contact_info.secondary_emergency.secondary_contact_info = [{
                        phone: "",
                        phone_type: ""
                    }]
                }
            }
            if (userBasicDetails?.secondary_contact_info?.length === 0) {
                userBasicDetails.secondary_contact_info = [{
                    phone: "",
                    phone_type: ""
                }];
            }
            if (userBasicDetails?.secondary_emails?.length === 0) {
                userBasicDetails.secondary_emails = [{
                    email: "",
                }];
            }
            setInitialValues({emergency_contact_info: userBasicDetails.emergency_contact_info})
        }
    }, [userBasicDetails])

    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        setSubmitting(true);
        CommonService._user.userEdit(userBasicDetails._id, values)
            .then((response: IAPIResponseType<any>) => {
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setSubmitting(false);
                dispatch(setUserBasicDetails(response.data));
                if (Object.keys(userBasicDetails.emergency_contact_info.secondary_emergency).length) {
                    const show_secondary_emergency_form = true;
                    setInitialValues({emergency_contact_info: show_secondary_emergency_form})
                }
            }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error, true);
            console.log('errors', error);
            setSubmitting(false);
        })
    }, [userBasicDetails, dispatch]);


    return (
        <div className={'user-emergency-contact-details-edit-component'}>
            <div className={'edit-user-heading'}>EDIT Emergency Contact Information</div>
            <CardComponent title={"Emergency Contact Information"} size={"md"}>

                <Formik
                    validationSchema={formValidationSchema}
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values, touched, errors, setFieldValue, validateForm, isSubmitting, isValid}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true} className={"t-form"}>
                                {/*<FormDebuggerComponent showDebugger={true} values={values} errors={errors}/>*/}

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

                                <div className="t-form-actions">
                                    <ButtonComponent
                                        id={"cancel_btn"}
                                        variant={"outlined"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        disabled={isSubmitting}
                                        onClick={handlePrevious}
                                    >
                                        Previous
                                    </ButtonComponent>
                                    <ButtonComponent
                                        id={"save_btn"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        isLoading={isSubmitting}
                                        disabled={isSubmitting || !isValid || CommonService.isEqual(values, initialValues)}
                                        type={"submit"}
                                    >
                                        {isSubmitting ? "Saving" : "Save"}
                                    </ButtonComponent>
                                    <ButtonComponent
                                        id={"cancel_btn"}
                                        variant={"outlined"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        disabled={isSubmitting}
                                        onClick={handleNext}
                                    >
                                        Next
                                    </ButtonComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </CardComponent>
        </div>
    );

};

export default UserEmergencyContactDetailsEditComponent;