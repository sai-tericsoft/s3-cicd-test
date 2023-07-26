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
import LinkComponent from "../../../shared/components/link/LinkComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {getAppointmentListLite} from "../../../store/actions/appointment.action";
import ErrorComponent from "../../../shared/components/error/ErrorComponent";

interface AddMedicalRecordScreenProps {

}

const MEDICAL_RECORD_BODY_PART = {
    body_part_id: "",
    body_part_details: "",
    body_side: "",
    injury_type_id: "",
};

const MedicalRecordAddFormInitialValues: any = { // TODO type properly
    onset_date: "",
    case_physician: {
        is_case_physician: false,
        name: "",
        next_appointment: "",
        is_treated_script_received: "",
    },
    injury_details: [
        MEDICAL_RECORD_BODY_PART
    ],
    injury_description: "",
    limitations: "",
};
const surgeryDetailsInitValues = {
    surgery_date: "",
    reported_by: undefined,
    surgeon_name: "",
    details: "",
    documents: []
}

const surgeryRecordValidationSchema = Yup.object().shape({
    surgery_date: Yup.mixed().required("Date of Surgery is required"),
    reported_by: Yup.mixed().required("Reported by is required"),
});

const InjuryDetailsValidationSchema = Yup.object().shape({
    body_part_id: Yup.mixed().required("Body Part is required"),
    body_part_details: Yup.mixed().nullable(),
    body_side: Yup.mixed().nullable().when("body_part_details", {
        is: (value: IBodyPart) => value && value?.sides?.length > 0,
        then: Yup.string().required('Body Side is required'),
        otherwise: Yup.string().nullable()
    }),
    injury_type_id: Yup.string().required("Injury Type is required"),
});

const MedicalRecordAddFormValidationSchema = Yup.object({
    onset_date: Yup.mixed().required("Date of Onset is required"),
    injury_details: Yup.array().of(InjuryDetailsValidationSchema),
    appointment_id: Yup.string().required("Appointment is required"),
    case_physician: Yup.object({
        is_case_physician: Yup.boolean(),
        name: Yup.string().when("is_case_physician", {
            is: true,
            then: Yup.string().required("Case Physician is required"),
        }),
        is_treated_script_received: Yup.mixed().when("is_case_physician", {
            is: true,
            then: Yup.mixed().required("Input is required"),
        })
    }),
});

const AddMedicalRecordScreen = (props: AddMedicalRecordScreenProps) => {
    const {clientId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const {injuryTypeList, bodyPartList} = useSelector((state: IRootReducerState) => state.staticData);
    const [addMedicalRecordFormInitialValues] = useState<any>(_.cloneDeep(MedicalRecordAddFormInitialValues));  // TODO type properly
    const [isMedicalRecordAddInProgress, setIsMedicalRecordAddInProgress] = useState<boolean>(false);
    const [isSurgeryRecordDrawerOpen, setIsSurgeryRecordDrawerOpen] = useState<boolean>(false);
    const [surgeryRecord, setSurgeryRecord] = useState<any | null>(null);
    const {
        isAppointmentListLiteLoading,
        isAppointmentListLiteLoaded,
        isAppointmentListLiteLoadingFailed,
        appointmentListLite,
    } = useSelector((state: IRootReducerState) => state.appointments);

    const getAppointmentLite = useCallback(() => {
        if (clientId) {
            const payload = {client_id: clientId,is_link_to_intervention: true};
            dispatch(getAppointmentListLite(payload));
        }
    }, [dispatch, clientId])

    useEffect(() => {
        getAppointmentLite();
    }, [getAppointmentLite]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Add New Medical Record", null, () => {
            clientId && navigate(CommonService._routeConfig.MedicalRecordList(clientId));
        }));
    }, [clientId, navigate, dispatch]);

    const handleSurgeryRecordDrawerOpen = useCallback(() => {
        setIsSurgeryRecordDrawerOpen(true);
    }, []);

    const handleSurgeryRecordDrawerClose = useCallback(() => {
        setIsSurgeryRecordDrawerOpen(false);
    }, []);

    const addNewTreatment = useCallback(
        (medicalRecordId: any, appointmentId: any) => {
            if (!medicalRecordId) {
                CommonService._alert.showToast('Medical Record ID not found!', "error");
                return;
            }
            const payload = {
                "intervention_date": moment().format('YYYY-MM-DD'),
                "subjective": "",
                "objective": {
                    "observation": "",
                    "palpation": "",
                    "functional_tests": "",
                    "treatment": "",
                    "treatment_response": ""
                },
                "assessment": {
                    "suspicion_index": "",
                    "surgery_procedure": ""
                },
                "plan": {
                    "plan": "",
                    "md_recommendations": "",
                    "education": "",
                    "treatment_goals": ""
                },
                is_discharge: false,
                is_link_to_appointment: true,
                appointment_id: appointmentId,
            };
            CommonService._chartNotes.AddNewMedicalInterventionAPICall(medicalRecordId, payload)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, response?.data._id) + '?mode=add');
                    setIsMedicalRecordAddInProgress(false);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error?.error || "Error creating a medical intervention", "error");
                })
                .finally(() => {
                    setIsMedicalRecordAddInProgress(false);
                });
        },
        [navigate],
    );

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (clientId) {
            const payload = _.cloneDeep({...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['body_part_details'])});
            setIsMedicalRecordAddInProgress(true);
            payload.surgery_details = {};
            if (surgeryRecord) {
                payload.surgery_details = surgeryRecord;
                payload.surgery_details.reported_by = surgeryRecord.reported_by?._id;
            }
            payload.onset_date = CommonService.convertDateFormat(payload?.onset_date);
            if (payload.case_physician.next_appointment) {
                payload.case_physician.next_appointment = CommonService.convertDateFormat(payload?.case_physician?.next_appointment);
            }
            if (payload.surgery_details.surgery_date) {
                payload.surgery_details.surgery_date = CommonService.convertDateFormat(payload?.surgery_details?.surgery_date);
            }
            const formData = CommonService.getFormDataFromJSON(payload);
            CommonService._chartNotes.MedicalRecordAddAPICall(clientId, formData)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast('Medical record was successfully created', "success");
                    setIsMedicalRecordAddInProgress(true);
                    // navigate(CommonService._routeConfig.ClientMedicalRecordDetails(response?.data._id));
                    addNewTreatment(response?.data._id, payload?.appointment_id);
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setIsMedicalRecordAddInProgress(false);
                })
        }
    }, [clientId, surgeryRecord, addNewTreatment]);

    const onSurgeryRecordSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setSurgeryRecord(values);
        handleSurgeryRecordDrawerClose();
    }, [handleSurgeryRecordDrawerClose])

    return (
        <div className={'add-medical-record-screen'}>
            <DrawerComponent isOpen={isSurgeryRecordDrawerOpen}
                             showClose={true}
                             onClose={handleSurgeryRecordDrawerClose}
                             className={"t-surgery-record-drawer"}
            >
                <Formik
                    validationSchema={surgeryRecordValidationSchema}
                    initialValues={{...surgeryDetailsInitValues, ...surgeryRecord}}
                    onSubmit={onSurgeryRecordSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {
                        ({values, errors, touched, isValid, setFieldValue, validateForm}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <FormControlLabelComponent label={"Surgery Record"} size={'lg'}/>
                                    <div className={"t-surgery-record-drawer-form-controls"}>
                                        <Field name={'surgery_date'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={'Date of Surgery'}
                                                        placeholder={'Date of Surgery'}
                                                        formikField={field}
                                                        required={true}
                                                        maxDate={moment()}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'reported_by'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        value={CommonService.extractName(currentUser)}
                                                        label={'Reported by'}
                                                        disabled={true}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'surgeon_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Name of Surgeon'}
                                                        placeholder={'Enter Name of Surgeon'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'details'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Brief Details'}
                                                        placeholder={'Enter Details'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <div className={'attachment-heading'}>
                                            Attachment
                                        </div>
                                        {/*<FieldArray*/}
                                        {/*    name="documents"*/}
                                        {/*    render={arrayHelpers => (*/}
                                        {/*        <>*/}
                                        {/*            {values.documents && values.documents?.map((item: any, index: any) => {*/}
                                        {/*                return (*/}
                                        {/*                    <FilePreviewThumbnailComponent file={item}*/}
                                        {/*                                                   variant={"compact"}*/}
                                        {/*                                                   key={item.name + index}*/}
                                        {/*                                                   onRemove={() => {*/}
                                        {/*                                                       arrayHelpers.remove(index);*/}
                                        {/*                                                   }}*/}
                                        {/*                    />*/}
                                        {/*                )*/}
                                        {/*            })}*/}
                                        {/*        </>*/}
                                        {/*    )}/>*/}

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
                                        {/*<FilePickerComponent*/}
                                        {/*    maxFileCount={1}*/}
                                        {/*    id={"sv_upload_btn"}*/}
                                        {/*    onFilesDrop={(acceptedFiles, rejectedFiles) => {*/}
                                        {/*        if (acceptedFiles && acceptedFiles.length > 0) {*/}
                                        {/*            const file = acceptedFiles[0];*/}
                                        {/*            setFieldValue(`documents[${values.documents?.length || 0}]`, file);*/}
                                        {/*        }*/}
                                        {/*    }}*/}
                                        {/*    acceptedFilesText={"PNG, JPG and JPEG files are allowed upto 100MB"}*/}
                                        {/*    acceptedFileTypes={["pdf"]}*/}
                                        {/*/>*/}
                                        {
                                            (!values.attachment) && <>
                                                <FilePickerComponent maxFileCount={1}
                                                                     onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                         if (acceptedFiles && acceptedFiles.length > 0) {
                                                                             const file = acceptedFiles[0];
                                                                             setFieldValue('attachment', file);
                                                                         }
                                                                     }}
                                                                     acceptedFileTypes={["png", "jpg", "jpeg"]}
                                                                     acceptedFilesText={"PNG, JPG and JPEG files are allowed upto 100MB"}
                                                />
                                                {
                                                    (_.get(touched, "attachment") && !!(_.get(errors, "attachment"))) &&
                                                    <ErrorComponent
                                                        errorText={(_.get(errors, "attachment"))}/>
                                                }
                                            </>
                                        }
                                    </div>
                                    <div className="t-form-actions">
                                        <ButtonComponent fullWidth={true} type={'submit'}
                                                         disabled={!isValid}
                                        >
                                            Save
                                        </ButtonComponent>
                                    </div>
                                </Form>
                            )
                        }
                    }
                </Formik>
            </DrawerComponent>

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
                                isAppointmentListLiteLoading && <div>
                                    <LoaderComponent/>
                                </div>
                            }
                            {
                                isAppointmentListLiteLoadingFailed &&
                                <StatusCardComponent title={"Failed to fetch Appointment list"}/>
                            }
                            {
                                isAppointmentListLiteLoaded && <>

                                    {/*<FormDebuggerComponent values={values} errors={errors}/>*/}
                                    {
                                        !surgeryRecord && <div
                                            className={"add-new-medical-record-wrapper"}>
                                            {/*<PageHeaderComponent title={''} className={'display-flex'}/>*/}
                                            <div className={"add-new-medical-record-title"}>Add New Medical Record</div>
                                            <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                                             onClick={handleSurgeryRecordDrawerOpen}
                                            >
                                                Add Surgery Record
                                            </ButtonComponent>
                                        </div>
                                    }
                                    {
                                        surgeryRecord &&
                                        <CardComponent color={"primary"}>
                                            <div
                                                className={"display-flex flex-direction-row justify-content-space-between mrg-bottom-20"}>
                                                <FormControlLabelComponent label={"Surgery Record"}/>
                                                <div>
                                                    <ButtonComponent variant={"outlined"}
                                                                     color={"error"}
                                                                     className={"mrg-right-10"}
                                                                     prefixIcon={<ImageConfig.DeleteIcon/>}
                                                                     onClick={() => {
                                                                         setSurgeryRecord(null);
                                                                     }}
                                                    >
                                                        Delete
                                                    </ButtonComponent>
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
                                                            {surgeryRecord.surgery_date ? moment(surgeryRecord.surgery_date).format('DD-MMM-YYYY') : "NA"}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className="ts-col-md-6 ts-col-lg-3">
                                                        <DataLabelValueComponent label={"Reported By"}>
                                                            {surgeryRecord.reported_by?.first_name} {surgeryRecord.reported_by?.last_name}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className="ts-col-md-6 ts-col-lg-3">
                                                        <DataLabelValueComponent label={"Name of the Surgeon"}>
                                                            {surgeryRecord.surgeon_name || "NA"}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className="ts-col-md-6 ts-col-lg-3">
                                                        <DataLabelValueComponent label={"Brief Details"}>
                                                            {surgeryRecord.details || "NA"}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                </div>
                                                <div className="ts-row">
                                                    <div className="ts-col-12 surgery-record-documents">
                                                        <DataLabelValueComponent label={"Documents"}>
                                                            {
                                                                surgeryRecord.documents?.length === 0 && "NA"
                                                            }
                                                            {surgeryRecord.documents?.map((item: any, index: any) => {
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
                                                                label={'Date of Onset'}
                                                                placeholder={'Date of Onset'}
                                                                formikField={field}
                                                                maxDate={moment()}
                                                                required={true}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                    </CardComponent>

                                    <CardComponent title={"Appointment Details"} className={'appointment-container'}>

                                        {isAppointmentListLiteLoaded && <>

                                            <div className="ts-row">
                                                <div className="ts-col-lg-4">
                                                    <Field name={'appointment_id'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    formikField={field}
                                                                    required={true}
                                                                    options={appointmentListLite || []}
                                                                    fullWidth={true}
                                                                    label={"Select Appointment"}
                                                                    displayWith={(item: any) => item?.appointment_type + ' (' + (moment(item.appointment_date).format('DD-MMM-YYYY')) + ", " + CommonService.getHoursAndMinutesFromMinutes(item?.start_time) + ')'}
                                                                    valueExtractor={(item: any) => item?._id}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>
                                        </>
                                        }
                                    </CardComponent>

                                    <CardComponent title={"Case Physician Details"} className={'appointment-container'}>
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
                                                                        placeholder={"Enter Case Physician Name"}
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
                                                                        valueExtractor={(option) => option.code}
                                                                        label={'Treatment Script Received?'}
                                                                        id={'is_treated_script_received'}
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
                                                                        label={'Next MD Appointment'}
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
                                    <CardComponent title={"Injury Details"} className={'appointment-container'}>
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
                                                                                                id={`body_part_dd_${index}`}
                                                                                                onUpdate={(value) => {
                                                                                                    setFieldValue(`injury_details[${index}].body_part_details`, bodyPartList.find((item: any) => item?._id === value));
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
                                                                                                disabled={(values?.injury_details[index]?.body_part_details === "" || !values?.injury_details[index]?.body_part_details?.sides || values?.injury_details[index]?.body_part_details?.sides?.length === 0)}
                                                                                                options={values?.injury_details[index]?.body_part_details?.sides}
                                                                                                label={'Body Side'}
                                                                                                displayWith={(item: any) => item}
                                                                                                valueExtractor={(item: any) => item}
                                                                                                formikField={field}
                                                                                                required={values?.injury_details[index]?.body_part_details?.sides?.length > 0}
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
                                                                            <IconButtonComponent
                                                                                id={"delete_body_" + index}
                                                                                color={'error'}
                                                                                className={'mrg-top-10'}
                                                                                onClick={() => {
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
                                                                        Add Another Body Part
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
                                                                id={"injury_input"}
                                                                label={'Injury/Condition Description'}
                                                                placeholder={'Enter Injury/Condition Description'}
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
                                                                id={"limitations_input"}
                                                                label={'Restrictions/Limitations'}
                                                                placeholder={'Enter Restrictions/Limitations'}
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
                                        {clientId &&
                                        <LinkComponent route={CommonService._routeConfig.MedicalRecordList(clientId)}>
                                            <ButtonComponent // TODO: Add CTA to take back to the previous screen
                                                variant={"outlined"}
                                                size={'large'}
                                                className={isMedicalRecordAddInProgress ? 'mrg-right-15' : ''}
                                                disabled={isMedicalRecordAddInProgress}
                                                id={"medical_record_add_cancel_btn"}
                                            >
                                                Cancel
                                            </ButtonComponent>
                                        </LinkComponent>
                                        }
                                        &nbsp;
                                        <ButtonComponent
                                            isLoading={isMedicalRecordAddInProgress}
                                            type={"submit"}
                                            size={'large'}
                                            className={'mrg-left-15'}
                                            id={"medical_record_add_save_btn"}
                                        >
                                            {isMedicalRecordAddInProgress ? "Saving" : "Save"}
                                        </ButtonComponent>
                                    </div>
                                </>
                            }
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default AddMedicalRecordScreen;
