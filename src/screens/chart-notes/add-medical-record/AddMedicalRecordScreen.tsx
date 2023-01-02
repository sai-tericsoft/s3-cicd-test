import "./AddMedicalRecordScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import CardComponent from "../../../shared/components/card/CardComponent";
import * as Yup from "yup";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import _ from "lodash";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import {CommonService} from "../../../shared/services";
import {IRootReducerState} from "../../../store/reducers";
import {IBodyPart} from "../../../shared/models/common.model";
import {IUser} from "../../../shared/models/user.model";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import {ImageConfig, Misc} from "../../../constants";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import moment from "moment";
import {useNavigate, useParams} from "react-router-dom";

interface AddMedicalRecordScreenProps {

}

const MEDICAL_RECORD_BODY_PART = {
    body_part_id: "",
    body_side: "",
    injury_type_id: "",
};

const MedicalRecordAddFormInitialValues: any = { // TODO type properly
    onset_date: "",
    treated_by: "",
    case_physician: {
        is_case_physician: false,
        name: "",
        next_appointment: "",
        is_treated_script_received: false,
    },
    injury_details: [
        MEDICAL_RECORD_BODY_PART
    ],
    injury_description: "",
    limitations: "",
    surgery_details: {
        surgery_date: "",
        reported_by: undefined,
        surgeon_name: "",
        details: "",
        documents: []
    }
};

const SurgeryRecordValidationSchema = Yup.object().shape({
    surgery_date: Yup.string().required("Surgery date is required"),
    reported_by: Yup.mixed().required("Reported by is required"),
});

const InjuryDetailsValidationSchema = Yup.object().shape({
    body_part_id: Yup.string().required("Body Part is required"),
    body_side: Yup.mixed().required("Body Side is required"),
    injury_type_id: Yup.string().required("Injury Type is required"),
});

const MedicalRecordAddFormValidationSchema = Yup.object({
    onset_date: Yup.string().required("Date Of Onset is required"),
    treated_by: Yup.mixed().required("Treated By is required"),
    surgery_details: SurgeryRecordValidationSchema,
    injury_details: Yup.array().of(InjuryDetailsValidationSchema),
});

const AddMedicalRecordScreen = (props: AddMedicalRecordScreenProps) => {

    const {clientId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {injuryTypeList, bodyPartList} = useSelector((state: IRootReducerState) => state.staticData);
    const {allProvidersList} = useSelector((state: IRootReducerState) => state.user);
    const [addMedicalRecordFormInitialValues] = useState<any>(_.cloneDeep(MedicalRecordAddFormInitialValues));  // TODO type properly
    const [isMedicalRecordAddInProgress, setIsMedicalRecordAddInProgress] = useState<boolean>(false);
    const [isSurgeryRecordDrawerOpen, setIsSurgeryRecordDrawerOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setCurrentNavParams("Add New Medical Record", null, () => {
            clientId && navigate(CommonService._routeConfig.MedicalRecordList(clientId));
        }));
    }, [clientId, dispatch]);

    const handleSurgeryRecordDrawerOpen = useCallback(() => {
        setIsSurgeryRecordDrawerOpen(true);
    }, []);

    const handleSurgeryRecordDrawerClose = useCallback(() => {
        setIsSurgeryRecordDrawerOpen(false);
    }, []);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (clientId) {
            setIsMedicalRecordAddInProgress(true);
            values.surgery_details.reported_by = values?.surgery_details?.reported_by?._id;
            values.onset_date = CommonService.convertDateFormat(values?.onset_date);
            if (values.case_physician.next_appointment) {
                values.case_physician.next_appointment = CommonService.convertDateFormat(values?.case_physician?.next_appointment);
            }
            if (values.surgery_details.surgery_date) {
                values.surgery_details.surgery_date = CommonService.convertDateFormat(values?.surgery_details?.surgery_date);
            }
            const formData = CommonService.getFormDataFromJSON(values);
            CommonService._chartNotes.MedicalRecordAddAPICall(clientId, formData)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setIsMedicalRecordAddInProgress(false);
                    navigate(CommonService._routeConfig.AddMedicalIntervention(response?.data?.intervention_id));
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setIsMedicalRecordAddInProgress(false);
                })
        }
    }, [navigate, clientId]);

    return (
        <div className={'add-medical-record-screen'}>
            <Formik
                validationSchema={MedicalRecordAddFormValidationSchema}
                initialValues={addMedicalRecordFormInitialValues}
                onSubmit={onSubmit}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}>
                {({values, touched, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            {
                                (!SurgeryRecordValidationSchema.isValidSync(values?.surgery_details)) && <div
                                    className={"mrg-bottom-20 display-flex flex-direction-row-reverse"}>
                                    <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                                     onClick={handleSurgeryRecordDrawerOpen}
                                    >
                                        Add Surgery Record
                                    </ButtonComponent>
                                </div>
                            }
                            {
                                (SurgeryRecordValidationSchema.isValidSync(values?.surgery_details)) &&
                                <CardComponent color={"primary"}>
                                    <div
                                        className={"display-flex flex-direction-row justify-content-space-between mrg-bottom-20"}>
                                        <FormControlLabelComponent label={"Surgery Record"}/>
                                        <div>
                                            <ButtonComponent variant={"outlined"}
                                                             color={"error"}
                                                             prefixIcon={<ImageConfig.DeleteIcon/>}
                                                             onClick={() => {
                                                                 setFieldValue("surgery_details.surgery_date", "");
                                                                 setFieldValue("surgery_details.reported_by", "");
                                                                 setFieldValue("surgery_details.surgeon_name", "");
                                                                 setFieldValue("surgery_details.details", "");
                                                                 setFieldValue("surgery_details.documents", []);
                                                             }}
                                            >
                                                Delete
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                             onClick={handleSurgeryRecordDrawerOpen}
                                            >
                                                Edit Surgery Record
                                            </ButtonComponent>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="ts-row">
                                            <div className="ts-col-md-6 ts-col-lg-3">
                                                <DataLabelValueComponent label={"Surgery Date"}>
                                                    {values?.surgery_details?.surgery_date ? moment(values?.surgery_details?.surgery_date).format('DD-MMM-YYYY') : "NA"}
                                                </DataLabelValueComponent>
                                            </div>
                                            <div className="ts-col-md-6 ts-col-lg-3">
                                                <DataLabelValueComponent label={"Reported By"}>
                                                    {values?.surgery_details?.reported_by?.first_name} {values?.surgery_details?.reported_by?.last_name}
                                                </DataLabelValueComponent>
                                            </div>
                                            <div className="ts-col-md-6 ts-col-lg-3">
                                                <DataLabelValueComponent label={"Name of the Surgeon"}>
                                                    {values?.surgery_details?.surgeon_name || "NA"}
                                                </DataLabelValueComponent>
                                            </div>
                                            <div className="ts-col-md-6 ts-col-lg-3">
                                                <DataLabelValueComponent label={"Brief Details"}>
                                                    {values?.surgery_details?.details || "NA"}
                                                </DataLabelValueComponent>
                                            </div>
                                        </div>
                                        <div className="ts-row">
                                            <div className="ts-col-12 surgery-record-documents">
                                                <DataLabelValueComponent label={"Documents"}>
                                                    {
                                                        values?.surgery_details?.documents?.length === 0 && "NA"
                                                    }
                                                    {values?.surgery_details?.documents?.map((item: any, index: any) => {
                                                        return (
                                                            <FilePreviewThumbnailComponent file={item}
                                                                                           variant={"compact"}
                                                                                           key={item.name + index}
                                                            />
                                                        )
                                                    })}
                                                </DataLabelValueComponent>
                                            </div>
                                        </div>
                                    </div>
                                </CardComponent>
                            }
                            <CardComponent title={"Medical Record Details"}>
                                <div className="ts-row">
                                    <div className="ts-col-lg-4">
                                        <Field name={'onset_date'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={'Date Of Onset'}
                                                        placeholder={'Date Of Onset'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-lg-4">
                                        <Field name={'treated_by'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={allProvidersList}
                                                        displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                        valueExtractor={(option: IUser) => option._id}
                                                        label={'Treated By'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                            </CardComponent>
                            <CardComponent title={"Case Physician Details"}>
                                <div className="ts-row">
                                    <div className="ts-col-lg-4">
                                        <Field name={'case_physician.is_case_physician'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={CommonService._staticData.yesNoOptions}
                                                        displayWith={(option) => option.title}
                                                        valueExtractor={(option) => option.code}
                                                        label={'Is there a Case Physician?'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                        onUpdate={(value: any) => {
                                                            if (!value) {
                                                                setFieldValue('case_physician.name', '');
                                                                setFieldValue('case_physician.is_treated_script_received', '');
                                                                setFieldValue('case_physician.next_appointment', '');
                                                            }
                                                        }}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    {
                                        values?.case_physician?.is_case_physician && <>
                                            <div className="ts-col-lg-4">
                                                <Field name={'case_physician.name'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikInputComponent
                                                                titleCase={true}
                                                                label={'Case Physician Name'}
                                                                formikField={field}
                                                                required={true}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                            <div className="ts-col-lg-4">
                                                <Field name={'case_physician.is_treated_script_received'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikSelectComponent
                                                                options={CommonService._staticData.yesNoOptions}
                                                                displayWith={(option) => option.title}
                                                                valueExtractor={(option) => option.title}
                                                                label={'Treated Script Received'}
                                                                formikField={field}
                                                                required={true}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                            <div className="ts-col-lg-4">
                                                <Field name={'case_physician.next_appointment'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikDatePickerComponent
                                                                label={'Next MD appointment'}
                                                                formikField={field}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </>
                                    }
                                </div>
                            </CardComponent>
                            <CardComponent title={"Injury Details"}>
                                <FieldArray
                                    name="injury_details"
                                    render={arrayHelpers => (
                                        <>
                                            {values?.injury_details && values?.injury_details?.map((item: any, index: any) => {
                                                return (
                                                    <>
                                                        <div key={index} className="ts-row">
                                                            <div className="ts-col-lg-11">
                                                                <div className="ts-row" key={index}>
                                                                    <div className="ts-col-lg-4">
                                                                        <Field
                                                                            name={`injury_details[${index}].body_part_id`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikSelectComponent
                                                                                        options={bodyPartList}
                                                                                        label={'Body Part'}
                                                                                        displayWith={(item: any) => item?.name}
                                                                                        valueExtractor={(item: any) => item?._id}
                                                                                        formikField={field}
                                                                                        required={true}
                                                                                        fullWidth={true}
                                                                                        onUpdate={() => {
                                                                                            setFieldValue(`injury_details[${index}].injury_type_id`, '');
                                                                                            setFieldValue(`injury_details[${index}].body_side`, '');
                                                                                        }}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </div>
                                                                    <div className="ts-col-lg-4">
                                                                        <Field
                                                                            name={`injury_details[${index}].body_side`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikSelectComponent
                                                                                        disabled={values?.injury_details[index]?.body_part_id === ""}
                                                                                        options={bodyPartList?.find((item: IBodyPart) => item?._id === values?.injury_details[index]?.body_part_id)?.sides}
                                                                                        label={'Body Side'}
                                                                                        displayWith={(item: any) => item}
                                                                                        valueExtractor={(item: any) => item}
                                                                                        formikField={field}
                                                                                        required={true}
                                                                                        fullWidth={true}
                                                                                        onUpdate={() => {
                                                                                            setFieldValue(`injury_details[${index}].injury_type_id`, '');
                                                                                        }}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </div>
                                                                    <div className="ts-col-lg-4">
                                                                        <Field
                                                                            name={`injury_details[${index}].injury_type_id`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikSelectComponent
                                                                                        options={injuryTypeList}
                                                                                        displayWith={(item: any) => item?.title}
                                                                                        valueExtractor={(item: any) => item?._id}
                                                                                        label={'Injury Type'}
                                                                                        formikField={field}
                                                                                        required={true}
                                                                                        fullWidth={true}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                index > 0 && <div className="ts-col-lg-1">
                                                                    <IconButtonComponent onClick={() => {
                                                                        arrayHelpers.remove(index)
                                                                    }}>
                                                                        <ImageConfig.DeleteIcon/>
                                                                    </IconButtonComponent>
                                                                </div>
                                                            }
                                                        </div>
                                                        {
                                                            (index === values?.injury_details?.length - 1) &&
                                                            <ButtonComponent
                                                                onClick={() => {
                                                                    arrayHelpers.push(MEDICAL_RECORD_BODY_PART);
                                                                }}
                                                                prefixIcon={<ImageConfig.AddIcon/>}
                                                                variant={"text"}
                                                                className={"mrg-bottom-20"}
                                                            >
                                                                Add New Body Part
                                                            </ButtonComponent>
                                                        }
                                                    </>
                                                )
                                            })}
                                        </>
                                    )}/>
                                <div className="ts-row">
                                    <div className="ts-col-lg-12">
                                        <Field name={'injury_description'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Injury/Condition Description'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col-lg-12">
                                        <Field name={'limitations'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Restrictions/Limitations'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                            </CardComponent>
                            <div className="t-form-actions">
                                <ButtonComponent // TODO: Add CTA to take back to the previous screen
                                    variant={"outlined"}
                                    disabled={isMedicalRecordAddInProgress}
                                    id={"medical_record_add_cancel_btn"}
                                >
                                    Cancel
                                </ButtonComponent>
                                &nbsp;
                                <ButtonComponent
                                    isLoading={isMedicalRecordAddInProgress}
                                    type={"submit"}
                                    id={"medical_record_add_save_btn"}
                                >
                                    {isMedicalRecordAddInProgress ? "Saving" : "Add Treatment Intervention"}
                                </ButtonComponent>
                            </div>
                            <DrawerComponent isOpen={isSurgeryRecordDrawerOpen}
                                             showClose={true}
                                             onClose={handleSurgeryRecordDrawerClose}
                                             className={"t-surgery-record-drawer"}
                            >
                                <FormControlLabelComponent label={"Surgery Record"}/>
                                <div className={"t-surgery-record-drawer-form-controls"}>
                                    <Field name={'surgery_details.surgery_date'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikDatePickerComponent
                                                    label={'Date of Surgery'}
                                                    placeholder={'Date of Surgery'}
                                                    formikField={field}
                                                    required={true}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <Field name={'surgery_details.reported_by'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikSelectComponent
                                                    options={allProvidersList}
                                                    displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                    valueExtractor={(option: IUser) => option}
                                                    label={'Reported By'}
                                                    formikField={field}
                                                    required={true}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <Field name={'surgery_details.surgeon_name'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikInputComponent
                                                    titleCase={true}
                                                    label={'Name of Surgeon'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <Field name={'surgery_details.details'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent
                                                    label={'Brief Details'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <FieldArray
                                        name="surgery_details.documents"
                                        render={arrayHelpers => (
                                            <>
                                                {values?.surgery_details?.documents && values?.surgery_details?.documents?.map((item: any, index: any) => {
                                                    return (
                                                        <FilePreviewThumbnailComponent file={item}
                                                                                       variant={"compact"}
                                                                                       key={item.name + index}
                                                                                       onRemove={() => {
                                                                                           arrayHelpers.remove(index);
                                                                                       }}
                                                        />
                                                    )
                                                })}
                                            </>
                                        )}/>
                                    <FilePickerComponent
                                        maxFileCount={1}
                                        id={"sv_upload_btn"}
                                        onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                            if (acceptedFiles && acceptedFiles.length > 0) {
                                                const file = acceptedFiles[0];
                                                setFieldValue(`surgery_details.documents[${values?.surgery_details?.documents?.length || 0}]`, file);
                                            }
                                        }}
                                        acceptedFilesText={"PDF files are allowed"}
                                        acceptedFileTypes={["pdf"]}
                                    />
                                </div>
                                <div className="t-form-actions mrg-top-20">
                                    <ButtonComponent fullWidth={true}
                                                     disabled={!SurgeryRecordValidationSchema.isValidSync(values?.surgery_details)}
                                                     onClick={handleSurgeryRecordDrawerClose}>
                                        Save
                                    </ButtonComponent>
                                </div>
                            </DrawerComponent>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default AddMedicalRecordScreen;
