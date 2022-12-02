import "./ClientAddScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import ClientPersonalHabitsFormComponent from "../client-personal-habits-form/ClientPersonalHabitsFormComponent";
import {ClientAddFormSteps} from "../../../shared/models/client.model";

interface ClientAddScreenProps {

}

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const [currentStep, setCurrentStep] = useState<ClientAddFormSteps>("basicDetails");
    const dispatch = useDispatch();
    const [clientId, setClientId] = useState<string>("6388a3d1e6bdcac0ca1942a7");

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
                setCurrentStep('basicDetails');
            }
        }
    }, []);

    return (
        <div className={'client-add-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent
                    mode={"add"}
                    onSave={handleClientDetailsSave.bind('personalHabits')}/>
            }
            {
                currentStep === "personalHabits" && <ClientPersonalHabitsFormComponent
                        mode={"add"}
                        onSave={handleClientDetailsSave.bind('personalHabits')}
                        clientId={clientId}
                    />
            }
        </div>
    )
};

export default ClientAddScreen;