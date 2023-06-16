import "./ClientAddScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import ClientPersonalHabitsFormComponent from "../client-personal-habits-form/ClientPersonalHabitsFormComponent";
import {IClientFormSteps} from "../../../shared/models/client.model";
import ClientAllergiesFormComponent from "../client-allergies-form/ClientAllergiesFormComponent";
import {useNavigate, useSearchParams} from "react-router-dom";
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

interface ClientAddScreenProps {

}

const ClientAddSteps: IClientFormSteps[] = ["basicDetails", "personalHabits", "allergies", "medicalSupplements", "surgicalHistory", "medicalFemaleOnly", "medicalProvider", "musculoskeletalHistory", "medicalHistory", "accountDetails"];

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const mode = "add";
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<IClientFormSteps>(ClientAddSteps[0]);
    const dispatch = useDispatch();
    const {clientBasicDetails} = useSelector((state: IRootReducerState) => state.client);
    const [clientId, setClientId] = useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(setCurrentNavParams('Add Client', null, () => {
            navigate(CommonService._routeConfig.ClientList());
        }));
    }, [navigate, dispatch]);

    const goBackToMedicalHistory = useCallback(() => {
        if (clientId) {
            navigate(CommonService._client.NavigateToClientDetails(clientId, "medicalHistoryQuestionnaire"));
        }
    }, [clientId, navigate]);

    const handleClientDetailsSave = useCallback((data: any) => {
        let nextStep = currentStep;
        let clientId = undefined;
        const updatedSearchParams = new URLSearchParams(searchParams); // Create a copy of the searchParams
        switch (currentStep) {
            case "basicDetails": {
                clientId = data._id;
                nextStep = 'personalHabits';
                setClientId(clientId);
                updatedSearchParams.set("clientId", clientId.toString());
                break;
            }
            case "musculoskeletalHistory": {
                nextStep = 'accountDetails';
                break;
            }
            case "accountDetails": {
                navigate(CommonService._routeConfig.ClientList());
                break;
            }
            default: {
                // navigate(CommonService._routeConfig.ClientList());
                return;
            }
        }
        setCurrentStep(nextStep);
        updatedSearchParams.set("currentStep", nextStep);
        setSearchParams(updatedSearchParams); // Use the updatedSearchParams
    }, [currentStep, navigate, searchParams, setSearchParams]);


    const handleClientDetailsCancel = useCallback(() => {
        let prevStep = currentStep;
        if (clientId) {
            switch (currentStep) {
                case "personalHabits": {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, "medicalHistoryQuestionnaire"));
                    break;
                }
                case "allergies": {
                    console.log('allergies');
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
                case "accountDetails": {
                    navigate(CommonService._routeConfig.ClientList());
                    return;
                }
                default: {
                    navigate(CommonService._routeConfig.ClientList());
                    return;
                }
            }
            setCurrentStep(prevStep);
            searchParams.set("currentStep", prevStep);
            setSearchParams(searchParams);
        }
    }, [navigate, clientId, currentStep, searchParams, setSearchParams]);

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
                    navigate(CommonService._routeConfig.ClientList());
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
    }, [currentStep, searchParams,goBackToMedicalHistory, setSearchParams, clientId, navigate, clientBasicDetails, dispatch]);


    useEffect(() => {
        let currentStep: any = searchParams.get("currentStep");
        const clientId = searchParams.get("clientId");
        if (clientId) {
            setClientId(clientId);
            if (currentStep) {
                if (!ClientAddSteps.includes(currentStep)) {
                    currentStep = "basicDetails";
                }
            }
        } else {
            currentStep = "basicDetails";
        }
        setCurrentStep(currentStep);
    }, [searchParams]);

    return (
        <div className={'client-add-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent
                    mode={"add"}
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
                            onNext={handleClientDetailsNext}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalSupplements" && <ClientMedicalSupplementsFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            onNext={handleClientDetailsNext}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalHistory" && <ClientMedicalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            onNext={handleClientDetailsNext}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "surgicalHistory" && <ClientSurgicalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            onNext={handleClientDetailsNext}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalFemaleOnly" && <ClientMedicalFemaleOnlyFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            onNext={handleClientDetailsNext}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalProvider" && <ClientMedicalProviderInformationFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            onNext={handleClientDetailsNext}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "musculoskeletalHistory" && <ClientMusculoskeletalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            onNext={handleClientDetailsNext}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === 'allergies' && <ClientAllergiesFormComponent
                            clientId={clientId}
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onNext={handleClientDetailsNext}
                            onCancel={handleClientDetailsCancel}
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

export default ClientAddScreen;