import "./RomConfigComponent.scss";
import {IBodyPart} from "../../../shared/models/static-data.model";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import React, {useCallback, useEffect, useState} from "react";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../../shared/services";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import _ from "lodash";
import {ITableColumn} from "../../../shared/models/table.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import {useDispatch} from "react-redux";
import {
    deleteMedicalInterventionROMConfigForABodyPart,
    updateMedicalInterventionROMConfigForABodyPart
} from "../../../store/actions/chart-notes.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";

interface RomConfigComponentProps {
    mode?: 'read' | 'write';
    medicalInterventionDetails: any;
    medicalInterventionId: string;
    bodyPart: IBodyPart;
    rom_config?: any[];
    selectedBodySides: string[];
    onDelete?: (body_part_id: string) => void;
    onSave?: (body_part_id: string, romConfig: any) => void;
}

interface IROMConfig extends IBodyPart {
    tableConfig: ITableColumn[];
}

const RomConfigComponent = (props: RomConfigComponentProps) => {

    const {
        medicalInterventionId,
        rom_config,
        selectedBodySides,
        bodyPart,
        onDelete,
    } = props;
    const dispatch = useDispatch();
    const [bodySides, setBodySides] = useState<string[]>(selectedBodySides);
    const [romConfigValues, setRomConfigValues] = useState<IROMConfig | any | undefined>({});
    const [showROMMovementCommentsModal, setShowROMMovementCommentsModal] = useState<boolean>(false);
    const [selectedROMMovementComments, setSelectedROMMovementComments] = useState<any>(undefined);
    const [isBodyPartBeingDeleted, setIsBodyPartBeingDeleted] = useState<boolean>(false);
    const [mode, setMode] = useState<'read' | 'write'>(props.mode || 'read');

    const generateRomConfigForBodySide = useCallback((side: string) => {
        return {
            title: side,
            align: 'center',
            fixed: 'left',
            children: [
                {
                    title: 'AROM',
                    key: side + 'arom',
                    fixed: 'left',
                    align: 'center',
                    width: 80,
                    render: (record: any) => {
                        return <Field
                            name={`${bodyPart._id}.${record?.name}.${side}.arom`}
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
                    fixed: 'left',
                    align: 'center',
                    width: 80,
                    render: (record: any) => {
                        return <Field
                            name={`${bodyPart._id}.${record?.name}.${side}.prom`}
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
                    fixed: 'left',
                    align: 'center',
                    width: 80,
                    render: (record: any) => {
                        return <Field
                            name={`${bodyPart._id}.${record?.name}.${side}.strength`}
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

    }, [bodyPart, mode]);

    const generateROMConfigColumns = useCallback((bodyPart: IBodyPart) => {
        const columns: any = [
            {
                title: '',
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
            columns.push(generateRomConfigForBodySide(side));
        });
        if (mode === 'write') {
            columns.push({
                title: '',
                key: 'comments',
                width: 80,
                render: (record: any, index: any) => <Field
                    name={`${bodyPart._id}.${record?.name}.comments`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <IconButtonComponent
                                color={field.form?.values[bodyPart._id]?.[record?.name]?.comments ? "primary" : "inherit"}
                                onClick={() => {
                                    setShowROMMovementCommentsModal(true);
                                    setSelectedROMMovementComments(record);
                                }}>
                                {
                                    field.form?.values[bodyPart._id]?.[record?.name]?.comments ?
                                        <ImageConfig.ChatIcon/> :
                                        <ImageConfig.CommentAddIcon/>
                                }
                            </IconButtonComponent>
                        )
                    }
                </Field>
            });
        } else {
            columns.push({
                title: '', // dummy column to fill table
            });
        }
        return columns;
    }, [mode, generateRomConfigForBodySide, selectedBodySides]);

    const generateROMConfigForAnInjury = useCallback((bodyPart: IBodyPart) => {
        console.log('generate');
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
        bodyPartConfig.tableConfig = generateROMConfigColumns(bodyPartConfig);
        bodyPartConfig[bodyPart._id] = {};
        bodyPartConfig.movements?.forEach((movement: any) => {
            const config = movement?.config;
            bodyPartConfig[bodyPart._id][movement.name] = {
                comments: config?.comments,
                commentsTemp: config?.commentsTemp || config?.comments,
            };
            selectedBodySides?.forEach((side: any) => {
                if (movement.config && Object.keys(movement.config).includes(side)) {
                    const configSideData = movement?.config[side];
                    bodyPartConfig[bodyPart._id][movement.name][side] = {
                        arom: configSideData?.arom,
                        prom: configSideData?.prom,
                        strength: configSideData?.strength,
                    }
                }
            });
        });
        return bodyPartConfig;
    }, [selectedBodySides, rom_config, generateROMConfigColumns]);

    useEffect(() => {
        if (bodyPart) {
            setRomConfigValues({
                ...generateROMConfigForAnInjury(bodyPart)
            });
        }
    }, [bodyPart, mode, generateROMConfigForAnInjury]);

    const handleBodyPartEdit = useCallback(() => {
        setMode('write');
    }, []);

    const handleBodyPartDelete = useCallback(() => {
        CommonService.onConfirm({
            image: ImageConfig.RemoveBodyPartConfirmationIcon,
            confirmationTitle: "REMOVE BODY PART",
            confirmationSubTitle: "Are you sure you want to remove this body part?",
        }).then(() => {
            const bodyPartId = bodyPart._id;
            setIsBodyPartBeingDeleted(true);
            CommonService._chartNotes.DeleteBodyPartUnderMedicalInterventionROMConfigAPICall(medicalInterventionId, bodyPartId)
                .then((response: any) => {
                    CommonService._alert.showToast(response.message, 'success');
                    setIsBodyPartBeingDeleted(false);
                    if (onDelete) {
                        onDelete(bodyPartId);
                    }
                    dispatch(deleteMedicalInterventionROMConfigForABodyPart(bodyPartId));
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || 'Error deleting body part', 'error');
                    setIsBodyPartBeingDeleted(false);
                });
        });
    }, [onDelete, dispatch, bodyPart?._id, medicalInterventionId]);

    const addBodySideToForm = useCallback((bodySide: string) => {
        setRomConfigValues((prevValues: any) => {
            const tableConfig = _.cloneDeep(prevValues?.tableConfig);
            const commentsColumn = tableConfig[tableConfig?.length - 1];
            tableConfig[tableConfig?.length - 1] = generateRomConfigForBodySide(bodySide);
            tableConfig.push(commentsColumn);
            console.log(tableConfig);
            return {
                ...prevValues,
                tableConfig
            }
        });
    }, [generateRomConfigForBodySide]);

    const removeBodySideFromForm = useCallback((bodySide: string) => {
        setRomConfigValues((prevValues: any) => {
            const tableConfig = _.cloneDeep(prevValues?.tableConfig);
            const updatedTableConfig = tableConfig?.filter((column: any) => column?.title !== bodySide);
            return {
                ...prevValues,
                tableConfig: updatedTableConfig
            };
        });
    }, []);

    const handleBodySideSelect = useCallback((isSelected: boolean, bodySide: string) => {
        if (isSelected) {
            setBodySides((prevBodySides) => {
                return [...prevBodySides, bodySide];
            });
            addBodySideToForm(bodySide);
        } else {
            setBodySides((prevBodySides) => {
                return prevBodySides?.filter((side: string) => side !== bodySide);
            });
            removeBodySideFromForm(bodySide);
        }
    }, [addBodySideToForm, removeBodySideFromForm]);

    const handleROMConfigSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        if (bodySides.length === 0) {
            CommonService._alert.showToast('Please select at least one body side', 'error');
            setSubmitting(false);
            return;
        }
        const config = values[values?._id];
        const payload: any = {
            rom_config: [],
            selected_sides: bodySides
        };
        Object.keys(config).forEach((movement: string) => {
            payload.rom_config.push({
                movement_name: movement,
                config: config[movement]
            })
        });
        setSubmitting(true);
        CommonService._chartNotes.SaveMedicalInterventionROMConfigForABodyPartAPICall(medicalInterventionId, values._id, payload)
            .then((response: any) => {
                CommonService._alert.showToast(response.message, 'success');
                setSubmitting(false);
                setMode('read');
                dispatch(updateMedicalInterventionROMConfigForABodyPart(values?._id, {
                    selected_sides: payload?.selected_sides,
                    rom_config: payload?.rom_config,
                    body_part_id: bodyPart?._id,
                    body_part_details: bodyPart
                }));
            })
            .catch((error: any) => {
                CommonService.handleErrors(error.error || error.errors || 'Error saving ROM configuration', 'error');
                setSubmitting(false);
            });
    }, [bodyPart, bodySides, medicalInterventionId, dispatch]);

    return (
        <div className={'rom-config-component'}>
            <Formik initialValues={romConfigValues}
                    enableReinitialize={true}
                    onSubmit={handleROMConfigSubmit}>
                {(formik) => {
                    const {validateForm, values, isSubmitting, setFieldValue} = formik;
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                        setRomConfigValues(values);
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            {/*<FormAutoSave formikCtx={formik}/>*/}
                            <FormDebuggerComponent form={formik} showDebugger={true} canShow={false}/>
                            <CardComponent title={"Body Part: " + romConfigValues?.name}
                                           actions={<>
                                               {
                                                   (mode === 'read' && values?.movements?.length > 0) && <>
                                                       <ButtonComponent
                                                           size={"small"}
                                                           prefixIcon={<ImageConfig.EditIcon/>}
                                                           onClick={handleBodyPartEdit}
                                                           disabled={isSubmitting || isBodyPartBeingDeleted}
                                                       >
                                                           Edit
                                                       </ButtonComponent>&nbsp;&nbsp;
                                                   </>
                                               }
                                               <ButtonComponent
                                                   size={"small"}
                                                   color={"error"}
                                                   variant={"outlined"}
                                                   prefixIcon={<ImageConfig.DeleteIcon/>}
                                                   onClick={handleBodyPartDelete}
                                                   disabled={isSubmitting || isBodyPartBeingDeleted}
                                               >
                                                   Delete
                                               </ButtonComponent>
                                           </>}
                            >
                                <>
                                    {
                                        (!values?.movements || values?.movements?.length === 0) && <>
                                            <StatusCardComponent
                                                title={"The following body part does not have any Range of Motion or Strength " +
                                                    "                                                measurements. \n Please choose another body part."}/>
                                        </>
                                    }
                                    {
                                        (values?.movements?.length > 0) && <>
                                            <div className={'rom-config-table-container'}>
                                                {mode === 'write' && <div className={'rom-config-table-context'}>
                                                    <MenuDropdownComponent
                                                        menuBase={
                                                            <IconButtonComponent>
                                                                <ImageConfig.MoreVerticalIcon/>
                                                            </IconButtonComponent>
                                                        }
                                                        menuOptions={
                                                            bodyPart?.sides?.map((side: any, index: number) => {
                                                                return <CheckBoxComponent
                                                                    label={side}
                                                                    key={index + side}
                                                                    // disabled={selectedBodySides?.includes(side)}
                                                                    checked={bodySides?.includes(side)}
                                                                    onChange={(isChecked) => {
                                                                        console.log('isChecked', isChecked);
                                                                        handleBodySideSelect(isChecked, side);
                                                                    }
                                                                    }
                                                                />
                                                            })
                                                        }
                                                    />
                                                </div>}
                                                <TableComponent
                                                    data={romConfigValues?.movements || []}
                                                    bordered={true}
                                                    columns={romConfigValues?.tableConfig}
                                                    showExpandColumn={false}
                                                    defaultExpandAllRows={true}
                                                    canExpandRow={(row: any) => {
                                                        return mode === 'read' && row?.config?.comments?.length > 0;
                                                    }}
                                                    expandRowRenderer={(row: any) => {
                                                        return (
                                                            <div key={row?._id} className={'display-flex'}>
                                                                <div className={'comment-icon mrg-right-10'}>
                                                                    <ImageConfig.CommentIcon/>
                                                                </div>
                                                                <div
                                                                    className={'progress-stats-comment'}>{row?.config?.comments}</div>
                                                            </div>
                                                        )
                                                    }
                                                    }
                                                />
                                            </div>
                                            {
                                                mode === 'write' && <div className="t-form-actions">
                                                    <ButtonComponent type={"submit"}
                                                                     disabled={isSubmitting}
                                                                     isLoading={isSubmitting}>
                                                        Save
                                                    </ButtonComponent>
                                                </div>
                                            }
                                        </>
                                    }

                                </>
                            </CardComponent>
                            {
                                bodyPart?.movements?.map((movement, index: number) => {
                                    if (showROMMovementCommentsModal && movement?.name === selectedROMMovementComments?.name) {
                                        return <ModalComponent
                                            key={index + movement?.name}
                                            isOpen={showROMMovementCommentsModal}
                                            title={`${values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.comments ? "Edit Comments" : "Comments:"}`}
                                            closeOnBackDropClick={true}
                                            className={"intervention-comments-modal"}
                                            modalFooter={<>
                                                <ButtonComponent variant={"outlined"}
                                                                 onClick={() => {
                                                                     const comment = values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.comments;
                                                                     setShowROMMovementCommentsModal(false);
                                                                     setFieldValue(`${bodyPart._id}.${selectedROMMovementComments?.name}.commentsTemp`, comment);
                                                                     setSelectedROMMovementComments(undefined);
                                                                 }}>
                                                    Cancel
                                                </ButtonComponent>&nbsp;
                                                <ButtonComponent
                                                    onClick={() => {
                                                        const newComment = values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.commentsTemp;
                                                        setShowROMMovementCommentsModal(false);
                                                        setFieldValue(`${bodyPart._id}.${selectedROMMovementComments?.name}.comments`, newComment);
                                                        setSelectedROMMovementComments(undefined);
                                                    }}>
                                                    {
                                                        values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.comments ? "Save" : "Add"
                                                    }
                                                </ButtonComponent>
                                            </>
                                            }>
                                            <Field
                                                name={`${bodyPart._id}.${selectedROMMovementComments?.name}.commentsTemp`}
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
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );

};

export default RomConfigComponent;
