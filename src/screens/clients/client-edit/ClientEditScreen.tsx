import "./ClientEditScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
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
import {
    setClientAccountDetails,
    setClientBasicDetails,
    setClientMedicalDetails
} from "../../../store/actions/client.action";

interface ClientEditScreenProps {

}

const ClientAddSteps: IClientFormSteps[] = ["basicDetails", "personalHabits", "allergies", "medicalSupplements", "surgicalHistory", "medicalFemaleOnly", "medicalProvider", "musculoskeletal", "medicalHistory", "accountDetails"];

const ClientEditScreen = (props: ClientEditScreenProps) => {

    const mode = "edit";
    const navigate = useNavigate();
    const {clientId} = useParams();
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<IClientFormSteps>(ClientAddSteps[0]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentNavParams('Edit Client'));
    }, [dispatch]);

    const handleClientDetailsSave = useCallback((data: any) => {
        switch (currentStep) {
            case "basicDetails": {
                if (clientId) {
                    console.log(clientId, currentStep);
                    navigate(CommonService._routeConfig.ClientDetails(clientId));
                }
                break;
            }
            case "personalHabits": {
                break;
            }
            case "allergies": {
                break;
            }
            case "medicalSupplements": {
                break;
            }
            case "medicalHistory": {
                break;
            }
            case "medicalFemaleOnly": {
                break;
            }
            case "surgicalHistory": {
                break;
            }
            case "musculoskeletal": {
                break;
            }
            case "medicalProvider": {
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
    }, [currentStep, clientId, navigate]);

    useEffect(() => {
        let currentStep: any = searchParams.get("currentStep");
        if (currentStep) {
            if (!ClientAddSteps.includes(currentStep)) {
                currentStep = "basicDetails";
            }
        }
        setCurrentStep(currentStep);
    }, [searchParams]);


    useEffect(() => {
        return () => {
            dispatch(setClientBasicDetails(undefined));
            dispatch(setClientMedicalDetails(undefined));
            dispatch(setClientAccountDetails(undefined));
        }
    }, [dispatch])

    return (
        <div className={'client-add-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent
                    mode={mode}
                    clientId={clientId}
                    onSave={handleClientDetailsSave}
                />
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

export default ClientEditScreen;