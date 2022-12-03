import "./ClientAddScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import ClientPersonalHabitsFormComponent from "../client-personal-habits-form/ClientPersonalHabitsFormComponent";
import {ClientAddFormSteps} from "../../../shared/models/client.model";
import ClientAllergiesFormComponent from "../client-allergies-form/ClientAllergiesFormComponent";
import {useNavigate} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import ClientMedicalHistoryFormComponent from "../client-medical-history-form/ClientMedicalHistoryFormComponent";
import ClientMedicalSupplementsFormComponent
    from "../client-medical-supplements-form/ClientMedicalSupplementsFormComponent";
import ClientSurgicalHistoryFormComponent from "../client-surgical-history-form/ClientSurgicalHistoryFormComponent";
import ClientMedicalFemaleOnlyFormComponent
    from "../client-medical-female-only-form/ClientMedicalFemaleOnlyFormComponent";
import ClientMedicalProviderInformationFormComponent
    from "../client-medical-provider-information-form/ClientMedicalProviderInformationFormComponent";
import ClientMusculoskeletalHistoryFormComponent from "../client-musculoskeletal-history-form/ClientMusculoskeletalHistoryFormComponent";

interface ClientAddScreenProps {

}

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const navigate = useNavigate();
    const [currentStep] = useState<ClientAddFormSteps>("basicDetails");
    const dispatch = useDispatch();
    const [clientId] = useState<string>("6388a3d1e6bdcac0ca1942a7");

    useEffect(() => {
        dispatch(setCurrentNavParams('Add Client'));
    }, [dispatch]);

    const handleClientDetailsSave = useCallback(() => {
        switch (currentStep) {
            // case "basicDetails": {
            //     setCurrentStep('personalHabits');
            //     break;
            // }
            default: {
                navigate(CommonService._routeConfig.ClientList());
            }
        }
    }, [currentStep, navigate]);

    return (
        <div className={'client-add-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent
                    mode={"add"}
                    onSave={handleClientDetailsSave}/>
            }
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
                    onSave={handleClientDetailsSave.bind('allergies')}/>
            }
        </div>
    )
};

export default ClientAddScreen;