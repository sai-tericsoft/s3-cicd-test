import "./UserContactInformationEditComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {ImageConfig} from "../../../constants";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import React, {useCallback, useEffect, useState} from "react";
import * as Yup from "yup";
import _ from "lodash";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setUserBasicDetails} from "../../../store/actions/user.action";

interface UserContactInformationEditComponentProps {
    handleNext: () => void
    handlePrevious: () => void
}

const formValidationSchema = Yup.object({
    primary_email: Yup.string().required('Email is required').email('Invalid email'),
    primary_contact_info: Yup.object({
        phone_type: Yup.string().required('Phone Type is required'),
        phone: Yup.string().required('Phone Number is required'),
    }),
    secondary_emails: Yup.array(Yup.object({
            email: Yup.string().email('Invalid email')
        })
    ),
});

const formInitialValues: any = {
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
}


const UserContactInformationEditComponent = (props: UserContactInformationEditComponentProps) => {
    const [initialValues, setInitialValues] = useState<any>(_.cloneDeep(formInitialValues));
    const {handleNext, handlePrevious} = props
    const dispatch = useDispatch();

    const {
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    const {
        phoneTypeList,
    } = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        const contact_information = {
            primary_email: userBasicDetails?.primary_email,
            secondary_emails: userBasicDetails.secondary_emails.length ? userBasicDetails?.secondary_emails : formInitialValues.secondary_emails,
            primary_contact_info: userBasicDetails?.primary_contact_info,
            secondary_contact_info: userBasicDetails?.secondary_contact_info.length ? userBasicDetails?.secondary_contact_info : formInitialValues.secondary_contact_info,
        }
        setInitialValues(contact_information)
    }, [userBasicDetails]);

    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        console.log(values);
        let payload = {
            ...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['language_details']),
        };

        payload['dob'] = CommonService.convertDateFormat(payload['dob']);

        if (payload?.assigned_facilities?.length) {
            payload.assigned_facilities = payload.assigned_facilities.map((item: any) => item._id,);
        }

        setSubmitting(true);
        CommonService._user.userEdit(userBasicDetails._id, payload)
            .then((response: IAPIResponseType<any>) => {
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setSubmitting(false);
                dispatch(setUserBasicDetails(response.data));
            }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error, true);
            console.log('errors', error);
            setSubmitting(false);
        })
    }, [userBasicDetails, dispatch]);

    return (
        <div className={'user-contact-information-edit-component'}>
            <div className={'edit-user-heading'}>Edit Contact Information</div>
            <CardComponent title={"Contact Information"} size={"md"}>

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
                                                            <Field
                                                                name={`secondary_contact_info[${index}].phone_type`}>
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
                                                                name={`secondary_contact_info[${index}].phone`}>
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
                                                            <Field
                                                                name={`secondary_emails[${index}].email`}>
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
                                                        <div className="ts-col"/>
                                                    </div>
                                                )
                                            })}
                                        </>
                                    )}/>

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

export default UserContactInformationEditComponent;