import "./ClientAddScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import ClientPersonalHabitsFormComponent from "../client-personal-habits-form/ClientPersonalHabitsFormComponent";
import {ClientAddFormSteps, IClientBasicDetails} from "../../../shared/models/client.model";
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

interface ClientAddScreenProps {

}

const ClientAddSteps: ClientAddFormSteps[] = ["basicDetails", "personalHabits", "allergies", "medicalSupplements", "surgicalHistory", "medicalFemaleOnly", "medicalProvider", "musculoskeletal", "medicalHistory", "accountDetails"];

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<ClientAddFormSteps>(ClientAddSteps[0]);
    const dispatch = useDispatch();
    const [clientId, setClientId] = useState<number | undefined>(undefined);
    const [clientDetails, setClientDetails] = useState<IClientBasicDetails | undefined>(undefined);

    useEffect(() => {
        dispatch(setCurrentNavParams('Add Client'));
    }, [dispatch]);

    const handleClientDetailsSave = useCallback((data: any) => {
        let nextStep = currentStep;
        let clientId = undefined;
        switch (currentStep) {
            case "basicDetails": {
                clientId = data._id;
                nextStep = 'personalHabits';
                setClientId(clientId);
                setClientDetails(data);
                searchParams.set("clientId", clientId.toString());
                break;
            }
            case "personalHabits": {
                nextStep = 'allergies';
                break;
            }
            case "allergies": {
                nextStep = 'medicalSupplements';
                break;
            }
            case "medicalSupplements": {
                nextStep = 'medicalHistory';
                break;
            }
            case "medicalHistory": {
                if (clientDetails?.gender?.code === "female") {
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
                nextStep = 'musculoskeletal';
                break;
            }
            case "musculoskeletal": {
                nextStep = 'medicalProvider';
                break;
            }
            case "medicalProvider": {
                nextStep = 'accountDetails';
                break;
            }
            case "accountDetails": {
                navigate(CommonService._routeConfig.ClientList());
                break;
            }
            default: {
                navigate(CommonService._routeConfig.ClientList());
            }
        }
        setCurrentStep(nextStep);
        searchParams.set("currentStep", nextStep);
        setSearchParams(searchParams);
    }, [currentStep, clientDetails, navigate, searchParams, setSearchParams]);

    useEffect(() => {
        let currentStep: any = searchParams.get("currentStep");
        const clientId = searchParams.get("clientId");
        console.log(currentStep, clientId);
        if (clientId) {
            setClientId(parseInt(clientId, 10));
            if (currentStep) {
                if (!ClientAddSteps.includes(currentStep)) {
                    currentStep = "basicDetails";
                }
            }
        } else {
            currentStep = "basicDetails";
        }
        if (currentStep) {
            setCurrentStep(currentStep);
        }
    }, [searchParams]);

    return (
        <div className={'client-add-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent
                    mode={"add"}
                    onSave={handleClientDetailsSave}/>
            }
            {
                clientId && <>
                    {
                        currentStep === "personalHabits" && <ClientPersonalHabitsFormComponent
                            mode={"add"}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalSupplements" && <ClientMedicalSupplementsFormComponent
                            mode={"add"}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalHistory" && <ClientMedicalHistoryFormComponent
                            mode={"add"}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "surgicalHistory" && <ClientSurgicalHistoryFormComponent
                            mode={"add"}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalFemaleOnly" && <ClientMedicalFemaleOnlyFormComponent
                            mode={"add"}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalProvider" && <ClientMedicalProviderInformationFormComponent
                            mode={"add"}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "musculoskeletal" && <ClientMusculoskeletalHistoryFormComponent
                            mode={"add"}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === 'allergies' && <ClientAllergiesFormComponent
                            clientId={clientId}
                            mode={"add"}
                            onSave={handleClientDetailsSave}/>
                    }
                    {
                        currentStep === "accountDetails" && <ClientAccountDetailsFormComponent
                            mode={"add"}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                </>
            }
        </div>
    )
};

export default ClientAddScreen;