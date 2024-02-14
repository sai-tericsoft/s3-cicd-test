import "./ReportAnIssueComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import _ from "lodash";
import ErrorComponent from "../../../shared/components/error/ErrorComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../shared/services";
import {Misc} from "../../../constants";
import * as Yup from "yup";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";

interface ReportAnIssueComponentProps {

}

const ReportAnIssueInitialValues: any = {
    issue: '',
    attachment: '',
}

const ReportAnIssueValidationSchema = Yup.object().shape({
    issue: Yup.string().max(3000, ' '),
});

const ReportAnIssueComponent = (props: ReportAnIssueComponentProps) => {
    const dispatch = useDispatch();
    const [isIssueSubmitting, setIsIssueSubmitting] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setCurrentNavParams("Help"));
    }, [dispatch]);

    const onIssueSubmit = useCallback((values: any, {setErrors, resetForm}: FormikHelpers<any>) => {
        const formData = CommonService.getFormDataFromJSON(values);
        setIsIssueSubmitting(true);
        CommonService._staticData.ReportAnIssue(formData)
            .then((response) => {
                setIsIssueSubmitting(false);
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                resetForm();
            }).catch((error: any) => {
            setIsIssueSubmitting(false);
            CommonService.handleErrors(setErrors, error, true);
        });
    }, []);

    const handleFileUpload = useCallback((acceptedFiles: any[], rejectedFiles: any[], setFieldValue: any) => {
        const maxAllowedSize = 5 * 1024 * 1024;
        if (acceptedFiles && acceptedFiles.length > 0) {
            if (acceptedFiles[0].size > maxAllowedSize) {
                CommonService._alert.showToast('File size should be under 5MB.', "error");
                return;
            } else {
                const file = acceptedFiles[0];
                setFieldValue('attachment', file);
            }
        }
    }, []);

    return (
        <div className={'report-an-issue-component'}>

            <Formik initialValues={ReportAnIssueInitialValues}
                    onSubmit={onIssueSubmit}
                    validateOnChange={false}
                    validationSchema={ReportAnIssueValidationSchema}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                {({values, isValid, touched, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <CardComponent className={'report-an-issue-wrapper'}>
                                <div className={'ts-row'}>

                                    <FormControlLabelComponent className={'issue-heading'} label={'Issue:'}/>
                                    <div className={'ts-col-md-12'}>
                                        <Field name={'issue'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Enter your issue here'}
                                                        placeholder={' '}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                    />
                                                )
                                            }
                                        </Field>

                                    </div>
                                    <div className={'ts-col-md-12'}>
                                        {(values.issue.length) > 3000 ?
                                            (<div className={'alert-error'}> Characters Limit
                                                : {(values.issue.length)}/3000</div>) :
                                            (<div className={'no-alert'}> Characters Limit
                                                : {(values.issue.length)}/3000</div>)}
                                    </div>
                                    <div className={'ts-col-md-12'}>
                                        <FormControlLabelComponent className={'attachment-heading'}
                                                                   label={"Attachment (if any):"}/>
                                        <div className={'pdd-bottom-10'}>
                                            {
                                                (!values.attachment) && <>
                                                    <FilePickerComponent maxFileCount={1}
                                                                         onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                             handleFileUpload(acceptedFiles, rejectedFiles, setFieldValue);

                                                                         }}
                                                                         acceptedFileTypes={["pdf", "png", "jpg", "jpeg"]}
                                                                         acceptedFilesText={"PNG, JPEG, PDF files are allowed upto 5MB"}
                                                    />
                                                    {
                                                        (_.get(touched, "attachment") && !!(_.get(errors, "attachment"))) &&
                                                        <ErrorComponent
                                                            errorText={(_.get(errors, "attachment"))}/>
                                                    }
                                                </>
                                            }
                                        </div>
                                        <div className={'ts-col-lg-12 thumbnail-wrapper'}>
                                            {
                                                (values.attachment) && <>
                                                    <FilePreviewThumbnailComponent
                                                        file={values.attachment}
                                                        onRemove={() => {
                                                            setFieldValue('attachment', undefined);
                                                        }}
                                                    />
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </CardComponent>
                            <div className="t-form-actions">
                                <ButtonComponent type={'submit'}
                                                 size={'large'}
                                                 isLoading={isIssueSubmitting}
                                                 disabled={!isValid || isIssueSubmitting || (values.issue?.length === 0)}>
                                    Submit
                                </ButtonComponent>
                            </div>


                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
        ;

};

export default ReportAnIssueComponent;
