import "./ClientAddScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";

interface ClientAddScreenProps {

}

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const [currentStep, setCurrentStep] = useState<"basicDetails" | "medicalDetails">("basicDetails");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentNavParams('Add Client'));
    }, [dispatch]);

    const handleClientBasicDetailsSave = useCallback(() => {
        setCurrentStep("medicalDetails");
    }, []);

    return (
        <div className={'client-add-screen'}>
            {
                currentStep === "basicDetails" &&
                <ClientBasicDetailsFormComponent mode={"add"} onSave={handleClientBasicDetailsSave}/>
            }
            {
                currentStep === "medicalDetails" && <div>
                    Medical questionire forms
                </div>
            }
        </div>
    );

};

export default ClientAddScreen;