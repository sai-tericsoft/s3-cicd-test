import "./MedicalInterventionRomConfigScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {CommonService} from "../../../shared/services";

interface MedicalInterventionRomConfigScreenProps {

}

const MedicalInterventionRomConfigScreen = (props: MedicalInterventionRomConfigScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalInterventionId} = useParams();
    const {medicalInterventionDetails} = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        dispatch(setCurrentNavParams("SOAP Note", null, () => {
            medicalInterventionId && navigate(CommonService._routeConfig.AddMedicalIntervention(medicalInterventionId));
        }));
    }, [dispatch, medicalInterventionId]);

    useEffect(() => {
        if (medicalInterventionId && !medicalInterventionDetails) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, medicalInterventionDetails, dispatch]);

    return (
        <div className={'medical-intervention-rom-config-screen'}>
            <pre>
                {
                    JSON.stringify(medicalInterventionDetails?.medical_record_details?.injury_details, null, 2)
                }
            </pre>
        </div>
    );

};

export default MedicalInterventionRomConfigScreen;
