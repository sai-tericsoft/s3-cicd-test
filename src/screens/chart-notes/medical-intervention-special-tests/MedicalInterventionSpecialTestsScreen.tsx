import "./MedicalInterventionSpecialTestsScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {IRootReducerState} from "../../../store/reducers";
import {IBodyPartSpecialTestConfig} from "../../../shared/models/static-data.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {RadioButtonComponent} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import SpecialTestComponent from "../special-test/SpecialTestComponent";

interface MedicalInterventionSpecialTestsScreenProps {

}

const MedicalInterventionSpecialTestsScreen = (props: MedicalInterventionSpecialTestsScreenProps) => {

    const [globalSpecialTestConfig, setGlobalSpecialTestConfig] = useState<IBodyPartSpecialTestConfig[]>([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [showAddBodyPartModal, setShowAddBodyPartModal] = useState<boolean>(false);
    const {bodyPartList} = useSelector((state: IRootReducerState) => state.staticData);
    const [selectedBodyPartToBeAdded, setSelectedBodyPartToBeAdded] = useState<any>(undefined);
    const {
        medicalInterventionDetails,
        isMedicalInterventionDetailsLoading,
        isMedicalInterventionDetailsLoaded,
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (medicalRecordId && medicalInterventionId) {
            dispatch(setCurrentNavParams("SOAP Note", null, () => {
                if (medicalInterventionDetails?.status === 'completed') {
                    navigate(CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, medicalInterventionId));
                } else {
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId));
                }
            }));
        }
    }, [dispatch, navigate, medicalInterventionDetails, medicalRecordId, medicalInterventionId]);

    useEffect(() => {
        if (medicalInterventionId && !medicalInterventionDetails) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, medicalInterventionDetails, dispatch]);

    const handleAddNewBodyPartOpenModal = useCallback(() => {
        setShowAddBodyPartModal(true);
        setSelectedBodyPartToBeAdded(undefined);
    }, []);

    const handleAddNewBodyPart = useCallback(() => {
        setShowAddBodyPartModal(false);
        setGlobalSpecialTestConfig([...globalSpecialTestConfig, {
            body_part: selectedBodyPartToBeAdded,
            selected_tests: [],
            mode: 'write'
        }]);
        setSelectedBodyPartToBeAdded(undefined);
    }, [globalSpecialTestConfig, selectedBodyPartToBeAdded]);

    const handleDeleteBodyPart = useCallback((body_part_id: string) => {
        setGlobalSpecialTestConfig((prev) => prev.filter((item) => item.body_part._id !== body_part_id));
    }, []);

    useEffect(() => {
        const specialTestConfig: any = [];
        const special_tests = medicalInterventionDetails?.special_tests;
        const injury_details = medicalInterventionDetails?.medical_record_details?.injury_details;
        if (medicalInterventionDetails?.is_special_test_configured) {
            special_tests?.forEach((body_part: any) => {
                if (!specialTestConfig.find((item: any) => item?.body_part?._id === body_part?.body_part_id)) {
                    specialTestConfig.push({
                        body_part: body_part.body_part_details,
                        selected_tests: body_part.special_tests
                    });
                }
            });
        } else {
            if (injury_details?.length > 0) {
                injury_details?.forEach((body_part: any) => {
                    if (!specialTestConfig.find((item: any) => item?.body_part?._id === body_part?.body_part_id)) {
                        specialTestConfig.push({body_part: body_part.body_part_details, selected_tests: [], mode: 'write'});
                    }
                });
            }
        }
        setGlobalSpecialTestConfig(specialTestConfig);
    }, [medicalInterventionDetails]);

    return (
        <div className={'medical-intervention-special-tests-screen'}>
            <FormControlLabelComponent label={'Special Test'} size={'lg'}/>
            <>
                {
                    isMedicalInterventionDetailsLoading && <>
                        <LoaderComponent/>
                    </>
                }
                {
                    (isMedicalInterventionDetailsLoaded && medicalInterventionId) && <>
                        {
                            globalSpecialTestConfig?.length === 0 && <>
                                <StatusCardComponent
                                    title={"There are no body parts listed under the Special Test. Please add a body part."}>
                                    <ButtonComponent
                                        prefixIcon={<ImageConfig.AddIcon/>}
                                        onClick={handleAddNewBodyPartOpenModal}
                                    >
                                        Add Body Part
                                    </ButtonComponent>
                                </StatusCardComponent>
                            </>
                        }
                        {
                            globalSpecialTestConfig.length > 0 && <>
                                {
                                    globalSpecialTestConfig.map((bodyPart, index) => <SpecialTestComponent
                                            medicalInterventionDetails={medicalInterventionDetails}
                                            key={bodyPart.body_part._id}
                                            bodyPart={bodyPart.body_part}
                                            selected_tests={bodyPart.selected_tests}
                                            onDelete={handleDeleteBodyPart}
                                            medicalInterventionId={medicalInterventionId}
                                            mode={bodyPart?.mode}
                                        />
                                    )
                                }
                                <ButtonComponent
                                    prefixIcon={<ImageConfig.AddIcon/>}
                                    onClick={handleAddNewBodyPartOpenModal}
                                >
                                    Add Body Part
                                </ButtonComponent>
                            </>
                        }
                    </>
                }
            </>
            <ModalComponent
                isOpen={showAddBodyPartModal}
                title={"Add Body Part: "}
                className={"intervention-special-test-config-add-body-part-modal"}
                modalFooter={<>
                    <ButtonComponent variant={"outlined"}
                                     onClick={() => {
                                         setShowAddBodyPartModal(false);
                                     }}
                    >
                        Cancel
                    </ButtonComponent>&nbsp;
                    <ButtonComponent onClick={handleAddNewBodyPart}
                                     disabled={!selectedBodyPartToBeAdded}
                    >
                        Add
                    </ButtonComponent>
                </>}
            >
                <div className="ts-row">
                    {
                        bodyPartList.map((item: any, index: number) => {
                            return <div className="ts-col-md-6 ts-col-lg-3"
                                        key={item._id}>
                                <RadioButtonComponent
                                    name={"intervention-rom-config-add-body-part"}
                                    key={index + item?.name}
                                    label={item?.name}
                                    checked={selectedBodyPartToBeAdded?._id === item?._id}
                                    disabled={globalSpecialTestConfig.findIndex((bodyPart) => bodyPart.body_part._id === item._id) !== -1}
                                    onChange={() => {
                                        setSelectedBodyPartToBeAdded(item);
                                    }}/>
                            </div>
                        })
                    }
                </div>
            </ModalComponent>
        </div>
    );

};

export default MedicalInterventionSpecialTestsScreen;
