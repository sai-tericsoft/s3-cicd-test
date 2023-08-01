import "./AddConcussionFileComponent.scss";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect, useState} from "react";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {ImageConfig, Misc} from "../../../constants";
import {IConcussionFileType} from "../../../shared/models/common.model";
import * as Yup from "yup";
import {IConcussionFileAddForm} from "../../../shared/models/chart-notes.model";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import ErrorComponent from "../../../shared/components/error/ErrorComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

const AddConcussionFileAddFormValidationSchema = Yup.object({
    document_date: Yup.mixed()
        .required("Date of Document is required"),
    attachment: Yup.string()
        .required("Attachment is required"),
    comments: Yup.string().nullable()
});

const AddConcussionFileAddFormInitialValues: IConcussionFileAddForm = {
    document_date: new Date(),
    attachment: "",
    concussion_type_id: "",
    comments: ""
};

interface AddConcussionFileComponentProps {
    onAdd: (data: any) => void;
    medicalInterventionId: string;
    medicalRecordDetails: any;
    medicalInterventionDetails: any;
    onClose?: () => void;
}

const AddConcussionFileComponent = (props: AddConcussionFileComponentProps) => {

    const {onAdd, medicalInterventionId, medicalRecordDetails,onClose} = props;
    const [currentStep, setCurrentStep] = useState<"selectType" | "form">("selectType");
    const {concussionFileTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const [selectedConcussionFileType, setSelectedConcussionFileType] = useState<IConcussionFileType | undefined>(undefined);

    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [addConcussionFileAddFormInitialValues] = useState<IConcussionFileAddForm>(_.cloneDeep(AddConcussionFileAddFormInitialValues));
    const [isConcussionFileAddFileAddInProgress, setIsConcussionFileAddFileAddInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsConcussionFileAddFileAddInProgress(true);
        values.document_date = CommonService.convertDateFormat(values.document_date);
        values.concussion_type_id = selectedConcussionFileType?._id;
        const formData = CommonService.getFormDataFromJSON(values);
        CommonService._chartNotes.ConcussionFileAddAPICall(medicalInterventionId, formData)
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsConcussionFileAddFileAddInProgress(false);
                onAdd(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsConcussionFileAddFileAddInProgress(false);
            })
    }, [medicalInterventionId, selectedConcussionFileType, onAdd]);

    const onConcussionFileTypeSelect = useCallback((type: IConcussionFileType) => {
        setSelectedConcussionFileType(type);
        setCurrentStep("form");
    }, []);

    const handleBack = useCallback(() => {
        if (currentStep === "form") {
            setCurrentStep("selectType");
        }
    },[currentStep]);

    return (
        <div className={'add-concussion-file-component'}>
            {
                (currentStep === "form") &&
                <div className={'back-cross-btn-wrapper'}>
                    <div className="back-btn" onClick={handleBack}><ImageConfig.LeftArrow/></div>
                    {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                    <div className="drawer-close"
                         id={'book-appointment-close-btn'}
                         onClick={(event) => {
                             if (onClose) {
                                 onClose();
                             }
                         }
                         }><ImageConfig.CloseIcon/></div>
                    {/*</ToolTipComponent>*/}
                </div>
            }
            {
                currentStep === "selectType" && <>
                    <div className={'back-cross-btn-wrapper'}>
                        <div className="back-btn"></div>
                        {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                        <div className="drawer-close"
                             id={'book-appointment-close-btn'}
                             onClick={(event) => {
                                 if (onClose) {
                                     onClose();
                                 }
                             }
                             }><ImageConfig.CloseIcon/></div>
                        {/*</ToolTipComponent>*/}
                    </div>
                    <FormControlLabelComponent size={"lg"} label={"Add Concussion File"}/>
                    <div className={"concussion-file-type-list"}>
                        {
                            concussionFileTypes.map(((type, index) => {
                                return <div key={index} className={"concussion-file-type-item"}
                                            onClick={() => onConcussionFileTypeSelect(type)}>
                                    <div className={"concussion-file-title"}>
                                        {type.type}
                                    </div>
                                    <ImageConfig.RightArrow/>
                                </div>
                            }))
                        }
                    </div>
                </>
            }
            {
                (currentStep === "form" && selectedConcussionFileType) && <>
                    <FormControlLabelComponent size={"lg"} label={selectedConcussionFileType.type}/>
                    <Formik
                        validationSchema={AddConcussionFileAddFormValidationSchema}
                        initialValues={addConcussionFileAddFormInitialValues}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}
                        onSubmit={onSubmit}
                    >
                        {({values,isValid, touched, errors, setFieldValue, validateForm}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <div className="t-form-controls">
                                        <InputComponent className="t-form-control"
                                                        label={'Intervention Linked To'}
                                                        placeholder={'Intervention Linked To'}
                                                        value={CommonService.generateInterventionNameFromMedicalRecord(medicalRecordDetails)}
                                                        required={true}
                                                        fullWidth={true}
                                                        disabled={true}
                                        />
                                        <InputComponent className="t-form-control"
                                                        label={'Attached by'}
                                                        placeholder={'Attached by'}
                                                        value={currentUser?.first_name + " " + currentUser?.last_name}
                                                        required={true}
                                                        fullWidth={true}
                                                        disabled={true}
                                        />
                                        <Field name={'document_date'} className="t-form-control">
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={'Date of Document'}
                                                        // placeholder={'Enter Date of Document'}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'comments'} className="t-form-control">
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Comments'}
                                                        placeholder={'Enter Comments'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <div className="mrg-bottom-20">
                                            <FormControlLabelComponent
                                                label={`Upload ${selectedConcussionFileType?.type} Document`}
                                                className={'upload-document-heading'}
                                                required={true}/>
                                            <>
                                                {
                                                    (!values.attachment) && <>
                                                        <FilePickerComponent maxFileCount={1}
                                                                             onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                                 if (acceptedFiles && acceptedFiles.length > 0) {
                                                                                     const file = acceptedFiles[0];
                                                                                     setFieldValue('attachment', file);
                                                                                 }
                                                                             }}
                                                                             acceptedFileTypes={["pdf", "png", "jpeg"]}
                                                                             acceptedFilesText={"PNG, JPEG and PDF files are allowed upto 100MB"}
                                                        />
                                                        {
                                                            (_.get(touched, "attachment") && !!(_.get(errors, "attachment"))) &&
                                                            <ErrorComponent
                                                                errorText={(_.get(errors, "attachment"))}/>
                                                        }
                                                    </>
                                                }
                                            </>
                                            <>
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
                                            </>
                                        </div>
                                    </div>
                                    <div className="t-form-actions mrg-top-50 ">
                                        <ButtonComponent
                                            isLoading={isConcussionFileAddFileAddInProgress}
                                            type={"submit"}
                                            disabled={isConcussionFileAddFileAddInProgress || !isValid}
                                            fullWidth={true}
                                        >
                                            {isConcussionFileAddFileAddInProgress ? "Saving" : "Save"}
                                        </ButtonComponent>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </>
            }
        </div>
    );

};

export default AddConcussionFileComponent;
