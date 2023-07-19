import "./SpecialTestComponent.scss";
import {IBodyPart} from "../../../shared/models/static-data.model";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import React, {useCallback, useEffect, useState} from "react";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../../shared/services";
import _ from "lodash";
import {ITableColumn} from "../../../shared/models/table.model";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import {useDispatch} from "react-redux";
import {
    deleteMedicalInterventionSpecialTestConfigForABodyPart,
    updateMedicalInterventionSpecialTestConfigForABodyPart
} from "../../../store/actions/chart-notes.action";

interface SpecialTestComponentProps {
    mode?: 'read' | 'write';
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

    const {medicalInterventionId, bodyPart, onDelete, selected_tests} = props;
    const [specialTestFormValues, setSpecialTestFormValues] = useState<ISpecialTest | any | undefined>({});
    const [showSpecialTestCommentsModal, setShowSpecialTestCommentsModal] = useState<boolean>(false);
    const [selectedSpecialTestComments, setSelectedSpecialTestComments] = useState<any>(undefined);
    const [isBodyPartBeingDeleted, setIsBodyPartBeingDeleted] = useState<boolean>(false);
    const [mode, setMode] = useState<'read' | 'write'>(props.mode || 'read');
    const dispatch = useDispatch();

    const generateSpecialTestColumns = useCallback((bodyPart: IBodyPart) => {
        const columns: any = [
            {
                title: '',
                key: 'select',
                align: 'center',
                fixed: 'left',
                width: 80,
                render: (record: any) => {
                    return <Field name={`${bodyPart._id}.${record?.name}.is_tested`}>
                        {
                            (field: FieldProps) => (
                                <FormikCheckBoxComponent
                                    formikField={field}
                                    disabled={mode === 'read'}
                                    onChange={(isChecked) => {
                                        if (!isChecked) {
                                            field.form.setFieldValue(`${bodyPart._id}.${record?.name}.result`, undefined);
                                            field.form.setFieldValue(`${bodyPart._id}.${record?.name}.comments`, undefined);
                                            field.form.setFieldValue(`${bodyPart._id}.${record?.name}.commentsTemp`, undefined);
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
                fixed: 'left',
                width: 220,
                render: (record: any) => {
                    return record.name;
                }
            },
            {
                title: 'Results',
                key: 'results',
                align: 'center',
                fixed: 'left',
                width: 300,
                render: (record: any) => {
                    return <Field name={`${bodyPart._id}.${record?.name}.result`}>
                        {
                            (field: FieldProps) => (
                                <FormikRadioButtonGroupComponent
                                    formikField={field}
                                    disabled={!field.form.values[bodyPart._id]?.[record?.name]?.is_tested || mode === 'read'}
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
                render: (record: any) => <Field
                    name={`${bodyPart._id}.${record?.name}.comments`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <IconButtonComponent
                                disabled={!field.form.values[bodyPart._id]?.[record?.name]?.is_tested || mode === 'read'}
                                color={(field.form.values[bodyPart._id]?.[record?.name].comments && mode === 'write') ? "primary" : "inherit"}
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
    }, [mode]);

    const generateSpecialTestForAnInjury = useCallback((bodyPart: IBodyPart) => {
        const bodyPartConfig: any = _.cloneDeep(bodyPart);
        bodyPartConfig.special_tests = bodyPart?.special_tests?.map((special_test: any, index: number) => {
            const special_test_data = selected_tests.find((selected_test: any) => selected_test.name === special_test);
            return {
                name: special_test,
                comments: special_test_data?.comments,
                commentsTemp: special_test_data?.commentsTemp || special_test_data?.comments,
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
                commentsTemp: special_test.commentsTemp,
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
        CommonService.onConfirm({
            image: ImageConfig.ConfirmationLottie,
            showLottie:true,
            confirmationTitle: "REMOVE BODY PART",
            confirmationSubTitle: "Are you sure you want to remove this body part?",
        }).then(() => {
            const bodyPartId = bodyPart._id;
            setIsBodyPartBeingDeleted(true);
            CommonService._chartNotes.DeleteBodyPartUnderMedicalInterventionSpecialTestAPICall(medicalInterventionId, bodyPartId)
                .then((response: any) => {
                    CommonService._alert.showToast(response.message, 'success');
                    setIsBodyPartBeingDeleted(false);
                    if (onDelete) {
                        onDelete(bodyPartId);
                    }
                    dispatch(deleteMedicalInterventionSpecialTestConfigForABodyPart(bodyPartId));
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || 'Error deleting body part', 'error');
                    setIsBodyPartBeingDeleted(false);
                });
        });
    }, [onDelete, dispatch, bodyPart._id, medicalInterventionId]);

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
                setMode('read');
                setSubmitting(false);
                dispatch(updateMedicalInterventionSpecialTestConfigForABodyPart(values?._id, {
                    special_tests: payload?.special_tests,
                    body_part_id: bodyPart?._id,
                    body_part_details: bodyPart
                }));
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || 'Error saving Special Test', 'error');
                setSubmitting(false);
            });
    }, [bodyPart, dispatch, medicalInterventionId]);

    const handleBodyPartEdit = useCallback(() => {
        setMode('write');
    }, []);

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
                            {/*<FormDebuggerComponent values={values} showDebugger={false} />*/}
                            <CardComponent title={"Body Part: " + specialTestFormValues?.name}
                                           actions={<>
                                               {
                                                   (mode === 'read') && <>
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
                                <div className={'special-test-table-container'}>
                                    <TableComponent
                                        data={specialTestFormValues?.special_tests}
                                        bordered={true}
                                        rowKey={(row: any, index: any) => index + '_' + row.name}
                                        columns={specialTestFormValues?.tableConfig}
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
                                                                     setFieldValue(`${bodyPart._id}.${selectedSpecialTestComments?.name}.commentsTemp`, comments);
                                                                     setSelectedSpecialTestComments(undefined);
                                                                 }}>
                                                    Cancel
                                                </ButtonComponent>&nbsp;
                                                <ButtonComponent
                                                    onClick={() => {
                                                        const newComment = values?.[bodyPart._id]?.[selectedSpecialTestComments?.name]?.commentsTemp;
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
                                                name={`${bodyPart._id}.${selectedSpecialTestComments?.name}.commentsTemp`}
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
