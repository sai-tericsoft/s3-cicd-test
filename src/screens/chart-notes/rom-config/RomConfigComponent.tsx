import "./RomConfigComponent.scss";
import {IBodyPart} from "../../../shared/models/static-data.model";
import {Field, FieldProps, Form, Formik} from "formik";
import TableComponent from "../../../shared/components/table/TableComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useCallback, useEffect, useState} from "react";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../../shared/services";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import _ from "lodash";
import {ITableColumn} from "../../../shared/models/table.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";

interface RomConfigComponentProps {
    bodyPart: IBodyPart;
    selectedBodySides: string[];
    onDelete?: (body_part_id: string) => void;
}

interface IROMConfig extends IBodyPart {
    tableConfig: ITableColumn[]
}

const RomConfigComponent = (props: RomConfigComponentProps) => {

    const {selectedBodySides, bodyPart, onDelete} = props;
    const [bodySides, setBodySides] = useState<string[]>(selectedBodySides);
    const [romConfigValues, setRomConfigValues] = useState<IROMConfig | any | undefined>({});
    const [showROMMovementCommentsModal, setShowROMMovementCommentsModal] = useState<boolean>(false);
    const [selectedROMMovementComments, setSelectedROMMovementComments] = useState<any>(undefined);

    const generateROMConfigColumns = useCallback((bodyPart: IBodyPart) => {
        const columns: any = [
            {
                title: 'Movement',
                key: 'movement',
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
            render: (_: any, record: any) => {
                return <IconButtonComponent
                    color={romConfigValues?.[bodyPart._id]?.[record?.name]?.comments ? "primary" : "inherit"}
                    onClick={() => {
                        setShowROMMovementCommentsModal(true);
                        setSelectedROMMovementComments(record);
                    }
                    }>
                    <ImageConfig.CommentIcon/>
                </IconButtonComponent>
            }
        });
        return columns;
    }, [bodySides]);

    const generateROMConfigForAnInjury = useCallback((bodyPart: IBodyPart) => {
        const bodyPartConfig: any = _.cloneDeep(bodyPart);
        bodyPartConfig.movements = bodyPart?.movements?.map((movement: any, index: number) => {
            return {...movement, comment: "", commentTemp: ""};
        });
        bodyPartConfig.tableConfig = generateROMConfigColumns(bodyPartConfig);
        return bodyPartConfig;
    }, [generateROMConfigColumns]);

    useEffect(() => {
        if (bodyPart) {
            setRomConfigValues({
                ...generateROMConfigForAnInjury(bodyPart)
            });
        }
    }, [bodyPart, bodySides, generateROMConfigForAnInjury]);

    const handleBodyPartDelete = useCallback(() => {
        if (onDelete) {
            CommonService.onConfirm().then(() => {
                // TODO make an API Call to delete the body part and then announce to the parent
                onDelete(bodyPart._id);
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

    return (
        <div className={'rom-config-component'}>
            <Formik initialValues={romConfigValues}
                    enableReinitialize={true}
                    onSubmit={(values, formikHelpers) => {
                        console.log(values);
                    }}>
                {({values, validateForm, setFieldValue}) => {
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
                                               >
                                                   Delete
                                               </ButtonComponent>
                                           </>}
                            >
                                <div style={{float: "right"}}>
                                    {
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
                                </div>
                                <TableComponent
                                    data={romConfigValues.movements || []}
                                    bordered={true}
                                    columns={romConfigValues.tableConfig}/>
                                <div className="t-form-actions">
                                    <ButtonComponent type={"submit"}>
                                        Save
                                    </ButtonComponent>
                                </div>
                            </CardComponent>
                            <ModalComponent
                                isOpen={showROMMovementCommentsModal}
                                title={"Comments"}
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
                                        Add
                                    </ButtonComponent>
                                </>
                                }>
                                {/*{*/}
                                {/*    JSON.stringify(`${bodyPart._id}.${selectedROMMovementComments?.name}.commentTemp`)*/}
                                {/*}*/}
                                {/*<hr/>*/}
                                {/*{*/}
                                {/*    JSON.stringify(values?.[bodyPart._id]?.[selectedROMMovementComments?.name]?.commentTemp) ? "cOMMENT" : "NO COMMENT"*/}
                                {/*}*/}
                                {/*<hr/>*/}
                                {/*{*/}
                                {/*    JSON.stringify(values[bodyPart._id])*/}
                                {/*}*/}
                                <Field
                                    name={`${bodyPart._id}.${selectedROMMovementComments?.name}.commentTemp`}
                                    className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikTextAreaComponent
                                                label={selectedROMMovementComments?.name}
                                                placeholder={"Enter your comments here..."}
                                                formikField={field}
                                                size={"small"}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                            </ModalComponent>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );

};

export default RomConfigComponent;
