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

interface ClientEditScreenProps {

}

const ClientAddSteps: IClientFormSteps[] = ["basicDetails", "personalHabits", "allergies", "medicalSupplements", "surgicalHistory", "medicalFemaleOnly", "medicalProvider", "musculoskeletalHistory", "medicalHistory", "accountDetails"];

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
        if (clientId) {
            switch (currentStep) {
                case "basicDetails":
                case "accountDetails": {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, currentStep));
                    break;
                }
                case "personalHabits":
                case "allergies":
                case "medicalHistory":
                case "medicalSupplements":
                case "medicalFemaleOnly":
                case "surgicalHistory":
                case "musculoskeletalHistory":
                case "medicalProvider": {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, "medicalHistoryQuestionnaire"));
                    break;
                }
                default: {
                    navigate(CommonService._routeConfig.ClientList());
                }
            }
        }
    }, [currentStep, clientId, navigate]);

    const handleClientDetailsCancel = useCallback(() => {
        if (clientId) {
            switch (currentStep) {
                case "accountDetails":
                case "basicDetails": {
                    navigate(CommonService._routeConfig.ClientDetails(clientId) + "?currentStep=" + currentStep);
                    break;
                }
                case "personalHabits":
                case "allergies":
                case "medicalHistory":
                case "medicalFemaleOnly":
                case "surgicalHistory":
                case "musculoskeletalHistory":
                case "medicalProvider": {
                    navigate(CommonService._client.NavigateToClientDetails(clientId, "medicalHistoryQuestionnaire"));
                    break;
                }
                default: {
                    navigate(CommonService._routeConfig.ClientList());
                }
            }
        }
    }, [navigate, clientId, currentStep]);

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
    }, [searchParams]);

    console.log(clientId, currentStep);

    return (
        <div className={'client-edit-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent
                    mode={mode}
                    clientId={clientId}
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
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalSupplements" && <ClientMedicalSupplementsFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalHistory" && <ClientMedicalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "surgicalHistory" && <ClientSurgicalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalFemaleOnly" && <ClientMedicalFemaleOnlyFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "medicalProvider" && <ClientMedicalProviderInformationFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === "musculoskeletalHistory" && <ClientMusculoskeletalHistoryFormComponent
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}
                            clientId={clientId}/>
                    }
                    {
                        currentStep === 'allergies' && <ClientAllergiesFormComponent
                            clientId={clientId}
                            mode={mode}
                            onSave={handleClientDetailsSave}
                            onCancel={handleClientDetailsCancel}/>
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