import "./MedicalInterventionSpecialTestsV2Screen.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {IBodyPart, IBodyPartSpecialTestConfig} from "../../../shared/models/static-data.model";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import TableComponent from "../../../shared/components/table/TableComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {CommonService} from "../../../shared/services";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import _ from "lodash";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";

interface MedicalInterventionSpecialTestV2ScreenProps {

}

const SPECIAL_TEST_CONFIG_INITIAL_VALUES = {
    config: {}
}

// const SPECIAL_TEST_APPLICABLE_BODY_SIDES = ['Left', 'Right', 'Central'];

const INITIAL_SPECIAL_TEST_FILTER_STATE = {
    search: "",
}

const MedicalInterventionSpecialTestV2Screen = (props: MedicalInterventionSpecialTestV2ScreenProps) => {

    const dispatch = useDispatch();
    const {
        medicalInterventionDetails,
        isMedicalInterventionDetailsLoaded,
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const {bodyPartList} = useSelector((state: IRootReducerState) => state.staticData);
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [globalSpecialTestConfig, setGlobalSpecialTestConfig] = useState<IBodyPartSpecialTestConfig[]>([]);
    const [specialTestFormValues, setSpecialTestFormValues] = useState<any>(SPECIAL_TEST_CONFIG_INITIAL_VALUES);
    const [selectedBodyPartForSpecialTestSelection, setSelectedBodyPartForSpecialTestSelection] = useState<any>(undefined);
    const [mode] = useState<'read' | 'write'>('write');
    const [showSpecialTestForCommentsModal, setShowSpecialTestForCommentsModal] = useState<boolean>(false);
    const [selectedBodyPartForComments, setSelectedBodyPartForComments] = useState<any>(undefined);
    const [selectedSpecialTestForComments, setSelectedSpecialTestForComments] = useState<any>(undefined);
    const [isBodyPartBeingDeleted, setIsBodyPartBeingDeleted] = useState<boolean>(false);
    const [isAddSpecialTestDrawerOpen, setIsAddSpecialTestDrawerOpen] = useState<boolean>(false);
    const [showAddBodyPartModal, setShowAddBodyPartModal] = useState<boolean>(false);
    const [selectedBodyPartsToBeAdded, setSelectedBodyPartsToBeAdded] = useState<any[]>([]);
    const [specialTestsFilterState, setSpecialTestsFilterState] = useState<any>(INITIAL_SPECIAL_TEST_FILTER_STATE); // {body_part_id: {selected_sides: [], special_tests: []}}
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const last_position: any = searchParams.get("last_position");
    // const [bodyPartSelectedTest, setBodyPartSelectedTest] = useState<any>(undefined);

    const handleBodySideSelect = useCallback((isSelected: boolean, specialTest: string) => {
        if (isSelected) {
            setSelectedBodyPartForSpecialTestSelection({
                ...selectedBodyPartForSpecialTestSelection,
                tempSelectedSpecialTests: [...selectedBodyPartForSpecialTestSelection?.tempSelectedSpecialTests, specialTest]
            });
        } else {
            setSelectedBodyPartForSpecialTestSelection({
                ...selectedBodyPartForSpecialTestSelection,
                tempSelectedSpecialTests: selectedBodyPartForSpecialTestSelection?.tempSelectedSpecialTests?.filter((item: string) => item !== specialTest)
            });
        }
    }, [selectedBodyPartForSpecialTestSelection]);

    const specialTestSelectionColumns = useMemo(() => [
        {
            title: 'Special Tests',
            key: 'special_tests',
            width: '100',
            render: (record: any) => {
                return <div className="body-part-special-tests">
                    <CheckBoxComponent
                        label={record.name}
                        checked={selectedBodyPartForSpecialTestSelection?.tempSelectedSpecialTests?.includes(record.name)}
                        onChange={(isChecked: boolean) => {
                            handleBodySideSelect(isChecked, record?.name);
                        }}
                    />

                </div>
            }
        },
    ], [selectedBodyPartForSpecialTestSelection, handleBodySideSelect]);

    const handleCheckBoxChange = (formik: any, groupName: string, selectedValue: any, options: any[]) => {
        return (isChecked: boolean) => {
            console.log(groupName, ' ::: ', selectedValue, isChecked, formik);
            // console.log(formik.form.values[groupName+'.result'], 'formik.form.values[groupName]')
            const result = {...(formik.form.values[groupName + '.result'] || {})};

            for (const item of options) {
                console.log(item.code, ' ::: ', item);
                const key = item.code;
                if (key === selectedValue) {
                    // Set the value of the selected checkbox
                    result[key] = isChecked;
                    formik.form.setFieldValue(`${groupName}.result.${key}`, isChecked);
                } else {
                    // Clear other checkboxes in the same group
                    result[key] = false;
                    formik.form.setFieldValue(`${groupName}.result.${key}`, false);
                }
            }
            formik.form.setFieldValue(`${groupName}.result`, result);
        };
    };


    const generateSpecialTestForBodySide = useCallback((bodyPart: any, side: string) => {
                return {
                    key: bodyPart._id + side,
                    width: 176,
                    title: (record: any) => {
                        return <Field
                            name={`${bodyPart._id}.special_test_config.${record}.${side}.side`}
                            className="t-form-control">
                            {
                                (field: FieldProps) => (
                                    <div className={'special-test-table-body-side-wrapper'}>
                                        <div className={'special-test-table-body-side'}>
                                            {side} Side
                                        </div>
                                        {/*    <IconButtonComponent onClick={() => {*/}
                                        {/*    const specialTestConfig = _.get(field.form.values, `${bodyPart._id}.special_test_config`);*/}
                                        {/*    Object.keys(specialTestConfig).forEach((specialTest: any) => {*/}
                                        {/*        if (specialTestConfig[specialTest][side]) {*/}
                                        {/*            specialTestConfig[specialTest][side].result = undefined;*/}
                                        {/*        }*/}
                                        {/*    });*/}
                                        {/*    field.form.setFieldValue(`${bodyPart._id}.special_test_config`, specialTestConfig);*/}
                                        {/*}*/}
                                        {/*}>*/}
                                        {/*    <ImageConfig.ReStartIcon/>*/}
                                        {/*</IconButtonComponent>*/}
                                        <div className={'special-test-table-body-side-indicators'}>
                                            {
                                                CommonService._staticData.SpecialTestResultOptions.map((option: any) => (
                                                    <div>
                                                        {
                                                            option?.title
                                                        }
                                                    </div>
                                                ))

                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </Field>;
                    },
                    // align: 'center',
                    // render: (record: any) => {
                    //     return <Field
                    //         name={`${bodyPart._id}.special_test_config.${record}.${side}.result`}
                    //         className="t-form-control">
                    //         {
                    //             (field: FieldProps) => (
                    //                 <FormikRadioButtonGroupComponent
                    //                     formikField={field}
                    //                     direction={"row"}
                    //                     options={CommonService._staticData.SpecialTestResultOptions}
                    //                 />
                    //             )
                    //         }
                    //     </Field>;
                    // }
                    align: 'center',
                    render: (record: any) => {
                        return (
                            <Field name={`${bodyPart._id}.special_test_config.${record}.${side}.result`}
                                   className="t-form-control">
                                {(field: FieldProps) => (
                                    <div className={'special-test-table-body-side-checkboxes'}>
                                        {CommonService._staticData.SpecialTestResultOptions.map((option: any) => (
                                            <Field
                                                key={option.value}
                                                name={`${bodyPart._id}.special_test_config.${record}.${side}.result.${option.code}`}
                                                className={'mrg-left-25'}
                                            >
                                                {(innerField: FieldProps) => (
                                                    <FormikCheckBoxComponent
                                                        formikField={innerField}
                                                        label={''}
                                                        key={option.value}
                                                        onChange={handleCheckBoxChange(field, `${bodyPart._id}.special_test_config.${record}.${side}`, option.code, CommonService._staticData.SpecialTestResultOptions)}
                                                    />
                                                )}
                                            </Field>
                                        ))}
                                    </div>
                                )}
                            </Field>
                        );
                    }
                }
            }, []
        )
    ;

    const generateSpecialTestConfigColumns = useCallback((bodyPart: IBodyPart, selectedBodySides: any) => {
        const columns: any = [
            {
                title: 'Test Name',
                key: 'name',
                width: 204,
                fixed: 'left',
                render: (record: any) => {
                    return <div className="movement-name">
                        {record}
                    </div>
                }
            }
        ];
        selectedBodySides?.forEach((side: any) => {
            columns.push(generateSpecialTestForBodySide(bodyPart, side));
        });
        columns.push({
            title: 'Comments',
            key: 'comments',
            align: 'center',
            width: 506,
            render: (record: any, index: any) => <Field
                name={`${bodyPart._id}.special_test_config.${record}.comments`}
                className="t-form-control">
                {
                    (field: FieldProps) => (
                        <>
                            {
                                mode === 'write' && <>
                                    {
                                        field.form?.values[bodyPart._id]?.special_test_config?.[record]?.comments && <>
                                            <ToolTipComponent position={'bottom'}
                                                              tooltip={field.form?.values[bodyPart._id]?.special_test_config?.[record]?.comments}>
                                                <div className="movement-comment">
                                                    {field.form?.values[bodyPart._id]?.special_test_config?.[record]?.comments.length > 60 ? field.form?.values[bodyPart._id]?.special_test_config?.[record]?.comments.substring(0, 60) + '...' : field.form?.values[bodyPart._id]?.special_test_config?.[record]?.comments}
                                                </div>
                                            </ToolTipComponent>
                                            &nbsp;
                                            <IconButtonComponent
                                                onClick={() => {
                                                    setShowSpecialTestForCommentsModal(true);
                                                    setSelectedBodyPartForComments(bodyPart);
                                                    setSelectedSpecialTestForComments(record);
                                                }}>
                                                <ImageConfig.EditIcon/>
                                            </IconButtonComponent>
                                        </>
                                    }
                                    {
                                        !field.form?.values[bodyPart._id]?.special_test_config?.[record]?.comments &&
                                        <>
                                            <ButtonComponent
                                                variant={"text"}
                                                prefixIcon={<ImageConfig.AddIcon/>}
                                                disabled={
                                                    !selectedBodySides?.some((side: any) => {
                                                        return field.form?.values[bodyPart._id]?.special_test_config?.[record]?.[side]?.result;
                                                    })
                                                }
                                                onClick={() => {
                                                    setShowSpecialTestForCommentsModal(true);
                                                    setSelectedBodyPartForComments(bodyPart);
                                                    setSelectedSpecialTestForComments(record);
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
                                    tooltip={field.form?.values[bodyPart._id]?.special_test_config?.[record]?.comments}>
                                    <div className="movement-comment">
                                        {field.form?.values[bodyPart._id]?.special_test_config?.[record]?.comments || "N/A"}
                                    </div>
                                </ToolTipComponent>
                            }
                        </>
                    )
                }
            </Field>
        });
        columns.push({
            title: '',
            key: 'actions',
            align: 'center',
            width: 40,
            render: (record: any, index: any) => <Field
                name={`${bodyPart._id}.special_test_config.${record}.actions`}
                className="t-form-control">
                {
                    (field: FieldProps) => (
                        <>
                            <IconButtonComponent
                                color={"error"}
                                onClick={() => {
                                    const special_test_config = field.form?.values[bodyPart._id]?.special_test_config;
                                    const new_special_test_config = _.cloneDeep(special_test_config);
                                    delete new_special_test_config[record];
                                    field.form?.setFieldValue(`${bodyPart._id}.special_test_config`, new_special_test_config);
                                }}
                            >
                                <ImageConfig.DeleteIcon/>
                            </IconButtonComponent>
                        </>
                    )
                }
            </Field>
        });
        return columns;
    }, [mode, generateSpecialTestForBodySide]);

    const generateSpecialTestConfigForAnInjury = useCallback((bodyPart: IBodyPart, selectedBodySides: any, special_test_config: any) => {
        const bodyPartConfig: any = _.cloneDeep(bodyPart);
        if (special_test_config && special_test_config?.length > 0) {
            bodyPartConfig.special_tests_selected = special_test_config?.map((special_test: any, index: number) => {
                const special_test_data = special_test_config?.find((test: any) => test?.name === special_test.name);
                return {name: special_test.name, ...special_test_data, comments: "", commentsTemp: ""};
            });
        } else {
            bodyPartConfig.special_tests_selected = [];
        }
        bodyPartConfig.tableConfig = generateSpecialTestConfigColumns(bodyPartConfig, selectedBodySides);
        bodyPartConfig['special_test_config'] = {};
        bodyPartConfig.special_tests_selected?.forEach((special_test: any) => {
            const config = special_test?.config;
            bodyPartConfig['special_test_config'][special_test.name] = {
                comments: config?.comments,
                commentsTemp: config?.commentsTemp || config?.comments,
            };
            selectedBodySides?.forEach((side: any) => {
                if (special_test.config && Object.keys(special_test.config).includes(side)) {
                    const configSideData = special_test?.config[side];
                    const result: any = {};
                    CommonService._staticData.SpecialTestResultOptions.forEach(value => {
                        result[value.code] = value.code === configSideData?.result;
                    })
                    bodyPartConfig['special_test_config'][special_test.name][side] = {
                        result
                    }
                }
            });
        });
        return bodyPartConfig;
    }, [generateSpecialTestConfigColumns]);

    const buildSpecialTestConfig = useCallback((specialTestConfig: any) => {
        const config: any = {};
        specialTestConfig?.forEach((bodyPart: any) => {
            console.log(bodyPart);
            config[bodyPart?.body_part?._id] = generateSpecialTestConfigForAnInjury(bodyPart?.body_part, bodyPart?.selected_sides, bodyPart?.special_test_config);
        });
        setSpecialTestFormValues(config);
    }, [generateSpecialTestConfigForAnInjury]);

    const handleAddNewBodyPartOpenModal = useCallback(() => {
        setShowAddBodyPartModal(true);
        setSelectedBodyPartsToBeAdded([]);
    }, []);


    const handleAddNewBodyPart = useCallback(() => {
        setShowAddBodyPartModal(false);
        const updatedGlobalRomConfig: any = [...globalSpecialTestConfig];
        for (const selectedBodyPart of selectedBodyPartsToBeAdded) {
            console.log(selectedBodyPart);
            updatedGlobalRomConfig.push({
                body_part: selectedBodyPart,
                rom_config: [],
                selected_sides: [...selectedBodyPart?.special_test_applicable_sides],
                mode: 'write'
            });
        }
        setGlobalSpecialTestConfig(updatedGlobalRomConfig);

        const specialTestFormValuesCopy = _.cloneDeep(specialTestFormValues);
        for (const selectedBodyPart of selectedBodyPartsToBeAdded) {
            specialTestFormValuesCopy[selectedBodyPart._id] = generateSpecialTestConfigForAnInjury(
                selectedBodyPart,
                [...selectedBodyPart?.special_test_applicable_sides],
                []
            );
        }
        setSpecialTestFormValues(specialTestFormValuesCopy);

        setSelectedBodyPartsToBeAdded([]); // Clear the selected items
    }, [specialTestFormValues, globalSpecialTestConfig, selectedBodyPartsToBeAdded, generateSpecialTestConfigForAnInjury]);


    useEffect(() => {
        if (medicalInterventionId && !medicalInterventionDetails) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, medicalInterventionDetails, dispatch]);

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
        const specialTestConfig: any = [];
        const special_test_config = medicalInterventionDetails?.special_tests;
        const injury_details = medicalInterventionDetails?.medical_record_details?.injury_details;
        if (special_test_config?.length > 0) {
            special_test_config?.forEach((injury: any) => {
                const configArray = injury?.special_tests || [];
                const finalConfigArray: any = [];
                configArray?.forEach((config: any) => {
                    const configData = config?.config;
                    const configDataKeys = Object.keys(configData);
                    console.log(configDataKeys);
                    console.log(config);
                    console.log(configData);
                    // console.log(config[configDataKeys]);
                    finalConfigArray['result'] =
                        {
                            configDataKeys: config[configData?.result]
                        };

                });
                if (!specialTestConfig?.find((item: any) => item?.body_part?._id === injury?.body_part_id)) {
                    specialTestConfig.push({
                        body_part: injury?.body_part_details,
                        special_test_config: injury?.special_tests || [],
                        selected_sides: injury?.body_part_details?.special_test_applicable_sides,
                        mode: 'write'
                    });
                    // } else {
                    //     const bodyPart = specialTestConfig?.find((item: any) => item?.body_part?._id === injury?.body_part_id);
                    //     bodyPart.selected_sides.push(injury.body_side);
                }
            });
        } else {
            if (injury_details?.length > 0) {

                injury_details?.forEach((injury: any) => {
                    console.log(specialTestConfig)
                    console.log(injury)
                    if (!specialTestConfig?.find((item: any) => item?.body_part?._id === injury?.body_part_id)) {
                        specialTestConfig.push({
                            body_part: injury?.body_part_details,
                            special_test_config: [],
                            selected_sides: injury?.body_part_details?.special_test_applicable_sides,
                            mode: 'write'
                        });
                        // } else {
                        //     const bodyPart = specialTestConfig.find((item: any) => item?.body_part?._id === injury?.body_part_id);
                        //     bodyPart.selected_sides.push(injury.body_side);
                    }
                });
            }
        }
        setGlobalSpecialTestConfig(specialTestConfig);
        buildSpecialTestConfig(specialTestConfig);
    }, [medicalInterventionDetails, buildSpecialTestConfig]);

    const handleSpecialTestConfigSave = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        if (medicalInterventionId) {
            const config: any = [];
            Object.keys(values).forEach((bodyPartId: string) => {
                const bodyPartConfig = values[bodyPartId];
                const bodyPartData: any = {
                    body_part_id: bodyPartId,
                    special_tests: []
                };
                const special_test_config = bodyPartConfig?.special_test_config;
                console.log(special_test_config);
                Object.keys(special_test_config).forEach((special_test_name: string) => {
                    const specialTestConfig = special_test_config[special_test_name];
                    const config: any = {};
                    if (specialTestConfig?.commentsTemp) {
                        config.comments = specialTestConfig?.commentsTemp;
                    }
                    if (specialTestConfig?.comments) {
                        config.comments = specialTestConfig?.comments;
                    }
                    Object.keys(specialTestConfig).forEach((side: any) => {
                        if (side === 'commentsTemp') return;
                        if (side === 'comments') return;
                        const resultKeys = Object?.keys(specialTestConfig[side]?.result);
                        const result = resultKeys.find((key) => specialTestConfig[side]?.result[key] === true);
                        if (result) {
                            config[side] = {
                                result: result
                            }
                        }
                    });
                    if (Object.keys(config).length > 0) {
                        bodyPartData.special_tests.push({
                            name: special_test_name,
                            config,
                        });
                    }
                });
                if (bodyPartData?.special_tests?.length > 0) {
                    config.push(bodyPartData);
                }
            });
            setSubmitting(true);
            CommonService._chartNotes.SaveMedicalInterventionSpecialTestAPICall(medicalInterventionId, {config})
                .then((response: any) => {
                    // CommonService._alert.showToast(response.message || 'Saved Special Test information', 'success');
                    medicalRecordId && navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + `?last_position=${last_position}`)
                })
                .catch((error: any) => {
                    CommonService.handleErrors(error.error || error.errors || 'Error saving Special Test configuration', 'error');
                }).finally(() => {
                setSubmitting(false);
            });
        } else {
            CommonService._alert.showToast('Please select a medical intervention', 'error');
        }
    }, [medicalInterventionId, last_position, medicalRecordId, navigate]);

    const handleBodyPartDelete = useCallback((bodyPartId: string) => {
        if (medicalInterventionId) {
            CommonService.onConfirm({
                image: ImageConfig.ConfirmationLottie,
                showLottie: true,
                confirmationTitle: "REMOVE BODY PART",
                confirmationSubTitle: "Are you sure you want to remove this body part?",
            }).then(() => {
                setIsBodyPartBeingDeleted(true);
                CommonService._chartNotes.DeleteBodyPartUnderMedicalInterventionSpecialTestAPICall(medicalInterventionId, bodyPartId)
                    .then((response: any) => {
                        // CommonService._alert.showToast(response.message, 'success');
                        setIsBodyPartBeingDeleted(false);
                        // remove body part from global rom config and rom form values
                        const specialTestConfig = globalSpecialTestConfig?.filter((item: any) => item?.body_part?._id !== bodyPartId);
                        setGlobalSpecialTestConfig(specialTestConfig);
                        const specialTestFormValuesTemp = {...specialTestFormValues};
                        delete specialTestFormValuesTemp[bodyPartId];
                        setSpecialTestFormValues(specialTestFormValuesTemp);
                    })
                    .catch((error: any) => {
                        CommonService._alert.showToast(error.error || error.errors || 'Error deleting body part', 'error');
                        setIsBodyPartBeingDeleted(false);
                    });
            });
        }
    }, [globalSpecialTestConfig, specialTestFormValues, medicalInterventionId]);

    const openAddSpecialTestModal = useCallback((bodyPart: IBodyPart) => {
        setSelectedBodyPartForSpecialTestSelection({
            ...bodyPart,
            tempSelectedSpecialTests: _.cloneDeep(Object.keys(specialTestFormValues?.[bodyPart?._id]?.special_test_config)) || []
        })
        setIsAddSpecialTestDrawerOpen(true);
    }, [specialTestFormValues]);

    const closeAddSpecialTestModal = useCallback(() => {
        setSelectedBodyPartForSpecialTestSelection(undefined);
        setIsAddSpecialTestDrawerOpen(false);
    }, []);

    const addSpecialTestToBodyPart = useCallback((bodyPart: any, test: string) => {
        // add special test to body part
        setSpecialTestFormValues((prevValues: any) => {
            const bodyPartConfig = prevValues?.[bodyPart?._id];
            bodyPartConfig.special_test_config[test] = {};
            return {
                ...prevValues,
                [bodyPart?._id]: {
                    ...bodyPartConfig,
                }
            }
        });
    }, []);

    const removeSpecialTestFromBodyPart = useCallback((bodyPart: any, test: string) => {
        setSpecialTestFormValues((prevValues: any) => {
            const bodyPartConfig = prevValues?.[bodyPart?._id];
            delete bodyPartConfig?.special_test_config[test];
            return {
                ...prevValues,
                [bodyPart?._id]: {
                    ...bodyPartConfig,
                }
            }
        });
    }, []);

    const handleSpecialTestSelectConfirm = useCallback(() => {
        const existingTests = Object.keys(selectedBodyPartForSpecialTestSelection?.special_test_config) || [];
        selectedBodyPartForSpecialTestSelection?.tempSelectedSpecialTests?.forEach((test: string) => {
            if (!existingTests?.includes(test)) {
                addSpecialTestToBodyPart(selectedBodyPartForSpecialTestSelection, test);
            }
        });
        existingTests.forEach((test: string) => {
            if (!selectedBodyPartForSpecialTestSelection?.tempSelectedSpecialTests?.includes(test)) {
                removeSpecialTestFromBodyPart(selectedBodyPartForSpecialTestSelection, test);
            }
        });
        closeAddSpecialTestModal();
        setSelectedBodyPartForSpecialTestSelection(undefined);
    }, [closeAddSpecialTestModal, selectedBodyPartForSpecialTestSelection, addSpecialTestToBodyPart, removeSpecialTestFromBodyPart]);

    // const handleSpecialTestAddSelectCancel = useCallback(() => {
    //     closeAddSpecialTestModal();
    // }, [closeAddSpecialTestModal]);

    return (
        <div className={'medical-intervention-rom-config-v2-screen'}>
            <PageHeaderComponent title={'Special Tests'}/>
            <MedicalRecordBasicDetailsCardComponent/>
            <>
                {
                    (isMedicalInterventionDetailsLoaded && medicalInterventionId) && <>
                        {
                            (globalSpecialTestConfig?.length === 0) && <CardComponent className={'no-body-part-status-wrapper'}>
                                <StatusCardComponent
                                    title={"There are no body parts listed under the Special Tests. Please add a body part."}>
                                    <ButtonComponent
                                        prefixIcon={<ImageConfig.AddIcon/>}
                                        onClick={handleAddNewBodyPartOpenModal}
                                    >
                                        Add Body Part
                                    </ButtonComponent>
                                </StatusCardComponent>
                            </CardComponent>
                        }
                        {
                            (globalSpecialTestConfig?.length > 0) && <>
                                <Formik
                                    initialValues={specialTestFormValues}
                                    enableReinitialize={true}
                                    validateOnChange={false}
                                    validateOnBlur={true}
                                    validateOnMount={true}
                                    onSubmit={handleSpecialTestConfigSave}
                                >
                                    {(formik) => {
                                        const {validateForm, values, isValid, setFieldValue, isSubmitting} = formik;
                                        // eslint-disable-next-line react-hooks/rules-of-hooks
                                        useEffect(() => {
                                            validateForm();
                                            setSpecialTestFormValues(values);
                                        }, [validateForm, values]);
                                        return (
                                            <Form className="t-form" noValidate={true}>
                                                {/*<FormDebuggerComponent form={formik}/>*/}
                                                <div>
                                                    {
                                                        Object.keys(values)?.map((bodyPartId: any) => {
                                                            const bodyPart = values[bodyPartId];
                                                            console.log('bodyPart', bodyPart);
                                                            return (
                                                                <CardComponent
                                                                    title={"Body Part: " + bodyPart?.name}
                                                                    className={'body-part-special-test-config-card'}
                                                                    key={bodyPartId}
                                                                    actions={<>
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
                                                                            {
                                                                                (mode === 'write') &&
                                                                                <>
                                                                                    <ButtonComponent
                                                                                        size={"small"}
                                                                                        prefixIcon={
                                                                                            <ImageConfig.AddIcon/>}
                                                                                        onClick={() => {
                                                                                            openAddSpecialTestModal(bodyPart);
                                                                                        }
                                                                                        }
                                                                                    >
                                                                                        Add Test
                                                                                    </ButtonComponent>&nbsp;&nbsp;
                                                                                </>
                                                                            }
                                                                        </>
                                                                        <ButtonComponent
                                                                            size={"small"}
                                                                            color={"error"}
                                                                            variant={'outlined'}
                                                                            prefixIcon={
                                                                                <ImageConfig.CrossOutlinedIcon/>}
                                                                            onClick={() => {
                                                                                handleBodyPartDelete(bodyPartId);
                                                                            }}
                                                                            disabled={isSubmitting || isBodyPartBeingDeleted}
                                                                        >
                                                                            Remove Body Part
                                                                        </ButtonComponent>
                                                                    </>}>
                                                                    <div className={'body-part-rom-config'}>
                                                                        <div
                                                                            className={'rom-config-table-container'}>
                                                                            <TableComponent
                                                                                data={Object.keys(bodyPart?.special_test_config) || []}
                                                                                bordered={true}
                                                                                columns={bodyPart?.tableConfig}
                                                                                noDataText={"No special tests have been added."}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        Object.keys(bodyPart?.special_test_config)?.map((special_test: any) => {
                                                                            if (showSpecialTestForCommentsModal && selectedBodyPartForComments?._id === bodyPartId && special_test === selectedSpecialTestForComments) {
                                                                                return <ModalComponent
                                                                                    key={bodyPartId + special_test}
                                                                                    isOpen={showSpecialTestForCommentsModal}
                                                                                    title={`${values?.[bodyPart._id]?.[selectedSpecialTestForComments]?.comments ? "Edit Comments" : "Comments:"}`}
                                                                                    closeOnBackDropClick={true}
                                                                                    className={"intervention-comments-modal"}
                                                                                    modalFooter={<>
                                                                                        <ButtonComponent
                                                                                            variant={"outlined"}
                                                                                            onClick={() => {
                                                                                                const comment = values?.[bodyPart._id]?.special_test_config?.[selectedSpecialTestForComments]?.comments;
                                                                                                setShowSpecialTestForCommentsModal(false);
                                                                                                setFieldValue(`${bodyPart._id}.special_test_config.${selectedSpecialTestForComments}.commentsTemp`, comment);
                                                                                                setSelectedBodyPartForComments(undefined);
                                                                                                setSelectedSpecialTestForComments(undefined);
                                                                                            }}>
                                                                                            Cancel
                                                                                        </ButtonComponent>&nbsp;
                                                                                        <ButtonComponent
                                                                                            className={'mrg-left-15'}
                                                                                            onClick={() => {
                                                                                                const newComment = values?.[bodyPart._id]?.special_test_config?.[selectedSpecialTestForComments]?.commentsTemp;
                                                                                                setShowSpecialTestForCommentsModal(false);
                                                                                                setFieldValue(`${bodyPart._id}.special_test_config.${selectedSpecialTestForComments}.comments`, newComment);
                                                                                                setSelectedBodyPartForComments(undefined);
                                                                                                setSelectedSpecialTestForComments(undefined);
                                                                                            }}>
                                                                                            {
                                                                                                values?.[bodyPart._id]?.special_test_config?.[selectedSpecialTestForComments]?.comments ? "Save" : "Add"
                                                                                            }
                                                                                        </ButtonComponent>
                                                                                    </>
                                                                                    }>
                                                                                    <div className={'clear-cta'}
                                                                                         onClick={() => setFieldValue(`${bodyPart._id}.special_test_config.${selectedSpecialTestForComments}.commentsTemp`, '')}>
                                                                                        Clear
                                                                                    </div>
                                                                                    <Field
                                                                                        name={`${bodyPart._id}.special_test_config.${selectedSpecialTestForComments}.commentsTemp`}
                                                                                        className="t-form-control">
                                                                                        {
                                                                                            (field: FieldProps) => (
                                                                                                <FormikTextAreaComponent
                                                                                                    label={selectedSpecialTestForComments}
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

                                                            );
                                                        })
                                                    }
                                                </div>
                                                <ButtonComponent
                                                    prefixIcon={<ImageConfig.AddCircleIcon/>}
                                                    variant={'text'}
                                                    onClick={handleAddNewBodyPartOpenModal}
                                                >
                                                    Add Body Part
                                                </ButtonComponent>
                                                <div className={"h-v-center"}>
                                                    <ButtonComponent
                                                        size={"large"}
                                                        type={"submit"}
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
            <DrawerComponent isOpen={isAddSpecialTestDrawerOpen}
                             onClose={closeAddSpecialTestModal}
                             showClose={true}
            >
                <div className={'add-special-test-drawer'}>
                    <div className={'add-special-test-drawer-title'}>
                        Add Test <span
                        className={'selected-body-part'}>(Body part: {selectedBodyPartForSpecialTestSelection?.name})</span>
                    </div>
                    <SearchComponent label={'Search'}
                                     placeholder={'Search using Test Name'}
                                     value={specialTestsFilterState?.search}
                                     onSearchChange={(value: any) => {
                                         setSpecialTestsFilterState((prevFilterState: any) => {
                                             return {
                                                 ...prevFilterState,
                                                 search: value
                                             }
                                         })
                                     }}
                    />
                    <div className={'add-special-test-drawer-body'}>
                        <TableWrapperComponent
                            url={APIConfig.GET_SPECIAL_TESTS_META_LIST.URL(selectedBodyPartForSpecialTestSelection?._id)}
                            method={"get"}
                            columns={specialTestSelectionColumns}
                            isPaginated={false}
                            extraPayload={specialTestsFilterState}
                        />
                    </div>
                    <div className={'add-special-test-drawer-action'}>
                        <ButtonComponent
                            variant={"contained"}
                            onClick={handleSpecialTestSelectConfirm}
                            fullWidth={true}
                        >
                            Next
                        </ButtonComponent>
                    </div>
                </div>
            </DrawerComponent>
            {/*<ModalComponent isOpen={isAddSpecialTestDrawerOpen}*/}
            {/*                title={"Add Special Tests:"}*/}
            {/*                className={"intervention-special-test-selection-modal"}*/}
            {/*                modalFooter={<div>*/}
            {/*                    <ButtonComponent*/}
            {/*                        onClick={handleSpecialTestAddSelectCancel}*/}
            {/*                        variant={"outlined"}*/}
            {/*                    >*/}
            {/*                        Cancel*/}
            {/*                    </ButtonComponent>&nbsp;&nbsp;*/}
            {/*                    <ButtonComponent*/}
            {/*                        className={'mrg-left-15'}*/}
            {/*                        onClick={handleSpecialTestSelectConfirm}>*/}
            {/*                        Add Test*/}
            {/*                    </ButtonComponent>*/}
            {/*                </div>}*/}
            {/*>*/}
            {/*    <div className={'body-side-modal'}>*/}
            {/*        <div>*/}
            {/*            <div className={'intervention-special-test-selection-modal-title'}>*/}
            {/*                Body Part: {selectedBodyPartForSpecialTestSelection?.name}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <>*/}
            {/*            {*/}
            {/*                selectedBodyPartForSpecialTestSelection?.special_tests?.map((test: string) => {*/}
            {/*                    const name = test;*/}
            {/*                    return <CheckBoxComponent*/}
            {/*                        label={name}*/}
            {/*                        key={name}*/}
            {/*                        checked={selectedBodyPartForSpecialTestSelection?.tempSelectedSpecialTests?.includes(name)}*/}
            {/*                        onChange={(isChecked) => {*/}
            {/*                            handleBodySideSelect(isChecked, name);*/}
            {/*                        }}*/}
            {/*                    />*/}
            {/*                })*/}
            {/*            }*/}
            {/*        </>*/}
            {/*    </div>*/}
            {/*</ModalComponent>*/}
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
                                    disabled={globalSpecialTestConfig.some((bodyPart) => bodyPart.body_part._id === item._id)}
                                    onChange={() => {
                                        const isSelected = selectedBodyPartsToBeAdded.some((selectedItem) => selectedItem._id === item._id);
                                        if (isSelected) {
                                            // Remove the item from the selected items
                                            setSelectedBodyPartsToBeAdded((prevSelected) =>
                                                prevSelected.filter((selectedItem) => selectedItem._id !== item._id)
                                            );
                                        } else {
                                            // Add the item to the selected items
                                            console.log(item)
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

export default MedicalInterventionSpecialTestV2Screen;
