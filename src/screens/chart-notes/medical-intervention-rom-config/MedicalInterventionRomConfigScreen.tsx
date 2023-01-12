import "./MedicalInterventionRomConfigScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {IRootReducerState} from "../../../store/reducers";
import {IBodyPartROMConfig} from "../../../shared/models/static-data.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {RadioButtonComponent} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import RomConfigComponent from "../rom-config/RomConfigComponent";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";

interface MedicalInterventionRomConfigScreenProps {

}

const MedicalInterventionRomConfigScreen = (props: MedicalInterventionRomConfigScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [globalRomConfig, setGlobalRomConfig] = useState<IBodyPartROMConfig[]>([]);
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
                medicalInterventionId && navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, medicalInterventionId));
            }));
        }
    }, [dispatch, navigate, medicalRecordId, medicalInterventionId]);

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
        setGlobalRomConfig([...globalRomConfig, {
            body_part: selectedBodyPartToBeAdded,
            rom_config: [],
            selected_sides: [selectedBodyPartToBeAdded.default_body_side]
        }]);
        setSelectedBodyPartToBeAdded(undefined);
    }, [globalRomConfig, selectedBodyPartToBeAdded]);

    const handleDeleteBodyPart = useCallback((body_part_id: string) => {
        setGlobalRomConfig((prev) => prev.filter((item) => item.body_part._id !== body_part_id));
    }, []);

    useEffect(() => {
        const romConfig: any = [];
        const rom_config = medicalInterventionDetails?.rom_config;
        const injury_details =medicalInterventionDetails?.medical_record_details?.injury_details;
        if (rom_config?.length > 0) {
            console.log("rom config", rom_config);
            rom_config.forEach((injury: any) => {
                console.log(injury);
                if (!romConfig.find((item: any) => item?.body_part?._id === injury?.body_part_id)) {
                    romConfig.push({
                        body_part: injury?.body_part_details,
                        rom_config: injury?.rom_config || [],
                        selected_sides: injury?.selected_sides || []
                    });
                } else {
                    const bodyPart = romConfig.find((item: any) => item?.body_part?._id === injury?.body_part_id);
                    bodyPart.selected_sides.push(injury.body_side);
                }
            });
        } else {
            if (injury_details?.length > 0) {
                const injuryDetails = medicalInterventionDetails?.medical_record_details?.injury_details;
                injuryDetails.forEach((injury: any) => {
                    if (!romConfig.find((item: any) => item?.body_part?._id === injury?.body_part_id)) {
                        romConfig.push({
                            body_part: injury.body_part_details,
                            rom_config: [],
                            selected_sides: [injury.body_side]
                        });
                    } else {
                        const bodyPart = romConfig.find((item: any) => item?.body_part?._id === injury?.body_part_id);
                        bodyPart.selected_sides.push(injury.body_side);
                    }
                });
            }
        }
        setGlobalRomConfig(romConfig);
    }, [medicalInterventionDetails]);

    return (
        <div className={'medical-intervention-rom-config-screen'}>
            <FormControlLabelComponent label={'Range of Motion and Strength'}/>
            <>
                {
                    isMedicalInterventionDetailsLoading && <>
                        <LoaderComponent/>
                    </>
                }
                {
                    isMedicalInterventionDetailsLoaded && <>
                        {
                            globalRomConfig.length === 0 && <>
                                <StatusCardComponent
                                    title={"There are no body parts listed under the Range of Motion and Strength. Please add a body part."}>
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
                            globalRomConfig.length > 0 && <>
                                {medicalInterventionId && <>
                                    {
                                        globalRomConfig.map((bodyPart, index) => {
                                            return <RomConfigComponent
                                                medicalInterventionDetails={medicalInterventionDetails}
                                                key={bodyPart.body_part._id}
                                                bodyPart={bodyPart.body_part}
                                                rom_config={bodyPart.rom_config}
                                                selectedBodySides={bodyPart.selected_sides}
                                                onDelete={handleDeleteBodyPart}
                                                medicalInterventionId={medicalInterventionId}
                                            />
                                        })
                                    }
                                </>
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
                className={"intervention-rom-config-add-body-part-modal"}
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
                                    disabled={globalRomConfig.findIndex((bodyPart) => bodyPart.body_part._id === item._id) !== -1}
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

export default MedicalInterventionRomConfigScreen;
