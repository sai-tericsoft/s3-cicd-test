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

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<ClientAddFormSteps>("basicDetails");
    const dispatch = useDispatch();
    const [clientId, setClientId] = useState<string | undefined>(undefined);
    const [clientDetails, setClientDetails] = useState<IClientBasicDetails | undefined>(undefined);

    useEffect(() => {
        dispatch(setCurrentNavParams('Add Client'));
    }, [dispatch]);

    const handleClientDetailsSave = useCallback((data: any) => {
        switch (currentStep) {
            case "basicDetails": {
                const clientId = data._id;
                setClientDetails(data);
                if (clientId) {
                    setClientId(clientId);
                    searchParams.set("clientId", clientId.toString());
                    setSearchParams(searchParams);
                }
                setCurrentStep('personalHabits');
                break;
            }
            case "personalHabits": {
                setCurrentStep('allergies');
                break;
            }
            case "allergies": {
                setCurrentStep('medicalSupplements');
                break;
            }
            case "medicalSupplements": {
                setCurrentStep('medicalHistory');
                break;
            }
            case "medicalHistory": {
                if (clientDetails?.gender?.code === "female"){
                    setCurrentStep('medicalFemaleOnly');
                } else {
                    setCurrentStep('surgicalHistory');
                }
                break;
            }
            case "medicalFemaleOnly": {
                setCurrentStep('surgicalHistory');
                break;
            }
            case "surgicalHistory": {
                setCurrentStep('musculoskeletal');
                break;
            }
            case "musculoskeletal": {
                setCurrentStep('medicalProvider');
                break;
            }
            case "medicalProvider": {
                setCurrentStep('accountDetails');
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
    }, [currentStep, clientDetails, navigate, searchParams, setSearchParams]);

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