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

interface RomConfigComponentProps {
    mode: "read" | "write";
    bodyPart: IBodyPart;
    bodySides?: string[];
    onDelete?: (body_part_id: string) => void;
}

const tableColumns = [
    {
        title: 'Movement',
        key: 'movement',
        render: (_: any, record: any) => {
            return record.name;
        }
    },
    {
        title: "Left",
        children: [
            {
                title: 'AROM',
                key: 'arom',
                render: (_: any, record: any) => {
                    return <Field
                        name={`63aaa40bfa2621a3af6ace12.${record?.name}.left.arom`}
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
                        name={`63aaa40bfa2621a3af6ace12.${record?.name}.left.prom`}
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
                        name={`63aaa40bfa2621a3af6ace12.${record?.name}.left.strength`}
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
    },
    {
        title: '',
        key: 'comments',
        render: (_: any, record: any) => {
            return <IconButtonComponent
                color={record?.comment?.length > 0 ? "primary" : "inherit"}>
                <ImageConfig.CommentIcon/>
            </IconButtonComponent>
        }
    }
];

const RomConfigComponent = (props: RomConfigComponentProps) => {

    const {mode, bodySides, bodyPart, onDelete} = props;
    const [romConfigValues, setRomConfigValues] = useState<IBodyPart>(bodyPart);

    useEffect(() => {
        if (bodyPart) {
            setRomConfigValues({
                ...bodyPart,
            });
        }
    }, [bodyPart]);

    const handleBodyPartDelete = useCallback(() => {
        if (onDelete) {
            CommonService.onConfirm().then(() => {
                onDelete(bodyPart._id);
            });
        }
    }, [onDelete]);

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
                                <TableComponent
                                    data={romConfigValues.movements || []}
                                    bordered={true}
                                    columns={tableColumns}/>
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
