import "./UserBasicDetailsEditComponent.scss";
import * as Yup from "yup";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import UserPersonalDetailsEditComponent from "../user-personal-details-edit/UserPersonalDetailsEditComponent";
import UserContactInformationEditComponent from "../user-contact-information-edit/UserContactInformationEditComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import UserAddressDetailsEditComponent from "../user-address-details-edit/UserAddressDetailsEditComponent";
import UserEmergencyContactDetailsEditComponent
    from "../user-emergency-contact-details-edit/UserEmergencyContactDetailsEditComponent";
import UserEducationDetailsEditComponent from "../user-education-details-edit/UserEducationDetailsEditComponent";
import UserProfessionalDetailsEditComponent
    from "../user-professional-details-edit/UserProfessionalDetailsEditComponent";
import UserAboutEditComponent from "../user-about-edit/UserAboutEditComponent";

interface UserBasicDetailsEditComponentProps {

}

const UserBasicDetailsFormValidationSchema = Yup.object({
    personal_details: Yup.object({
        first_name: Yup.string().required('First Name is required'),
        last_name: Yup.string().required('Last Name is required'),
        dob: Yup.mixed().required('Date of Birth is required'),
        ssn: Yup.string()
            .required('SSN Number is required')
            .min(9, 'Enter valid SSN Number')
            .max(9, 'SSN cannot be more than 9-digits'),
        gender: Yup.string().required('Gender is required'),
        npi_number: Yup.string().required('NPI number is required'),
        assigned_facilities: Yup.array().required('Gender is required'),
    }),

    contact_information: Yup.object({
        primary_email: Yup.string().required('Email is required'),
        primary_contact_info: Yup.object({
            phone_type: Yup.string().required('Phone Type is required'),
            phone: Yup.string().required('Phone Number is required'),
        }),
    }),

    address: Yup.object({
        address_line: Yup.string().required('Address Line is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        zip_code: Yup.string().required('ZIP Code is required'),
        state: Yup.string().required('State is required'),
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

});

const UserBasicDetailsFormInitialValues: any = {
    personal_details: {
        first_name: "",
        last_name: "",
        gender: "",
        dob: "",
        nick_name: "",
        ssn: "",
        npi_number: "",
        role: "",
        assigned_facilities: []
    },
    about: {
        summary: "",
        specialities: [],
        languages: {
            name: "",
            read: "",
            write: "",
            speak: ""
        }
    },
    contact_information: {
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
    },
    address: {
        address_line: "",
        city: "",
        country: "",
        zip_code: "",
        state: ""
    },
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
    professional_details: [
        {
            company_name: "",
            company_location: "",
            position: "",
            start_date: "",
            end_date: ""
        }
    ],
    education_details: [
        {
            institution_name: "",
            institution_location: "",
            degree: "",
            start_date: "",
            end_date: ""
        }
    ],
};

const UserBasicDetailsEditComponent = (props: UserBasicDetailsEditComponentProps) => {
    const {userId} = useParams();
    const dispatch = useDispatch();
    const [clientBasicDetailsFormInitialValues, setUserBasicDetailsFormInitialValues] = useState<any>(_.cloneDeep(UserBasicDetailsFormInitialValues));
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<string>('');

    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    const patchUserBasicDetails = useCallback(() => {
        if (userBasicDetails) {
            userBasicDetails.personal_details = {
                first_name: userBasicDetails?.first_name,
                last_name: userBasicDetails?.last_name,
                gender: userBasicDetails?.gender,
                dob: userBasicDetails?.dob,
                nick_name: userBasicDetails?.nick_name,
                ssn: userBasicDetails?.ssn,
                npi_number: userBasicDetails?.npi_number,
                role: userBasicDetails?.role,
                assigned_facilities: userBasicDetails?.assigned_facilities,
            }

            userBasicDetails.contact_information = {
                primary_email: userBasicDetails?.primary_email,
                secondary_emails: userBasicDetails?.secondary_emails || [],
                primary_contact_info: userBasicDetails?.primary_contact_info,
                secondary_contact_info: userBasicDetails?.secondary_contact_info || [],
            }

            userBasicDetails.about = {
                summary: userBasicDetails?.summary,
                specialities: userBasicDetails?.specialities || [],
                languages: userBasicDetails?.languages || [],
            }

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
            setUserBasicDetailsFormInitialValues(userBasicDetails);
        }
    }, [userBasicDetails])

    useEffect(() => {
        if (userBasicDetails) {
            patchUserBasicDetails();
        }
    }, [userBasicDetails, patchUserBasicDetails]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        console.log(values);
    }, []);

    // useEffect(() => {
    //     dispatch(setCurrentNavParams('Edit User', null, () => {
    //         if (userId) {
    //             navigate(CommonService._client.NavigateToClientDetails(userId, "basicDetails"));
    //         }
    //     }));
    // }, [dispatch, currentStep, userId, navigate]);

    useEffect(() => {
        let currentStep: any = searchParams.get("currentStep");
        setCurrentStep(currentStep);
    }, [searchParams]);


    return (
        <div className={'user-basic-details-edit-component'}>
            <>
                {
                    isUserBasicDetailsLoading && <div>
                        <LoaderComponent/>
                    </div>
                }
                {
                    isUserBasicDetailsLoadingFailed &&
                    <StatusCardComponent title={"Failed to fetch client Details"}/>
                }
            </>
            {isUserBasicDetailsLoaded &&
            <> <Formik
                validationSchema={UserBasicDetailsFormValidationSchema}
                initialValues={clientBasicDetailsFormInitialValues}
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
                            <FormDebuggerComponent showDebugger={true} values={values} errors={errors}/>
                            {currentStep === 'basic_details' &&
                            <>
                                <UserPersonalDetailsEditComponent/>
                            </>
                            }

                            {currentStep === 'about' &&
                            <>
                                <UserAboutEditComponent values={values}/>
                            </>
                            }

                            {currentStep === 'contact_information' && <>
                                <UserContactInformationEditComponent contactInformation={values.contact_information}/>
                            </>
                            }

                            {
                                currentStep === 'address' && <>
                                    <UserAddressDetailsEditComponent/>
                                </>
                            }

                            {
                                currentStep === 'emergency_contact_info' && <>
                                    <UserEmergencyContactDetailsEditComponent values={values}
                                                                              setFieldValue={setFieldValue}/>
                                </>
                            }
                            {
                                currentStep === 'professional_details' && <>
                                    <UserProfessionalDetailsEditComponent values={values}/>
                                </>
                            }
                            {
                                currentStep === 'education_details' && <>
                                    <UserEducationDetailsEditComponent values={values}/>
                                </>
                            }

                            <div className="t-form-actions">
                                {currentStep !== 'personal_details' && <ButtonComponent
                                    id={"save_btn"}
                                    size={'large'}
                                    className={'submit-cta'}
                                    variant={"outlined"}
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                    type={"button"}
                                >
                                    Previous
                                </ButtonComponent>}
                                <ButtonComponent
                                    id={"save_btn"}
                                    size={'large'}
                                    className={'submit-cta'}
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting || !!errors[currentStep] || CommonService.isEqual(values, clientBasicDetailsFormInitialValues.currentStep)}
                                    type={"submit"}
                                >
                                    {isSubmitting ? "Saving" : "Save"}
                                </ButtonComponent>
                                {
                                    currentStep !== 'education_details' && <ButtonComponent
                                        id={"cancel_btn"}
                                        variant={"outlined"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            console.log('cancel')
                                        }}
                                    >
                                        Next
                                    </ButtonComponent>
                                }
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

export default UserBasicDetailsEditComponent;