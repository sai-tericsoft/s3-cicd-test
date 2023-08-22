import "./UserBasicDetailsEditComponent.scss";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import UserAboutEditComponent from "../user-about-edit/UserAboutEditComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import UserPersonalDetailsEditComponent from "../user-personal-details-edit/UserPersonalDetailsEditComponent";
import UserAddressDetailsEditComponent from "../user-address-details-edit/UserAddressDetailsEditComponent";
import UserContactInformationEditComponent from "../user-contact-information-edit/UserContactInformationEditComponent";
import UserEducationDetailsEditComponent from "../user-education-details-edit/UserEducationDetailsEditComponent";
import UserProfessionalDetailsEditComponent
    from "../user-professional-details-edit/UserProfessionalDetailsEditComponent";
import UserEmergencyContactDetailsEditComponent
    from "../user-emergency-contact-details-edit/UserEmergencyContactDetailsEditComponent";
import {getUserBasicDetails} from "../../../store/actions/user.action";

interface UserBasicDetailsEditComponentProps {

}

const UserBasicDetailsEditComponent = (props: UserBasicDetailsEditComponentProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<string>('');
    const location: any = useLocation();
    const path = location.pathname;
    const {userId} = useParams()
    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (userId) {
            dispatch(getUserBasicDetails(userId));
        }
    }, [dispatch, userId])

    useEffect(() => {
        dispatch(setCurrentNavParams('Edit User', null, () => {
            if (path.includes('settings')) {
                navigate(CommonService._routeConfig.PersonalDetails());
            } else {
                navigate(CommonService._routeConfig.UserPersonalDetails(userBasicDetails?._id))
            }
        }));
    }, [dispatch, userBasicDetails, navigate, path]);

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
                    <UserAboutEditComponent handleNext={handleNext} handlePrevious={handlePrevious}/>
                </>
                }


                {currentStep === 'contact_information' && <>
                    <UserContactInformationEditComponent
                        handlePrevious={handlePrevious}
                        handleNext={handleNext}/>
                </>
                }

                {
                    currentStep === 'address' && <>
                        <UserAddressDetailsEditComponent handleNext={handleNext} handlePrevious={handlePrevious}/>
                    </>
                }

                {
                    currentStep === 'emergency_contact_info' && <>
                        <UserEmergencyContactDetailsEditComponent handlePrevious={handlePrevious}
                                                                  handleNext={handleNext}
                        />
                    </>
                }
                {
                    currentStep === 'professional_details' && <>
                        <UserProfessionalDetailsEditComponent handlePrevious={handlePrevious} handleNext={handleNext}/>
                    </>
                }
                {
                    currentStep === 'education_details' && <>
                        <UserEducationDetailsEditComponent handlePrevious={handlePrevious}/>
                    </>
                }
            </>
            }
        </div>
    );

};

export default UserBasicDetailsEditComponent;