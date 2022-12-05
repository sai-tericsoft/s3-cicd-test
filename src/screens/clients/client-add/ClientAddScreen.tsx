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

interface ClientAddScreenProps {

}

const ClientAddSteps: IClientFormSteps[] = ["basicDetails", "personalHabits", "allergies", "medicalSupplements", "surgicalHistory", "medicalFemaleOnly", "medicalProvider", "musculoskeletal", "medicalHistory", "accountDetails"];

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const mode = "add";
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<IClientFormSteps>(ClientAddSteps[0]);
    const dispatch = useDispatch();
    const {clientBasicDetails} = useSelector((state: IRootReducerState) => state.client);
    const [clientId, setClientId] = useState<string | undefined>(undefined);

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
    }, [currentStep, clientBasicDetails, navigate, searchParams, setSearchParams]);

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
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalSupplements" && <ClientMedicalSupplementsFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalHistory" && <ClientMedicalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "surgicalHistory" && <ClientSurgicalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalFemaleOnly" && <ClientMedicalFemaleOnlyFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalProvider" && <ClientMedicalProviderInformationFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "musculoskeletal" && <ClientMusculoskeletalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === 'allergies' && <ClientAllergiesFormComponent
                            clientId={clientId}
                            mode={mode}
                            onSave={handleClientDetailsSave}/>
                    }
                    {
                        currentStep === "accountDetails" && <ClientAccountDetailsFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            clientId={clientId}/>
                    }
                </>
            }
        </div>
    )
};

export default ClientAddScreen;