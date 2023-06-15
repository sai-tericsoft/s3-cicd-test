import "./ClientEditScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import ClientPersonalHabitsFormComponent from "../client-personal-habits-form/ClientPersonalHabitsFormComponent";
import {IClientFormSteps} from "../../../shared/models/client.model";
import ClientAllergiesFormComponent from "../client-allergies-form/ClientAllergiesFormComponent";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import ClientMedicalHistoryFormComponent from "../client-medical-history-form/ClientMedicalHistoryFormComponent";
import ClientMedicalSupplementsFormComponent
    from "../client-medical-supplements-form/ClientMedicalSupplementsFormComponent";
import ClientSurgicalHistoryFormComponent from "../client-surgical-history-form/ClientSurgicalHistoryFormComponent";
import ClientMedicalFemaleOnlyFormComponent
    from "../client-medical-female-only-form/ClientMedicalFemaleOnlyFormComponent";
import ClientMedicalProviderInformationFormComponent
    from "../client-medical-provider-information-form/ClientMedicalProviderInformationFormComponent";
import ClientMusculoskeletalHistoryFormComponent
    from "../client-musculoskeletal-history-form/ClientMusculoskeletalHistoryFormComponent";
import ClientAccountDetailsFormComponent from "../client-account-details-form/ClientAccountDetailsFormComponent";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalDetails} from "../../../store/actions/client.action";

interface ClientEditScreenProps {

}

const ClientAddSteps: IClientFormSteps[] = ["basicDetails", "personalHabits", "allergies", "medicalSupplements", "surgicalHistory", "medicalFemaleOnly", "medicalProvider", "musculoskeletalHistory", "medicalHistory", "accountDetails"];

const ClientEditScreen = (props: ClientEditScreenProps) => {

    const mode = "edit";
    const navigate = useNavigate();
    const {clientId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<IClientFormSteps>(ClientAddSteps[0]);
    const dispatch = useDispatch();
    const {
        clientBasicDetails,
    } = useSelector((state: IRootReducerState) => state.client);


    const handleClientDetailsSave = useCallback((data: any) => {
        if (clientId) {
            switch (currentStep) {
                case "basicDetails":
                case "accountDetails": {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, currentStep));
                    break;
                }
                // case "personalHabits":
                // case "allergies":
                // case "medicalHistory":
                // case "medicalSupplements":
                // case "medicalFemaleOnly":
                // case "surgicalHistory":
                // case "musculoskeletalHistory":
                case "musculoskeletalHistory": {
                    goBackToMedicalHistory();
                    break;
                }
                default: {
                    // navigate(CommonService._routeConfig.ClientList());
                }
            }
        }
    }, [currentStep, clientId, navigate]);

    const handleClientDetailsNext = useCallback(() => {
        let nextStep = currentStep;
        if (clientId) {
            switch (currentStep) {
                case "personalHabits": {
                    nextStep = 'allergies';
                    break;
                }
                case "allergies": {
                    nextStep = 'medicalSupplements';
                    break;
                }
                case "medicalSupplements": {
                    nextStep = 'medicalProvider';
                    break;
                }
                case "medicalProvider": {
                    nextStep = 'medicalHistory';
                    break;
                }
                case "medicalHistory": {
                    if (clientBasicDetails?.gender === "female") {
                        nextStep = 'medicalFemaleOnly';
                    } else {
                        nextStep = 'surgicalHistory';
                    }
                    break;
                }
                case "medicalFemaleOnly": {
                    nextStep = 'surgicalHistory';
                    break;
                }
                case "surgicalHistory": {
                    nextStep = 'musculoskeletalHistory';
                    break;
                }
                case "musculoskeletalHistory": {
                    goBackToMedicalHistory();
                    break;
                }

                case "accountDetails": {
                    navigate(CommonService._routeConfig.ClientList());
                    return;
                }
                default: {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, "basicDetails"));
                    return;
                }
            }
        }
        setCurrentStep(nextStep);
        searchParams.set("currentStep", nextStep);
        setSearchParams(searchParams);
        if (clientId) {
            dispatch(getClientMedicalDetails(clientId));
        }
    }, [currentStep, searchParams, setSearchParams, clientId, navigate, clientBasicDetails, dispatch]);

    const goBackToMedicalHistory = useCallback(() => {
        if (clientId) {
            navigate(CommonService._client.NavigateToClientDetails(clientId, "medicalHistoryQuestionnaire"));
        }
    }, [clientId, navigate]);

    const handleClientDetailsCancel = useCallback(() => {
        let prevStep = currentStep;
        if (clientId) {
            switch (currentStep) {
                case "accountDetails":
                case "basicDetails": {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, currentStep));
                    break;
                }
                case "personalHabits": {
                    goBackToMedicalHistory();
                    break;
                }
                case "allergies": {
                    prevStep = 'personalHabits';
                    break;
                }
                case "medicalSupplements": {
                    prevStep = 'allergies';
                    break;
                }
                case "medicalProvider": {
                    prevStep = 'medicalSupplements';
                    break;
                }
                case "medicalHistory": {
                    prevStep = 'medicalProvider';
                    break;
                }
                case "medicalFemaleOnly": {
                    prevStep = 'medicalHistory';
                    break;
                }
                case "surgicalHistory": {
                    prevStep = 'medicalHistory';
                    break;
                }
                case "musculoskeletalHistory": {
                    prevStep = 'surgicalHistory';
                    break;
                }

                default: {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, "basicDetails"));
                }
            }
            setCurrentStep(prevStep);
            searchParams.set("currentStep", prevStep);
            setSearchParams(searchParams);
        }
    }, [navigate, clientId, currentStep, setCurrentStep, setSearchParams, searchParams]);

    useEffect(() => {
        let currentStep: any = searchParams.get("currentStep");
        if (currentStep) {
            if (!ClientAddSteps.includes(currentStep)) {
                currentStep = "basicDetails";
            }
        } else {
            currentStep = "basicDetails";
        }
        setCurrentStep(currentStep);
    }, [searchParams, setCurrentStep]);

    useEffect(() => {
        dispatch(setCurrentNavParams('Edit Client', null, () => {
            if (clientId) {
                if (currentStep === "basicDetails") {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, "basicDetails"));
                } else if (currentStep === "accountDetails") {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, "accountDetails"));
                } else {
                    goBackToMedicalHistory();
                }
            }
        }));
    }, [dispatch, currentStep, clientId, navigate]);


    return (
        <div className={'client-edit-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent
                    mode={mode}
                    onSave={handleClientDetailsSave}
                    onCancel={handleClientDetailsCancel}
                />
            }
            {
                clientId && <>
                    {
                        currentStep === "personalHabits" && <ClientPersonalHabitsFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}
                            onNext={handleClientDetailsNext}
                        />
                    }
                    {
                        currentStep === "medicalSupplements" && <ClientMedicalSupplementsFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}
                            onNext={handleClientDetailsNext}
                        />
                    }
                    {
                        currentStep === "medicalHistory" && <ClientMedicalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}
                            onNext={handleClientDetailsNext}
                        />
                    }
                    {
                        currentStep === "surgicalHistory" && <ClientSurgicalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}
                            onNext={handleClientDetailsNext}
                        />
                    }
                    {
                        currentStep === "medicalFemaleOnly" && <ClientMedicalFemaleOnlyFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}
                            onNext={handleClientDetailsNext}
                        />
                    }
                    {
                        currentStep === "medicalProvider" && <ClientMedicalProviderInformationFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}
                            onNext={handleClientDetailsNext}

                        />
                    }
                    {
                        currentStep === "musculoskeletalHistory" && <ClientMusculoskeletalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}
                        />
                    }
                    {
                        currentStep === 'allergies' && <ClientAllergiesFormComponent
                            clientId={clientId}
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            onNext={handleClientDetailsNext}
                        />
                    }
                    {
                        currentStep === "accountDetails" && <ClientAccountDetailsFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}/>
                    }
                </>
            }
        </div>
    )
};

export default ClientEditScreen;