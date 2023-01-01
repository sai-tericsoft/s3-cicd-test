import "./RomConfigComponent.scss";
import {IBodyPart} from "../../../shared/models/static-data.model";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import TableComponent from "../../../shared/components/table/TableComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useCallback, useEffect, useRef, useState} from "react";
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
import FormikCommentComponent from "../../../shared/components/form-controls/formik-comment/FormikCommentComponent";

interface RomConfigComponentProps {
    medicalInterventionDetails: any;
    medicalInterventionId: string;
    bodyPart: IBodyPart;
    selectedBodySides: string[];
    onDelete?: (body_part_id: string) => void;
    onSave?: (romConfig: string) => void;
}

interface IROMConfig extends IBodyPart {
    tableConfig: ITableColumn[];
}

const RomConfigComponent = (props: RomConfigComponentProps) => {

    const formikRef = useRef<FormikProps<any>>(null);
    const {medicalInterventionId, medicalInterventionDetails, selectedBodySides, bodyPart, onDelete} = props;
    const [bodySides, setBodySides] = useState<string[]>(selectedBodySides);
    const [romConfigValues, setRomConfigValues] = useState<IROMConfig | any | undefined>({});
    const [showROMMovementCommentsModal, setShowROMMovementCommentsModal] = useState<boolean>(false);
    const [selectedROMMovementComments, setSelectedROMMovementComments] = useState<any>(undefined);
    const [isBodyPartBeingDeleted, setIsBodyPartBeingDeleted] = useState<boolean>(false);

    const generateROMConfigColumns = useCallback((bodyPart: IBodyPart) => {
        const columns: any = [
            {
                title: 'Movement',
                key: 'movement',
                width: 200,
                fixed: 'left',
                render: (_: any, record: any) => {
                    return record.name
                }
            }
        ];
        bodySides?.forEach((side: any) => {
            columns.push({
                title: side,
                children: [
                    {
                        title: 'AROM',
                        key: 'arom',
                        width: 80,
                        render: (_: any, record: any) => {
                            return <Field
                                name={`${bodyPart._id}.${record?.name}.${side}.arom`}
                                className="t-form-control">
                                {
                                    (field: FieldProps) => (
                                        <FormikInputComponent
                                            formikField={field}
                                            size={"small"}/>
                                    )
                                }
                            </Field>;
                        }
                    },
                    {
                        title: 'PROM',
                        key: 'prom',
                        width: 80,
                        render: (_: any, record: any) => {
                            return <Field
                                name={`${bodyPart._id}.${record?.name}.${side}.prom`}
                                className="t-form-control">
                                {
                                    (field: FieldProps) => (
                                        <FormikInputComponent
                                            formikField={field}
                                            size={"small"}
                                        />
                                    )
                                }
                            </Field>;
                        }
                    },
                    {
                        title: 'Strength',
                        key: 'strength',
                        width: 100,
                        render: (_: any, record: any) => {
                            return <Field
                                name={`${bodyPart._id}.${record?.name}.${side}.strength`}
                                className="t-form-control">
                                {
                                    (field: FieldProps) => (
                                        <FormikInputComponent
                                            formikField={field}
                                            size={"small"}/>
                                    )
                                }
                            </Field>;
                        }
                    },
                ]
            });
        });
        columns.push({
            title: '',
            key: 'comments',
            width: 80,
            render: (index: any, record: any) => <Field
                name={`${bodyPart._id}.${record?.name}.comment`}
                className="t-form-control">
                {
                    (field: FieldProps) => (
                        <FormikCommentComponent
                            formikField={field}
                            onClick={() => {
                                setShowROMMovementCommentsModal(true);
                                setSelectedROMMovementComments(record);
                            }}/>
                    )
                }
            </Field>
        });
        return columns;
    }, [bodySides]);

    const generateROMConfigForAnInjury = useCallback((bodyPart: IBodyPart) => {
        const bodyPartConfig: any = _.cloneDeep(bodyPart);
        bodyPartConfig.movements = bodyPart?.movements?.map((movement: any, index: number) => {
            return {...movement, comment: "", commentTemp: ""};
        });
        bodyPartConfig.tableConfig = generateROMConfigColumns(bodyPartConfig);
        bodyPartConfig[bodyPart._id] = {};
        bodyPartConfig.movements?.forEach((movement: any) => {
            bodyPartConfig[bodyPart._id][movement.name] = {
                comment: movement.comment,
                commentTemp: movement.comment,
            };
            bodySides?.forEach((side: any) => {
                bodyPartConfig[bodyPart._id][movement.name][side] = {
                    arom: "",
                    prom: "",
                    strength: "",
                }
            });
        });
        return bodyPartConfig;
    }, [bodySides, generateROMConfigColumns]);

    useEffect(() => {
        if (bodyPart) {
            setRomConfigValues({
                ...generateROMConfigForAnInjury(bodyPart)
            });
        }
    }, [bodyPart, bodySides, generateROMConfigForAnInjury]);

    const handleBodyPartDelete = useCallback(() => {
        if (onDelete) {
            CommonService.onConfirm({
                image: ImageConfig.RemoveBodyPartConfirmationIcon,
                confirmationTitle: "REMOVE BODY PART",
                confirmationSubTitle: "Are you sure you want to remove this body part?",
            }).then(() => {
                const bodyPartId = bodyPart._id;
                if (medicalInterventionDetails?.medical_record_details?.injury_details?.findIndex((injury: any) => injury?.body_part_id === bodyPartId) === -1) {
                    onDelete(bodyPartId);
                } else {
                    setIsBodyPartBeingDeleted(true);
                    CommonService._chartNotes.DeleteBodyPartUnderMedicalInterventionROMConfigAPICall(medicalInterventionId, bodyPartId)
                        .then((response: any) => {
                            CommonService._alert.showToast(response.message, 'success');
                            setIsBodyPartBeingDeleted(false);
                            onDelete(bodyPartId);
                        })
                        .catch((error: any) => {
                            CommonService._alert.showToast(error.error || error.errors || 'Error deleting body part', 'error');
                            setIsBodyPartBeingDeleted(false);
                        });
                }
            });
        }
    }, [onDelete, bodyPart._id]);

    const handleBodySideSelect = useCallback((isSelected: boolean, bodySide: string) => {
        if (isSelected) {
            setBodySides((prevBodySides) => {
                return [...prevBodySides, bodySide];
            });
        } else {
            setBodySides((prevBodySides) => {
                return prevBodySides?.filter((side: string) => side !== bodySide);
            });
        }
    }, []);

    const handleROMConfigSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        const config = values[values._id];
        const payload: any = {
            rom_config: [],
            mode: "add"
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
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || 'Error saving ROM configuration', 'error');
                setSubmitting(false);
            });
    }, [medicalInterventionId]);

    return (
        <div className={'rom-config-component'}>
            <Formik initialValues={romConfigValues}
                    enableReinitialize={true}
                    innerRef={formikRef}
                    onSubmit={handleROMConfigSubmit}>
                {({values, validateForm, setFieldValue, isSubmitting}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <CardComponent title={"Body Part: " + romConfigValues?.name}
                                           actions={<>
                                               <ButtonComponent
                                                   size={"small"}
                                                   prefixIcon={<ImageConfig.DeleteIcon/>}
                                                   onClick={handleBodyPartDelete}
                                                   disabled={isSubmitting || isBodyPartBeingDeleted}
                                               >
                                                   Delete
                                               </ButtonComponent>
                                           </>}
                            >
                                <div className={'rom-config-table-container'}>
                                    <div className={'rom-config-table-context'}>
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
                                                        disabled={selectedBodySides.includes(side)}
                                                        checked={bodySides?.includes(side)}
                                                        onChange={(isChecked) => {
                                                            handleBodySideSelect(isChecked, side);
                                                        }
                                                        }
                                                    />
                                                })
                                            }
                                        />
                                    </div>
                                    <TableComponent
                                        data={romConfigValues.movements || []}
                                        bordered={true}
                                        columns={romConfigValues.tableConfig}/>
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent type={"submit"}
                                                     disabled={isSubmitting}
                                                     isLoading={isSubmitting}>
                                        Save
                                    </ButtonComponent>
                                </div>
                            </CardComponent>
                            {
                                bodyPart.movements?.map((movement, index: number) => {
                                    if (showROMMovementCommentsModal && movement.name === selectedROMMovementComments?.name) {
                                        return <ModalComponent
                                            key={index + movement.name}
                                            isOpen={showROMMovementCommentsModal}
                                            title={`${values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.comment ? "Edit Comments" : "Comments:"}`}
                                            closeOnBackDropClick={true}
                                            className={"intervention-comments-modal"}
                                            modalFooter={<>
                                                <ButtonComponent variant={"outlined"}
                                                                 onClick={() => {
                                                                     const comment = values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.comment;
                                                                     setShowROMMovementCommentsModal(false);
                                                                     setFieldValue(`${bodyPart._id}.${selectedROMMovementComments?.name}.commentTemp`, comment);
                                                                     setSelectedROMMovementComments(undefined);
                                                                 }}>
                                                    Cancel
                                                </ButtonComponent>&nbsp;
                                                <ButtonComponent
                                                    onClick={() => {
                                                        const newComment = values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.commentTemp;
                                                        setShowROMMovementCommentsModal(false);
                                                        setFieldValue(`${bodyPart._id}.${selectedROMMovementComments?.name}.comment`, newComment);
                                                        setSelectedROMMovementComments(undefined);
                                                    }}>
                                                    {
                                                        values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.comment ? "Save" : "Add"
                                                    }
                                                </ButtonComponent>
                                            </>
                                            }>
                                            <Field
                                                name={`${bodyPart._id}.${selectedROMMovementComments?.name}.commentTemp`}
                                                className="t-form-control">
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikTextAreaComponent
                                                            label={selectedROMMovementComments?.name + " ( Comments ) "}
                                                            placeholder={"Enter your comments here..."}
                                                            formikField={field}
                                                            size={"small"}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </ModalComponent>
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
