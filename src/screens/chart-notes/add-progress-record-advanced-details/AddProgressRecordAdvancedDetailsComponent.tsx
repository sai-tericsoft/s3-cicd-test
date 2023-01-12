import "./AddProgressRecordAdvancedDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Formik, Form, Field, FieldProps} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import {ITableColumn} from "../../../shared/models/table.model";
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import {CommonService} from "../../../shared/services";

interface AddProgressRecordAdvancedDetailsComponentProps {

}

const AddProgressRecordAdvancedDetailsComponent = (props: AddProgressRecordAdvancedDetailsComponentProps) => {

    const progressStatsColumns: ITableColumn[] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Results",
            dataIndex: "results",
            key: "results",
            render: (_: any, item: any) => {
                return (<>
                        {item?.results?.forEach((result: any,index:number) => {
                            console.log('result',result);
                                return <Field name={'results'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikRadioButtonGroupComponent
                                                formikField={field}
                                                options={result}/>
                                        )}
                                </Field>
                        }
                        )}
                    </>
                )
            }
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            render: (_: any, item: any) => {
                return (
                    <><ImageConfig.CommentAddIcon/></>
                )
            }

        }
    ];

    const [addProgressRecordAdvancedInitialValues] = useState({
        synopsis: "",
        impression: "",
        plan: "",
    });

    const onSubmit = useCallback((values: any) => {
        console.log(values);
    }, []);

    return (
        <div className={'add-progress-record-advanced-details-component'}>
            <Formik initialValues={addProgressRecordAdvancedInitialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}
            >
                {({values, touched, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form noValidate={true} className={'t-form'}>
                            <CardComponent title={'Synopsis'}>
                                <Field name={'synopsis'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikTextAreaComponent formikField={field}
                                                                     label={''}
                                                                     placeholder={'Please enter your note here...'}
                                                                     required={false}
                                                                     fullWidth={true}/>

                                        )
                                    }
                                </Field>
                            </CardComponent>
                            <CardComponent title={'Impression'}>
                                <Field name={'impression'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikTextAreaComponent formikField={field}
                                                                     label={''}
                                                                     placeholder={'Please enter your note here...'}
                                                                     required={false}
                                                                     fullWidth={true}/>
                                        )
                                    }
                                </Field>
                            </CardComponent>
                            <CardComponent title={'Plan'}>
                                <Field name={'plan'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikTextAreaComponent formikField={field}
                                                                     label={''}
                                                                     placeholder={'Please enter your note here...'}
                                                                     required={false}
                                                                     fullWidth={true}/>
                                        )
                                    }
                                </Field>
                            </CardComponent>
                            <CardComponent title={'Progress Stats:'}>
                                <TableWrapperComponent url={APIConfig.PROGRESS_STATS_GET_TABLE.URL}
                                                       method={APIConfig.PROGRESS_STATS_GET_TABLE.METHOD}
                                                       isPaginated={false}
                                                       columns={progressStatsColumns}/>
                            </CardComponent>
                            <div className="t-form-actions">
                                <ButtonComponent
                                    variant={"outlined"}
                                    id={"progress_report_add_cancel_btn"}
                                >
                                    Cancel
                                </ButtonComponent>
                                &nbsp;
                                <ButtonComponent
                                    type={"submit"}
                                    id={"progress_report_add_save_btn"}
                                >
                                    Save
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default AddProgressRecordAdvancedDetailsComponent;