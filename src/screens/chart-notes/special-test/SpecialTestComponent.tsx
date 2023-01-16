import "./SpecialTestComponent.scss";
import {IBodyPart} from "../../../shared/models/static-data.model";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import TableComponent from "../../../shared/components/table/TableComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useCallback, useEffect, useState} from "react";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../../shared/services";
import _ from "lodash";
import {ITableColumn} from "../../../shared/models/table.model";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";

import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";

interface SpecialTestComponentProps {
    medicalInterventionDetails: any;
    medicalInterventionId: string;
    bodyPart: IBodyPart;
    selected_tests: any[];
    onDelete?: (body_part_id: string) => void;
    onSave?: (specialTest: string) => void;
}

interface ISpecialTest extends IBodyPart {
    tableConfig: ITableColumn[];
}

const SpecialTestComponent = (props: SpecialTestComponentProps) => {

    const {medicalInterventionId, medicalInterventionDetails, bodyPart, onDelete, selected_tests} = props;
    const [specialTestFormValues, setSpecialTestFormValues] = useState<ISpecialTest | any | undefined>({});
    const [showSpecialTestCommentsModal, setShowSpecialTestCommentsModal] = useState<boolean>(false);
    const [selectedSpecialTestComments, setSelectedSpecialTestComments] = useState<any>(undefined);
    const [isBodyPartBeingDeleted, setIsBodyPartBeingDeleted] = useState<boolean>(false);

    const generateSpecialTestColumns = useCallback((bodyPart: IBodyPart) => {
        const columns: any = [
            {
                title: '',
                key: 'select',
                width: 40,
                render: (_: any, record: any) => {
                    return <Field name={`${bodyPart._id}.${record?.name}.is_tested`}>
                        {
                            (field: FieldProps) => (
                                <FormikCheckBoxComponent
                                    formikField={field}
                                    label={""}
                                    onChange={(isChecked) => {
                                        if (!isChecked) {
                                            field.form.setFieldValue(`${bodyPart._id}.${record?.name}.result`, undefined);
                                            field.form.setFieldValue(`${bodyPart._id}.${record?.name}.comments`, undefined);
                                            field.form.setFieldValue(`${bodyPart._id}.${record?.name}.commentTemp`, undefined);
                                        }
                                    }}
                                />
                            )
                        }
                    </Field>
                }
            },
            {
                title: 'Test Name',
                key: 'test',
                width: 200,
                render: (_: any, record: any) => {
                    return record.name;
                }
            },
            {
                title: 'Results',
                key: 'results',
                width: 200,
                render: (_: any, record: any) => {
                    return <Field name={`${bodyPart._id}.${record?.name}.result`}>
                        {
                            (field: FieldProps) => (
                                <FormikRadioButtonGroupComponent
                                    formikField={field}
                                    disabled={!field.form.values[bodyPart._id]?.[record?.name]?.is_tested}
                                    options={CommonService._staticData.resultOptions}/>
                            )
                        }
                    </Field>
                }
            },
            {
                title: '',
                key: 'comments',
                width: 80,
                render: (index: any, record: any) => <Field
                    name={`${bodyPart._id}.${record?.name}.comments`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <IconButtonComponent
                                disabled={!field.form.values[bodyPart._id]?.[record?.name]?.is_tested}
                                color={field.form.values[bodyPart._id]?.[record?.name].comments ? "primary" : "inherit"}
                                onClick={() => {
                                    setShowSpecialTestCommentsModal(true);
                                    setSelectedSpecialTestComments(record);
                                }}>
                                {
                                    field.form.values[bodyPart._id]?.[record?.name].comments ? <ImageConfig.ChatIcon/> :
                                        <ImageConfig.CommentAddIcon/>
                                }
                            </IconButtonComponent>
                        )
                    }
                </Field>
            }
        ];
        return columns;
    }, []);

    const generateSpecialTestForAnInjury = useCallback((bodyPart: IBodyPart) => {
        const bodyPartConfig: any = _.cloneDeep(bodyPart);
        bodyPartConfig.special_tests = bodyPart?.special_tests?.map((special_test: any, index: number) => {
            const special_test_data = selected_tests.find((selected_test: any) => selected_test.name === special_test);
            return {
                name: special_test,
                comments: special_test_data?.comments,
                commentTemp: special_test_data?.commentTemp || special_test_data?.comments,
                result: special_test_data?.result,
                is_tested: special_test_data?.is_tested
            };
        });
        bodyPartConfig.tableConfig = generateSpecialTestColumns(bodyPartConfig);
        bodyPartConfig[bodyPart._id] = {};
        bodyPartConfig.special_tests?.forEach((special_test: any) => {
            bodyPartConfig[bodyPart._id][special_test.name] = {
                is_tested: special_test.is_tested,
                result: special_test.result,
                comments: special_test.comments,
                commentTemp: special_test.commentTemp,
            };
        });
        return bodyPartConfig;
    }, [generateSpecialTestColumns, selected_tests]);

    useEffect(() => {
        if (bodyPart) {
            setSpecialTestFormValues({
                ...generateSpecialTestForAnInjury(bodyPart),
            });
        }
    }, [bodyPart, generateSpecialTestForAnInjury]);

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
                    CommonService._chartNotes.DeleteBodyPartUnderMedicalInterventionSpecialTestAPICall(medicalInterventionId, bodyPartId)
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
    }, [onDelete, bodyPart._id, medicalInterventionDetails, medicalInterventionId]);

    const handleSpecialTestSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        const config = values[values._id];
        const payload: any = {
            special_tests: []
        };
        Object.keys(config).forEach((special_test: string, index) => {
            if (config[special_test].is_tested) {
                payload.special_tests.push({
                    name: special_test,
                    ...config[special_test]
                })
            }
        });
        setSubmitting(true);
        CommonService._chartNotes.SaveMedicalInterventionSpecialTestForABodyPartAPICall(medicalInterventionId, values._id, payload)
            .then((response: any) => {
                CommonService._alert.showToast(response.message, 'success');
                setSubmitting(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || 'Error saving Special Test', 'error');
                setSubmitting(false);
            });
    }, [medicalInterventionId]);

    return (
        <div className={'special-test-component'}>
            <Formik initialValues={specialTestFormValues}
                    enableReinitialize={true}
                    onSubmit={handleSpecialTestSubmit}>
                {({values, validateForm, setFieldValue, isSubmitting}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                        // setSpecialTestValues(values);
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <CardComponent title={"Body Part: " + specialTestFormValues?.name}
                                           actions={<>
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
                                <div className={'special-test-table-container'}>
                                    <TableComponent
                                        data={specialTestFormValues.special_tests || []}
                                        bordered={true}
                                        rowKey={(row, index) => index + '_' + row.name}
                                        columns={specialTestFormValues.tableConfig}/>
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
                                bodyPart.special_tests?.map((special_test: any, index: number) => {
                                    if (showSpecialTestCommentsModal && special_test === selectedSpecialTestComments?.name) {
                                        return <ModalComponent
                                            key={index + special_test}
                                            isOpen={showSpecialTestCommentsModal}
                                            title={`${values?.[bodyPart._id]?.[selectedSpecialTestComments?.name]?.comments ? "Edit Comments" : "Comments:"}`}
                                            closeOnBackDropClick={true}
                                            className={"intervention-comments-modal"}
                                            modalFooter={<>
                                                <ButtonComponent variant={"outlined"}
                                                                 onClick={() => {
                                                                     const comments = values?.[bodyPart._id]?.[selectedSpecialTestComments?.name]?.comments;
                                                                     setShowSpecialTestCommentsModal(false);
                                                                     setFieldValue(`${bodyPart._id}.${selectedSpecialTestComments?.name}.commentTemp`, comments);
                                                                     setSelectedSpecialTestComments(undefined);
                                                                 }}>
                                                    Cancel
                                                </ButtonComponent>&nbsp;
                                                <ButtonComponent
                                                    onClick={() => {
                                                        const newComment = values?.[bodyPart._id]?.[selectedSpecialTestComments?.name]?.commentTemp;
                                                        setShowSpecialTestCommentsModal(false);
                                                        setFieldValue(`${bodyPart._id}.${selectedSpecialTestComments?.name}.comments`, newComment);
                                                        setSelectedSpecialTestComments(undefined);
                                                    }}>
                                                    {
                                                        values?.[bodyPart._id]?.[selectedSpecialTestComments?.name]?.comments ? "Save" : "Add"
                                                    }
                                                </ButtonComponent>
                                            </>
                                            }>
                                            <Field
                                                name={`${bodyPart._id}.${selectedSpecialTestComments?.name}.commentTemp`}
                                                className="t-form-control">
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikTextAreaComponent
                                                            label={selectedSpecialTestComments?.name}
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
                    )
                }}
            </Formik>
        </div>
    );

};

export default SpecialTestComponent;
