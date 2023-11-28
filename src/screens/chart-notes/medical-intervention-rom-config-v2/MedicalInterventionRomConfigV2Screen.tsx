import "./MedicalInterventionRomConfigV2Screen.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {IBodyPart, IBodyPartROMConfig} from "../../../shared/models/static-data.model";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import TableComponent from "../../../shared/components/table/TableComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {CommonService} from "../../../shared/services";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import _ from "lodash";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";

interface MedicalInterventionRomConfigV2ScreenProps {

}

const ROM_CONFIG_INITIAL_VALUES = {
    config: {}
}

const MedicalInterventionRomConfigV2Screen = (props: MedicalInterventionRomConfigV2ScreenProps) => {

    const dispatch = useDispatch();
    const {
        medicalInterventionDetails,
        isMedicalInterventionDetailsLoaded,
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const {bodyPartList} = useSelector((state: IRootReducerState) => state.staticData);
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [globalRomConfig, setGlobalRomConfig] = useState<IBodyPartROMConfig[]>([]);
    const [romFormValues, setRomFormValues] = useState<any>(ROM_CONFIG_INITIAL_VALUES);
    const [selectedBodyPartForSideSelection, setSelectedBodyPartForSideSelection] = useState<any>(undefined);
    const [mode] = useState<'read' | 'write'>('write');
    const [showROMMovementCommentsModal, setShowROMMovementCommentsModal] = useState<boolean>(false);
    const [selectedBodyPartForComments, setSelectedBodyPartForComments] = useState<any>(undefined);
    const [selectedROMMovementComments, setSelectedROMMovementComments] = useState<any>(undefined);
    const [isBodyPartBeingDeleted, setIsBodyPartBeingDeleted] = useState<boolean>(false);
    const [isBodySidesModalOpen, setIsBodySidesModalOpen] = useState<boolean>(false);
    const [showAddBodyPartModal, setShowAddBodyPartModal] = useState<boolean>(false);
    const [selectedBodyPartsToBeAdded, setSelectedBodyPartsToBeAdded] = useState<any[]>([]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const last_position: any = searchParams.get("last_position");

    const generateRomConfigForBodySide = useCallback((bodyPart: any, side: string) => {
        return {
            title: side,
            align: 'center',
            // fixed: 'left',
            children: [
                {
                    title: 'AROM',
                    key: side + 'arom',
                    // fixed: 'left',
                    align: 'center',
                    width: 80,
                    render: (record: any) => {
                        return <Field
                            name={`${bodyPart._id}.rom_config.${record?.name}.${side}.arom`}
                            className="t-form-control">
                            {
                                (field: FieldProps) => (
                                    mode === 'read' ? <>
                                        <span>{_.get(field.form?.values, field.field.name) || "-"}</span>
                                    </> : <FormikInputComponent
                                        className={(!record.applicable_sides?.includes(side) || !record.applicable_rom?.includes('AROM')) ? "not-allowed" : ""}
                                        disabled={(!record.applicable_sides?.includes(side) || !record.applicable_rom?.includes('AROM'))}
                                        formikField={field}
                                        size={"small"}/>
                                )
                            }
                        </Field>;
                    }
                },
                {
                    title: 'PROM',
                    key: side + 'prom',
                    // fixed: 'left',
                    align: 'center',
                    width: 80,
                    render: (record: any) => {
                        return <Field
                            name={`${bodyPart._id}.rom_config.${record?.name}.${side}.prom`}
                            className="t-form-control">
                            {
                                (field: FieldProps) => (
                                    mode === 'read' ? <>
                                        <span>{_.get(field.form?.values, field.field.name) || "-"}</span>
                                    </> : <FormikInputComponent
                                        className={(!record.applicable_sides?.includes(side) || !record.applicable_rom?.includes('PROM')) ? "not-allowed" : ""}
                                        disabled={(!record.applicable_sides?.includes(side) || !record.applicable_rom?.includes('PROM'))}
                                        formikField={field}
                                        size={"small"}/>
                                )
                            }
                        </Field>;
                    }
                },
                {
                    title: 'Strength',
                    key: side + 'strength',
                    // fixed: 'left',
                    align: 'center',
                    width: 80,
                    render: (record: any) => {
                        return <Field
                            name={`${bodyPart._id}.rom_config.${record?.name}.${side}.strength`}
                            className="t-form-control">
                            {
                                (field: FieldProps) => (
                                    mode === 'read' ? <>
                                        <span>{_.get(field.form?.values, field.field.name) || "-"}</span>
                                    </> : <FormikInputComponent
                                        className={(!record.applicable_sides?.includes(side) || !record.applicable_rom?.includes('Strength')) ? "not-allowed" : ""}
                                        disabled={(!record.applicable_sides?.includes(side) || !record.applicable_rom?.includes('Strength'))}
                                        formikField={field}
                                        size={"small"}/>
                                )
                            }
                        </Field>;
                    }
                },
            ]
        }

    }, [mode]);

    const generateROMConfigColumns = useCallback((bodyPart: IBodyPart, selectedBodySides: any) => {
        const columns: any = [
            {
                title: '',
                width: 180,
                fixed: 'left',
                children: [
                    {
                        title: 'Movement',
                        key: 'movement',
                        width: 180,
                        fixed: 'left',
                        render: (record: any) => {
                            return <div className="movement-name">
                                {record.name}
                            </div>
                        }
                    }
                ]
            }
        ];
        selectedBodySides?.forEach((side: any) => {
            columns.push(generateRomConfigForBodySide(bodyPart, side));
        });
        columns.push(
            {
                title: '',
                key: 'comments-header',
                fixed: 'right',
                width: 300,
                children: [{
                    title: 'Comments',
                    key: 'comments',
                    align: 'center',
                    // fixed: 'right',
                    width: 300,
                    render: (record: any, index: any) => <Field
                        name={`${bodyPart._id}.rom_config.${record?.name}.comments`}
                        className="t-form-control">
                        {
                            (field: FieldProps) => (
                                <>
                                    {
                                        mode === 'write' && <>
                                            {
                                                field.form?.values[bodyPart._id]?.rom_config?.[record?.name]?.comments && <>
                                                    <ToolTipComponent position={'bottom'}
                                                                      tooltip={field.form?.values[bodyPart._id]?.rom_config?.[record?.name]?.comments}>
                                                        <div className="movement-comment">
                                                            {field.form?.values[bodyPart._id]?.rom_config?.[record?.name]?.comments.length > 60 ? field.form?.values[bodyPart._id]?.rom_config?.[record?.name]?.comments.substring(0, 60) + '...' : field.form?.values[bodyPart._id]?.rom_config?.[record?.name]?.comments}
                                                        </div>
                                                    </ToolTipComponent>
                                                    &nbsp;
                                                    <IconButtonComponent
                                                        onClick={() => {
                                                            setShowROMMovementCommentsModal(true);
                                                            setSelectedBodyPartForComments(bodyPart);
                                                            setSelectedROMMovementComments(record);
                                                        }}>
                                                        <ImageConfig.EditIcon/>
                                                    </IconButtonComponent>
                                                </>
                                            }
                                            {
                                                !field.form?.values[bodyPart._id]?.rom_config?.[record?.name]?.comments &&
                                                <>
                                                    <ButtonComponent
                                                        variant={"text"}
                                                        prefixIcon={<ImageConfig.AddIcon/>}
                                                        disabled={!(record?.applicable_sides?.some((side: string) => field.form?.values[bodyPart._id]?.tableConfig?.map((item: any) => item.title)?.includes(side)))}
                                                        onClick={() => {
                                                            setShowROMMovementCommentsModal(true);
                                                            setSelectedBodyPartForComments(bodyPart);
                                                            setSelectedROMMovementComments(record);
                                                        }}>
                                                        Add Comment
                                                    </ButtonComponent>
                                                </>

                                            }
                                        </>
                                    }
                                    {
                                        mode === 'read' &&
                                        <ToolTipComponent
                                            tooltip={field.form?.values[bodyPart._id]?.rom_config?.[record?.name]?.comments}>
                                            <div className="movement-comment">
                                                {field.form?.values[bodyPart._id]?.rom_config?.[record?.name]?.comments || "N/A"}
                                            </div>
                                        </ToolTipComponent>
                                    }
                                </>
                            )
                        }
                    </Field>
                }]
            })
        return columns;
    }, [mode, generateRomConfigForBodySide]);

    const generateROMConfigForAnInjury = useCallback((bodyPart: IBodyPart, selectedBodySides: any, rom_config: any) => {
        const bodyPartConfig: any = _.cloneDeep(bodyPart);
        if (bodyPart?.movements && bodyPart?.movements?.length > 0) {
            bodyPartConfig.movements = bodyPart?.movements?.map((movement: any, index: number) => {
                const movement_data = rom_config?.find((rom: any) => rom?.movement_name === movement?.name);
                return {...movement, ...movement_data, comments: "", commentsTemp: ""};
            });
        } else {
            bodyPartConfig.movements = [];
        }
        bodyPartConfig.selected_sides = _.cloneDeep(selectedBodySides);
        bodyPartConfig.tableConfig = generateROMConfigColumns(bodyPartConfig, selectedBodySides);
        bodyPartConfig['rom_config'] = {};
        bodyPartConfig.movements?.forEach((movement: any) => {
            const config = movement?.config;
            bodyPartConfig['rom_config'][movement.name] = {
                comments: config?.comments,
                commentsTemp: config?.commentsTemp || config?.comments,
            };
            selectedBodySides?.forEach((side: any) => {
                if (movement.config && Object.keys(movement.config).includes(side)) {
                    const configSideData = movement?.config[side];
                    bodyPartConfig['rom_config'][movement.name][side] = {
                        arom: configSideData?.arom,
                        prom: configSideData?.prom,
                        strength: configSideData?.strength,
                    }
                }
            });
        });
        return bodyPartConfig;
    }, [generateROMConfigColumns]);

    const buildRomConfig = useCallback((romConfig: any) => {
        const config: any = {};
        romConfig?.forEach((bodyPart: any) => {
            config[bodyPart?.body_part?._id] = generateROMConfigForAnInjury(bodyPart?.body_part, bodyPart?.selected_sides, bodyPart?.rom_config);
        });
        setRomFormValues(config);
    }, [generateROMConfigForAnInjury]);

    const handleAddNewBodyPartOpenModal = useCallback(() => {
        setShowAddBodyPartModal(true);
        setSelectedBodyPartsToBeAdded([]);
    }, []);

    const handleAddNewBodyPart = useCallback(() => {
        setShowAddBodyPartModal(false);
        const updatedGlobalRomConfig: any = [...globalRomConfig];
        for (const selectedBodyPart of selectedBodyPartsToBeAdded) {
            updatedGlobalRomConfig.push({
                body_part: selectedBodyPart,
                rom_config: [],
                selected_sides: [...selectedBodyPart?.sides],
                mode: 'write'
            });
        }
        setGlobalRomConfig(updatedGlobalRomConfig);

        const romFormValuesCopy = _.cloneDeep(romFormValues);
        for (const selectedBodyPart of selectedBodyPartsToBeAdded) {
            romFormValuesCopy[selectedBodyPart._id] = generateROMConfigForAnInjury(
                selectedBodyPart,
                [...selectedBodyPart?.sides],
                []
            );
        }
        setRomFormValues(romFormValuesCopy);

        setSelectedBodyPartsToBeAdded([]); // Clear the selected items
    }, [romFormValues, globalRomConfig, selectedBodyPartsToBeAdded, generateROMConfigForAnInjury]);

    useEffect(() => {
        if (medicalInterventionId && (!medicalInterventionDetails || (medicalInterventionDetails?._id !== medicalInterventionId))) {
           dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, medicalInterventionDetails, dispatch]);

    const onEditSuccess = useCallback(() => {
        if (medicalInterventionId) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, dispatch]);

    useEffect(() => {
        if (medicalRecordId && medicalInterventionId) {
            const referrer: any = searchParams.get("referrer");
            dispatch(setCurrentNavParams("Save SOAP Note", null, () => {
                if (referrer) {
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + '?referrer=' + referrer + `&last_position=${last_position}`);
                } else {
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + `?last_position=${last_position}`);
                }
            }));

        }
    }, [navigate, dispatch, medicalRecordId, medicalInterventionId, searchParams, last_position]);


    useEffect(() => {
        const romConfig: any = [];
        const rom_config = medicalInterventionDetails?.rom_config;
        // const injury_details = medicalInterventionDetails?.medical_record_details?.injury_details;
        // if (romConfig?.length > 0) {
            rom_config?.forEach((injury: any) => {
                if (!romConfig?.find((item: any) => item?.body_part?._id === injury?.body_part_id)) {
                    romConfig.push({
                        body_part: injury?.body_part_details,
                        rom_config: injury?.rom_config || [],
                        selected_sides: injury?.selected_sides || [],
                        mode: 'read'
                    });
                } else {
                    const bodyPartIndex = romConfig.findIndex((item: any) => item?.body_part?._id === injury?.body_part_id);
                    romConfig[bodyPartIndex].selected_sides.push(injury.body_side);
                }
            });
        // }
        // else {
        //     rom_config?.forEach((injury: any) => {
        //             if (!romConfig?.find((item: any) => item?.body_part?._id === injury?.body_part_id)) {
        //                 romConfig.push({
        //                     body_part: injury?.body_part_details,
        //                     rom_config: [],
        //                     selected_sides: [injury?.body_side],
        //                     mode: 'write'
        //                 });
        //             } else {
        //                 const bodyPartIndex = romConfig.findIndex((item: any) => item?.body_part?._id === injury?.body_part_id);
        //                 romConfig[bodyPartIndex].selected_sides.push(injury.body_side);
        //             }
        //         });
        // }
        setGlobalRomConfig(romConfig);
        buildRomConfig(romConfig);
    }, [medicalInterventionDetails, buildRomConfig]);

    const handleROMConfigSave = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        if (medicalInterventionId) {
            const config: any = [];
            Object.keys(values).forEach((bodyPartId: string) => {
                const bodyPartConfig = values[bodyPartId];
                const bodyPartData: any = {
                    body_part_id: bodyPartId,
                    selected_sides: bodyPartConfig?.selected_sides,
                    rom_config: []
                };
                bodyPartConfig?.movements?.forEach((movement: any) => {
                    const movementDataTemp: any = bodyPartConfig?.rom_config?.[movement?.name];
                    const movementData: any = {
                        movement_name: movement?.name,
                        config: {}
                    };
                    bodyPartConfig?.selected_sides?.forEach((side: any) => {
                        const sideData = movementDataTemp?.[side];
                        if (sideData &&(sideData?.arom || sideData?.prom || sideData?.strength)) {
                            movementData.config[side] = {
                                arom: sideData?.arom,
                                prom: sideData?.prom,
                                strength: sideData?.strength,
                            }
                        }
                    });
                    if(movementDataTemp?.comments){
                        movementData.config.comments = movementDataTemp?.comments;
                    }
                    if(movementDataTemp?.commentsTemp){
                        movementData.config.commentsTemp = movementDataTemp?.commentsTemp;
                    }
                    if(Object.keys(movementData.config).length > 0) {
                        bodyPartData.rom_config.push(movementData);
                    }
                });
                if(bodyPartData?.rom_config?.length > 0){
                    config.push(bodyPartData);
                }
            });
            setSubmitting(true);
            CommonService._chartNotes.SaveMedicalInterventionROMConfigAPICall(medicalInterventionId, {config})
                .then((response: any) => {
                    CommonService._alert.showToast(response.message || 'Saved ROM information', 'success');
                    // (medicalRecordId && medicalInterventionId) && navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + `?last_position=${last_position}`);

                })
                .catch((error: any) => {
                    CommonService.handleErrors(error.error || error.errors || 'Error saving ROM configuration', 'error');
                }).finally(() => {
                setSubmitting(false);
            });
        } else {
            CommonService._alert.showToast('Please select a medical intervention', 'error');
        }
    }, [medicalInterventionId, medicalRecordId, navigate, last_position]);

    const handleBodyPartDelete = useCallback((bodyPartId: string) => {
        if (medicalInterventionId) {
            CommonService.onConfirm({
                image: ImageConfig.ConfirmationLottie,
                showLottie: true,
                confirmationTitle: "REMOVE BODY PART",
                confirmationSubTitle: "Are you sure you want to remove this body part?",
            }).then(() => {
                setIsBodyPartBeingDeleted(true);
                CommonService._chartNotes.DeleteBodyPartUnderMedicalInterventionROMConfigAPICall(medicalInterventionId, bodyPartId)
                    .then((response: any) => {
                        CommonService._alert.showToast(response.message, 'success');
                        setIsBodyPartBeingDeleted(false);
                        // remove body part from global rom config and rom form values
                        const romConfig = globalRomConfig?.filter((item: any) => item?.body_part?._id !== bodyPartId);
                        setGlobalRomConfig(romConfig);
                        const romFormValuesTemp = {...romFormValues};
                        delete romFormValuesTemp[bodyPartId];
                        setRomFormValues(romFormValuesTemp);
                    })
                    .catch((error: any) => {
                        CommonService._alert.showToast(error.error || error.errors || 'Error deleting body part', 'error');
                        setIsBodyPartBeingDeleted(false);
                    });
            });
        }
    }, [globalRomConfig, romFormValues, medicalInterventionId]);

    // const openBodySideSelectionModal = useCallback((bodyPart: IBodyPart) => {
    //     setSelectedBodyPartForSideSelection({
    //         ...bodyPart,
    //         tempSelectedSides: _.cloneDeep(romFormValues?.[bodyPart?._id]?.selected_sides) || []
    //     });
    //     setIsBodySidesModalOpen(true);
    // }, [romFormValues]);

    const closeBodySideSelectionModal = useCallback(() => {
        setSelectedBodyPartForSideSelection(undefined);
        setIsBodySidesModalOpen(false);
    }, []);

    const handleBodySideSelect = useCallback((isSelected: boolean, bodySide: string) => {
        if (isSelected) {
            setSelectedBodyPartForSideSelection({
                ...selectedBodyPartForSideSelection,
                tempSelectedSides: [...selectedBodyPartForSideSelection?.tempSelectedSides, bodySide]
            });
        } else {
            setSelectedBodyPartForSideSelection({
                ...selectedBodyPartForSideSelection,
                tempSelectedSides: selectedBodyPartForSideSelection?.tempSelectedSides?.filter((item: string) => item !== bodySide)
            });
        }
    }, [selectedBodyPartForSideSelection]);

    const addBodySideToForm = useCallback((bodyPart: any, bodySide: string) => {
        // add body side to rom form values and update table config under body part
        setRomFormValues((prevValues: any) => {
            const bodyPartConfig = prevValues?.[bodyPart?._id];
            const tableConfig = _.cloneDeep(bodyPartConfig?.tableConfig);
            if (bodyPartConfig) {
                const commentsColumn = tableConfig[tableConfig?.length - 1];
                tableConfig[tableConfig?.length - 1] = generateRomConfigForBodySide(bodyPart, bodySide);
                tableConfig.push(commentsColumn);
            }
            return {
                ...prevValues,
                [bodyPart?._id]: {
                    ...bodyPartConfig,
                    selected_sides: [...bodyPartConfig?.selected_sides, bodySide],
                    tableConfig
                }
            }
        });
    }, [generateRomConfigForBodySide]);

    const removeBodySideFromForm = useCallback((bodyPart: any, bodySide: string) => {
        // remove body side from rom form values and update table config under body part
        setRomFormValues((prevValues: any) => {
            const bodyPartConfig = prevValues?.[bodyPart?._id];
            const tableConfig = _.cloneDeep(bodyPartConfig?.tableConfig);
            const updatedTableConfig = tableConfig?.filter((column: any) => column?.title !== bodySide);
            return {
                ...prevValues,
                [bodyPart?._id]: {
                    ...bodyPartConfig,
                    selected_sides: bodyPartConfig?.selected_sides?.filter((item: string) => item !== bodySide),
                    tableConfig: updatedTableConfig
                }
            }
        });
    }, []);

    const handleBodySideSelectConfirm = useCallback(() => {
        selectedBodyPartForSideSelection?.tempSelectedSides?.forEach((bodySide: string) => {
            if (!selectedBodyPartForSideSelection?.selected_sides?.includes(bodySide)) {
                addBodySideToForm(selectedBodyPartForSideSelection, bodySide);
            }
        });
        selectedBodyPartForSideSelection.selected_sides.forEach((bodySide: string) => {
            if (!selectedBodyPartForSideSelection?.tempSelectedSides?.includes(bodySide)) {
                removeBodySideFromForm(selectedBodyPartForSideSelection, bodySide);
            }
        });
        closeBodySideSelectionModal();
        setSelectedBodyPartForSideSelection(undefined);
    }, [closeBodySideSelectionModal, selectedBodyPartForSideSelection, addBodySideToForm, removeBodySideFromForm]);

    const handleBodySideSelectCancel = useCallback(() => {
        closeBodySideSelectionModal();
    }, [closeBodySideSelectionModal]);

    return (
        <div className={'medical-intervention-rom-config-v2-screen'}>
            <PageHeaderComponent title={'Range of Motion and Strength'}/>
            <MedicalRecordBasicDetailsCardComponent onEditCompleteAction={onEditSuccess}/>
            <>
                {/*{*/}
                {/*    (isMedicalInterventionDetailsLoading) && <>*/}
                {/*        <LoaderComponent/>*/}
                {/*    </>*/}
                {/*}*/}
                {
                    (isMedicalInterventionDetailsLoaded && medicalInterventionId) && <>
                        {
                            (globalRomConfig?.length === 0) && <>
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
                            (globalRomConfig?.length > 0) && <>
                                <Formik
                                    initialValues={romFormValues}
                                    enableReinitialize={true}
                                    onSubmit={handleROMConfigSave}
                                >
                                    {(formik) => {
                                        const {validateForm, values, isValid, setFieldValue, isSubmitting} = formik;
// eslint-disable-next-line react-hooks/rules-of-hooks
                                        useEffect(() => {
                                            validateForm();
                                            setRomFormValues(values);
                                        }, [validateForm, values]);
                                        return (
                                            <Form className="t-form" noValidate={true}>
                                                {/*<FormDebuggerComponent form={formik}/>*/}
                                                <div>
                                                    {
                                                        Object.keys(values)?.map((bodyPartId: any) => {
                                                            const bodyPart = values[bodyPartId];
                                                            return (
                                                                <div className={'body-part-rom-config-card-wrapper'}>
                                                                    {
                                                                        bodyPart?.movements?.length > 0 && <>

                                                                            <CardComponent
                                                                                title={"Body Part: " + bodyPart?.name}
                                                                                className={'body-part-rom-config-card'}
                                                                                key={bodyPartId}
                                                                                actions={<>
                                                                                    {bodyPart?.movements?.length > 0 &&
                                                                                        <>
                                                                                            {
                                                                                                (mode === 'read') && <>
                                                                                                    <ButtonComponent
                                                                                                        size={"small"}
                                                                                                        prefixIcon={
                                                                                                            <ImageConfig.EditIcon/>}
                                                                                                        // onClick={handleBodyPartEdit}
                                                                                                        // disabled={isSubmitting || isBodyPartBeingDeleted}
                                                                                                    >
                                                                                                        Edit
                                                                                                    </ButtonComponent>&nbsp;&nbsp;
                                                                                                </>
                                                                                            }
                                                                                            {/*{*/}
                                                                                            {/* (mode === 'write') &&*/}
                                                                                            {/* <>*/}
                                                                                            {/* <ButtonComponent*/}
                                                                                            {/* size={"small"}*/}
                                                                                            {/* prefixIcon={*/}
                                                                                            {/* <ImageConfig.AddIcon/>}*/}
                                                                                            {/* onClick={() => {*/}
                                                                                            {/* openBodySideSelectionModal(bodyPart);*/}
                                                                                            {/* }*/}
                                                                                            {/* }*/}
                                                                                            {/* >*/}
                                                                                            {/* Add Body Side*/}
                                                                                            {/* </ButtonComponent>&nbsp;&nbsp;*/}
                                                                                            {/* </>*/}
                                                                                            {/*}*/}
                                                                                        </>
                                                                                    }
                                                                                    <ButtonComponent
                                                                                        size={"small"}
                                                                                        color={"error"}
                                                                                        variant={"outlined"}
                                                                                        prefixIcon={
                                                                                            <ImageConfig.DeleteIcon/>}
                                                                                        onClick={() => {
                                                                                            handleBodyPartDelete(bodyPartId);
                                                                                        }}
                                                                                        disabled={isSubmitting || isBodyPartBeingDeleted}
                                                                                    >
                                                                                        Delete
                                                                                    </ButtonComponent>
                                                                                </>}>
                                                                                <div className={'body-part-rom-config'}>
                                                                                    {/*{*/}
                                                                                    {/* (!bodyPart?.movements || bodyPart?.movements?.length === 0) && <>*/}
                                                                                    {/* <StatusCardComponent*/}
                                                                                    {/* title={"The following body part does not have any Range of Motion or Strength " +*/}
                                                                                    {/* " measurements. \n Please choose another body part."}/>*/}
                                                                                    {/* </>*/}
                                                                                    {/*}*/}
                                                                                    {
                                                                                        (bodyPart?.movements?.length > 0) && <>
                                                                                            <div
                                                                                                className={'rom-config-table-container'}>
                                                                                                <TableComponent
                                                                                                    data={bodyPart?.movements || []}
                                                                                                    bordered={true}
                                                                                                    canExpandRow={() => true}
                                                                                                    columns={bodyPart?.tableConfig}
                                                                                                />
                                                                                            </div>
                                                                                        </>
                                                                                    }
                                                                                </div>
                                                                                {
                                                                                    bodyPart?.movements?.map((movement: any) => {
                                                                                        if (showROMMovementCommentsModal && selectedBodyPartForComments?._id === bodyPartId && movement?.name === selectedROMMovementComments?.name) {
                                                                                            return <ModalComponent
                                                                                                key={bodyPartId + movement?.name}
                                                                                                isOpen={showROMMovementCommentsModal}
                                                                                                title={`${values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.comments ? "Edit Comments" : "Comments:"}`}
                                                                                                closeOnBackDropClick={true}
                                                                                                className={"intervention-comments-modal"}
                                                                                                modalFooter={<>
                                                                                                    <ButtonComponent
                                                                                                        variant={"outlined"}
                                                                                                        onClick={() => {
                                                                                                            const comment = values?.[bodyPart._id]?.rom_config?.[selectedROMMovementComments?.name]?.comments;
                                                                                                            setShowROMMovementCommentsModal(false);
                                                                                                            setFieldValue(`${bodyPart._id}.rom_config.${selectedROMMovementComments?.name}.commentsTemp`, comment);
                                                                                                            setSelectedBodyPartForComments(undefined);
                                                                                                            setSelectedROMMovementComments(undefined);
                                                                                                        }}>
                                                                                                        Cancel
                                                                                                    </ButtonComponent>&nbsp;
                                                                                                    <ButtonComponent
                                                                                                        className={'mrg-left-15'}
                                                                                                        onClick={() => {
                                                                                                            const newComment = values?.[bodyPart._id]?.rom_config?.[selectedROMMovementComments?.name]?.commentsTemp;
                                                                                                            setShowROMMovementCommentsModal(false);
                                                                                                            setFieldValue(`${bodyPart._id}.rom_config.${selectedROMMovementComments?.name}.comments`, newComment);
                                                                                                            setSelectedBodyPartForComments(undefined);
                                                                                                            setSelectedROMMovementComments(undefined);
                                                                                                        }}>
                                                                                                        {
                                                                                                            values?.[bodyPart._id]?.rom_config?.[selectedROMMovementComments?.name]?.comments ? "Save" : "Add"
                                                                                                        }
                                                                                                    </ButtonComponent>
                                                                                                </>
                                                                                                }>
                                                                                                <div className={'clear-cta'}
                                                                                                     onClick={() => setFieldValue(`${bodyPart._id}.rom_config.${selectedROMMovementComments?.name}.commentsTemp`, '')}>Clear
                                                                                                </div>
                                                                                                <Field
                                                                                                    name={`${bodyPart._id}.rom_config.${selectedROMMovementComments?.name}.commentsTemp`}
                                                                                                    className="t-form-control">
                                                                                                    {
                                                                                                        (field: FieldProps) => (
                                                                                                            <FormikTextAreaComponent
                                                                                                                label={selectedROMMovementComments?.name}
                                                                                                                placeholder={"Enter your comments here..."}
                                                                                                                formikField={field}
                                                                                                                size={"small"}
                                                                                                                autoFocus={true}
                                                                                                                fullWidth={true}
                                                                                                            />
                                                                                                        )
                                                                                                    }
                                                                                                </Field>
                                                                                            </ModalComponent>
                                                                                        } else {
                                                                                            return <></>
                                                                                        }
                                                                                    })
                                                                                }
                                                                            </CardComponent>
                                                                        </>}
                                                                </div>

                                                            );
                                                        })
                                                    }
                                                </div>
                                                <div>
                                                    <ButtonComponent
                                                        prefixIcon={<ImageConfig.AddIcon/>}
                                                        onClick={handleAddNewBodyPartOpenModal}
                                                    >
                                                        Add Body Part
                                                    </ButtonComponent>

                                                </div>
                                                <div className={"h-v-center"}>
                                                    <ButtonComponent
                                                        type={"submit"}
                                                        size={'large'}
                                                        className={'save-rom-config-button'}
                                                        isLoading={isSubmitting}
                                                        disabled={!isValid}
                                                    >
                                                        Save
                                                    </ButtonComponent>
                                                </div>

                                            </Form>
                                        );
                                    }}
                                </Formik>
                            </>
                        }
                    </>
                }
            </>
            <ModalComponent isOpen={isBodySidesModalOpen}
                            title={"Add Body Side:"}
                            className={"intervention-body-side-selection-modal"}
                            modalFooter={<div className={'mrg-top-50'}>
                                <ButtonComponent
                                    onClick={handleBodySideSelectCancel}
                                    variant={"outlined"}
                                >
                                    Cancel
                                </ButtonComponent>&nbsp;&nbsp;
                                <ButtonComponent
                                    className={'mrg-left-15'}
                                    onClick={handleBodySideSelectConfirm}>
                                    Update Sides
                                </ButtonComponent>
                            </div>}
            >
                <div className={'body-side-modal'}>
                    <>
                        {
                            selectedBodyPartForSideSelection?.sides?.map((side: any, index: number) => {
                                return <CheckBoxComponent
                                    label={side}
                                    key={index + side}
                                    // disabled={selectedBodyPartForSideSelection?.selected_sides?.includes(side)}
                                    checked={selectedBodyPartForSideSelection?.tempSelectedSides?.includes(side)}
                                    onChange={(isChecked) => {
                                        handleBodySideSelect(isChecked, side);
                                    }
                                    }
                                />
                            })
                        }
                    </>
                </div>
            </ModalComponent>
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
                                     className={'mrg-left-15'}
                                     disabled={!selectedBodyPartsToBeAdded}
                    >
                        Add
                    </ButtonComponent>
                </>}
            >
                <div className="ts-row">
                    {bodyPartList.map((item: any, index: number) => (
                        item?.movements?.length > 0 && (
                            <div className="ts-col-md-6 ts-col-lg-3" key={item._id}>
                                <CheckBoxComponent
                                    name={`intervention-rom-config-add-body-part-${item._id}`}
                                    label={item?.name}
                                    checked={selectedBodyPartsToBeAdded.some((selectedItem) => selectedItem._id === item._id)}
                                    disabled={globalRomConfig.some((bodyPart) => bodyPart.body_part._id === item._id)}
                                    onChange={() => {
                                        const isSelected = selectedBodyPartsToBeAdded.some((selectedItem) => selectedItem._id === item._id);
                                        if (isSelected) {
                                            // Remove the item from the selected items
                                            setSelectedBodyPartsToBeAdded((prevSelected) =>
                                                prevSelected.filter((selectedItem) => selectedItem._id !== item._id)
                                            );
                                        } else {
                                            // Add the item to the selected items
                                            setSelectedBodyPartsToBeAdded((prevSelected) => [...prevSelected, item]);
                                        }
                                    }}
                                />
                            </div>
                        )
                    ))}

                </div>
            </ModalComponent>
        </div>
    );

};

export default MedicalInterventionRomConfigV2Screen;
