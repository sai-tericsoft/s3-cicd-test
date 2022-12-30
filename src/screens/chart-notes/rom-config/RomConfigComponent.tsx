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

    const generateROMConfigColumns = useCallback((bodyPart: IBodyPart) => {
        const columns: any = [
            {
                title: 'Movement',
                key: 'movement',
                render: (_: any, record: any) => {
                    return record.name;
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
                return <IconButtonComponent color={record?.comment?.length > 0 ? "primary" : "inherit"}
                                            onClick={() => {
                                                console.log('comment clicked open dialog');
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
            return {...movement, comment: "", commentMode: "add", commentTemp: "", commentDialogOpen: false};
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
    }, [bodyPart, bodySides]);

    const handleBodyPartDelete = useCallback(() => {
        if (onDelete) {
            CommonService.onConfirm().then(() => {
                // TODO make an API Call to delete the body part and then announce to the parent
                onDelete(bodyPart._id);
            });
        }
    }, [onDelete]);

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
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );

};

export default RomConfigComponent;
