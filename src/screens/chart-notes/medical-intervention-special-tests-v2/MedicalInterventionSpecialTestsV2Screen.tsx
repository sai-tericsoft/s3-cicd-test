import "./MedicalInterventionSpecialTestsV2Screen.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import React, {useCallback, useEffect, useState} from "react";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {IBodyPartSpecialTestConfig} from "../../../shared/models/static-data.model";

interface MedicalInterventionSpecialTestsV2ScreenProps {

}

const MedicalInterventionSpecialTestsV2Screen = (props: MedicalInterventionSpecialTestsV2ScreenProps) => {

    const {medicalRecordId, medicalInterventionId} = useParams();
    const [globalSpecialTestConfig, setGlobalSpecialTestConfig] = useState<IBodyPartSpecialTestConfig[]>([]);
    const dispatch = useDispatch();

    const {
        medicalInterventionDetails,
        isMedicalInterventionDetailsLoading,
        isMedicalInterventionDetailsLoaded,
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (medicalInterventionId && !medicalInterventionDetails) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, medicalInterventionDetails, dispatch]);

    const buildSpecialTestConfig = useCallback((medicalInterventionDetails: any) => {
        console.log("build special test config", medicalInterventionDetails);
        const specialTestConfig: any = [];
        const is_special_test_configured = medicalInterventionDetails?.is_special_test_configured;
        const special_tests = medicalInterventionDetails?.special_tests;
        const injury_details = medicalInterventionDetails?.medical_record_details?.injury_details;
        if (is_special_test_configured) {
            console.log('special test configured');
            console.log('special_tests', special_tests);
            specialTestConfig?.forEach((injury: any) => {
                if (!specialTestConfig?.find((item: any) => item?.body_part?._id === injury?.body_part_id)) {
                    specialTestConfig.push({
                        body_part: injury?.body_part_details,
                        selected_tests: injury?.selected_tests || [],
                        selected_sides: ['left', 'right', 'central'],
                        mode: 'read'
                    });
                }
            });
        } else {
            console.log('special test not configured');
            console.log('injuries', injury_details);
            if (injury_details?.length > 0) {
                injury_details?.forEach((injury: any) => {
                    if (!specialTestConfig?.find((item: any) => item?.body_part?._id === injury?.body_part_id)) {
                        specialTestConfig.push({
                            body_part: injury?.body_part_details,
                            selected_tests: [],
                            selected_sides: ['left', 'right', 'central'],
                            mode: 'write'
                        });
                    }
                });
            }
        }
        console.log('specialTestConfig', specialTestConfig);
        setGlobalSpecialTestConfig(specialTestConfig);
    }, []);

    useEffect(() => {
        if (medicalInterventionDetails) {
            buildSpecialTestConfig(medicalInterventionDetails);
        }
    }, [medicalInterventionDetails, buildSpecialTestConfig]);

    return (
        <div className={'medical-intervention-special-tests-v2-screen'}>
            <FormControlLabelComponent label={'Special Test'} size={'lg'}/>
            <MedicalRecordBasicDetailsCardComponent/>
        </div>
    );

};

export default MedicalInterventionSpecialTestsV2Screen;
