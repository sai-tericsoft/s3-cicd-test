import "./UserBasicDetailsEditComponent.scss";
import * as Yup from "yup";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import UserAboutEditComponent from "../user-about-edit/UserAboutEditComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setUserBasicDetails} from "../../../store/actions/user.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import UserPersonalDetailsEditComponent from "../user-personal-details-edit/UserPersonalDetailsEditComponent";
import UserAddressDetailsEditComponent from "../user-address-details-edit/UserAddressDetailsEditComponent";
import UserContactInformationEditComponent from "../user-contact-information-edit/UserContactInformationEditComponent";

interface UserBasicDetailsEditComponentProps {

}

const UserBasicDetailsEditComponent = (props: UserBasicDetailsEditComponentProps) => {
    // const {userId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<string>('');
    const location: any = useLocation();
    const path = location.pathname;

    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        console.log(values);
        let payload = {
            ...values,
            ...values.personal_details,
            ...values.about,
            ...values.contact_information,
        };
        payload['dob'] = CommonService.convertDateFormat(payload['dob']);

        if (payload?.assigned_facilities?.length) {
            payload.assigned_facilities = payload.assigned_facilities.map((item: any) => item._id,);
        }

        if (payload.education_details.length) {
            payload.education_details = payload.education_details.map((item: any) => ({
                ...item,
                start_date: CommonService.convertDateFormat(item?.start_date),
                end_date: CommonService.convertDateFormat(item?.end_date),
            }));
        }

        if (payload.professional_details.length) {
            payload.professional_details = payload.professional_details.map((item: any) => ({
                ...item,
                start_date: CommonService.convertDateFormat(item?.start_date),
                end_date: CommonService.convertDateFormat(item?.end_date),
            }));
        }

        payload = {
            ...CommonService.removeKeysFromJSON(_.cloneDeep(payload), ['language_details', 'phone_type_details', 'relationship_details', 'gender_details', 'employment_status_details']),
        }

        delete payload.about;
        delete payload.personal_details;
        delete payload.contact_information;
        delete payload.assigned_facility_details;
        console.log(payload);
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
    }, [userBasicDetails]);

    useEffect(() => {
        dispatch(setCurrentNavParams('Edit User', null, () => {
            if (path.includes('settings')) {
                navigate(CommonService._routeConfig.PersonalDetails());
            } else {
                navigate(CommonService._routeConfig.UserPersonalDetails() + '?userId=' + userBasicDetails?._id)
            }
        }));
    }, [dispatch, userBasicDetails, navigate]);

    useEffect(() => {
        let currentStep: any = searchParams.get("currentStep");
        setCurrentStep(currentStep);
    }, [searchParams]);

    const handleNext = useCallback(() => {
        let nextStep = currentStep;
        switch (currentStep) {
            case "personal_details": {
                nextStep = 'about';
                break;
            }
            case "about": {
                nextStep = 'contact_information';
                break;
            }
            case "contact_information": {
                nextStep = 'address';
                break;
            }
            case "address": {
                nextStep = 'emergency_contact_info';
                break;
            }
            case "emergency_contact_info": {
                nextStep = 'professional_details';
                break;
            }
            case "professional_details": {
                nextStep = 'education_details';
                break;
            }
            default: {
                // navigate(CommonService._routeConfig.NavigateToClientDetails(clientId, "basicDetails"));
                return;
            }
        }

        setCurrentStep(nextStep);
        searchParams.set("currentStep", nextStep);
        setSearchParams(searchParams);

    }, [currentStep, searchParams, setSearchParams])

    const handlePrevious = useCallback(() => {
            let nextStep = currentStep;
            switch (currentStep) {
                case "about": {
                    nextStep = 'personal_details';
                    break;
                }
                case "contact_information": {
                    nextStep = 'about';
                    break;
                }
                case "address": {
                    nextStep = 'contact_information';
                    break;
                }
                case "emergency_contact_info": {
                    nextStep = 'address';
                    break;
                }
                case "professional_details": {
                    nextStep = 'emergency_contact_info';
                    break;
                }
                case "education_details": {
                    nextStep = 'professional_details';
                    break;
                }
                default: {
                    // navigate(CommonService._routeConfig.NavigateToClientDetails(clientId, "basicDetails"));
                    return;
                }
            }
            setCurrentStep(nextStep);
            searchParams.set("currentStep", nextStep);
            setSearchParams(searchParams);
        },
        [currentStep, searchParams, setSearchParams])

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

            <>
                {currentStep === 'personal_details' &&
                <>
                    <UserPersonalDetailsEditComponent handleNext={handleNext}/>
                </>
                }

                {currentStep === 'about' &&
                <>
                    <UserAboutEditComponent handleNext={handleNext}/>
                </>
                }


                {currentStep === 'contact_information' && <>
                    <UserContactInformationEditComponent
                        handleNext={handleNext}/>
                </>
                }

                {
                    currentStep === 'address' && <>
                        <UserAddressDetailsEditComponent handleNext={handleNext}/>
                    </>
                }

                {/*{*/}
                {/*    currentStep === 'emergency_contact_info' && <>*/}
                {/*        <UserEmergencyContactDetailsEditComponent values={values}*/}
                {/*                                                  setFieldValue={setFieldValue}/>*/}
                {/*    </>*/}
                {/*}*/}
                {/*{*/}
                {/*    currentStep === 'professional_details' && <>*/}
                {/*        <UserProfessionalDetailsEditComponent values={values}/>*/}
                {/*    </>*/}
                {/*}*/}
                {/*{*/}
                {/*    currentStep === 'education_details' && <>*/}
                {/*        <UserEducationDetailsEditComponent values={values}/>*/}
                {/*    </>*/}
                {/*}*/}


                {/*<> <Formik*/}
                {/*    validationSchema={UserBasicDetailsFormValidationSchema}*/}
                {/*    initialValues={clientBasicDetailsFormInitialValues}*/}
                {/*    onSubmit={onSubmit}*/}
                {/*    validateOnChange={false}*/}
                {/*    validateOnBlur={true}*/}
                {/*    enableReinitialize={true}*/}
                {/*    validateOnMount={true}>*/}
                {/*    {({values, touched, errors, setFieldValue, validateForm, isSubmitting, isValid}) => {*/}
                {/*        // eslint-disable-next-line react-hooks/rules-of-hooks*/}
                {/*        useEffect(() => {*/}
                {/*            validateForm();*/}
                {/*        }, [validateForm, values]);*/}
                {/*        return (*/}
                {/*            <Form noValidate={true} className={"t-form"}>*/}
                {/*                <FormDebuggerComponent showDebugger={true} values={values} errors={errors}/>*/}

                {/*                {currentStep === 'about' &&*/}
                {/*                <>*/}
                {/*                    <UserAboutEditComponent values={values}/>*/}
                {/*                </>*/}
                {/*                }*/}

                {/*                {currentStep === 'contact_information' && <>*/}
                {/*                    <UserContactInformationEditComponent*/}
                {/*                        contactInformation={values.contact_information}/>*/}
                {/*                </>*/}
                {/*                }*/}

                {/*                {*/}
                {/*                    currentStep === 'address' && <>*/}
                {/*                        <UserAddressDetailsEditComponent/>*/}
                {/*                    </>*/}
                {/*                }*/}

                {/*                {*/}
                {/*                    currentStep === 'emergency_contact_info' && <>*/}
                {/*                        <UserEmergencyContactDetailsEditComponent values={values}*/}
                {/*                                                                  setFieldValue={setFieldValue}/>*/}
                {/*                    </>*/}
                {/*                }*/}
                {/*                {*/}
                {/*                    currentStep === 'professional_details' && <>*/}
                {/*                        <UserProfessionalDetailsEditComponent values={values}/>*/}
                {/*                    </>*/}
                {/*                }*/}
                {/*                {*/}
                {/*                    currentStep === 'education_details' && <>*/}
                {/*                        <UserEducationDetailsEditComponent values={values}/>*/}
                {/*                    </>*/}
                {/*                }*/}

                {/*                <div className="t-form-actions">*/}
                {/*                    {currentStep !== 'personal_details' && <ButtonComponent*/}
                {/*                        id={"save_btn"}*/}
                {/*                        size={'large'}*/}
                {/*                        className={'submit-cta'}*/}
                {/*                        variant={"outlined"}*/}
                {/*                        isLoading={isSubmitting}*/}
                {/*                        disabled={isSubmitting}*/}
                {/*                        type={"button"}*/}
                {/*                        onClick={handlePrevious}*/}
                {/*                    >*/}
                {/*                        Previous*/}
                {/*                    </ButtonComponent>}*/}
                {/*                    <ButtonComponent*/}
                {/*                        id={"save_btn"}*/}
                {/*                        size={'large'}*/}
                {/*                        className={'submit-cta'}*/}
                {/*                        isLoading={isSubmitting}*/}
                {/*                        disabled={isSubmitting || !!errors[currentStep] || CommonService.isEqual(values, clientBasicDetailsFormInitialValues[currentStep])}*/}
                {/*                        type={"submit"}*/}
                {/*                    >*/}
                {/*                        {isSubmitting ? "Saving" : "Save"}*/}
                {/*                    </ButtonComponent>*/}
                {/*                    {*/}
                {/*                        currentStep !== 'education_details' && <ButtonComponent*/}
                {/*                            id={"cancel_btn"}*/}
                {/*                            variant={"outlined"}*/}
                {/*                            size={'large'}*/}
                {/*                            className={'submit-cta'}*/}
                {/*                            disabled={isSubmitting}*/}
                {/*                            onClick={handleNext}*/}
                {/*                        >*/}
                {/*                            Next*/}
                {/*                        </ButtonComponent>*/}
                {/*                    }*/}
                {/*                </div>*/}
                {/*            </Form>*/}
                {/*        )*/}
                {/*    }}*/}
                {/*</Formik>*/}
                {/*</>*/}
            </>
            }
        </div>
    );

};

export default UserBasicDetailsEditComponent;