import "./ClientAddScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import ClientPersonalHabitsFormComponent from "../client-personal-habits-form/ClientPersonalHabitsFormComponent";
import {ClientAddFormSteps} from "../../../shared/models/client.model";
import ClientMedicalSupplementsFormComponent
    from "../client-medical-supplements-form/ClientMedicalSupplementsFormComponent";
import {useNavigate} from "react-router-dom";
import {CommonService} from "../../../shared/services";

interface ClientAddScreenProps {

}

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<ClientAddFormSteps>("medicalSupplements");
    const dispatch = useDispatch();
    const [clientId] = useState<string>("6388a3d1e6bdcac0ca1942a7");

    useEffect(() => {
        dispatch(setCurrentNavParams('Add Client'));
    }, [dispatch]);

    const handleClientDetailsSave = useCallback((currentStep: ClientAddFormSteps) => {
        switch (currentStep) {
            case "basicDetails": {
                setCurrentStep('personalHabits');
                break;
            }
            case "personalHabits": {
                setCurrentStep('allergies');
                break;
            }
            default: {
                navigate(CommonService._routeConfig.ClientList());
            }
        }
    }, []);

    return (
        <div className={'client-add-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent
                    mode={"add"}
                    onSave={handleClientDetailsSave.bind('basicDetails')}/>
            }
            {
                currentStep === "personalHabits" && <ClientPersonalHabitsFormComponent
                    mode={"add"}
                    onSave={handleClientDetailsSave.bind('personalHabits')}
                    clientId={clientId}
                />
            }
            {
                currentStep === "medicalSupplements" && <ClientMedicalSupplementsFormComponent
                    mode={"add"}
                    onSave={handleClientDetailsSave.bind('medicalSupplements')}
                    clientId={clientId}
                />
            }
        </div>
    )
};

export default ClientAddScreen;