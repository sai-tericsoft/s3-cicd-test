import "./SurgeryRecordViewScreen.scss";
import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {ImageConfig, Misc} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import moment from "moment";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import * as Yup from "yup";
import AttachmentComponent from "../../../shared/attachment/AttachmentComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";

interface SurgeryRecordViewScreenProps {

}

const bodyPartsColumns: any = [
    {
        title: "Body Part",
        dataIndex: "body_part",
        key: "body_part",
        width: 91,
        render: ( item: any) => {
            return <>{item.body_part_details.name}</>
        }
    },
    {
        title: "Body  Side(s)",
        dataIndex: "body_side",
        key: "body_side",
        width: 114,
        render: ( item: any) => {
            return <>{item?.body_side}</>
        }
    }
];

const addSurgeryRecordAttachmentFormInitialValues: any = {
    attachment: []
};


const addSurgeryRecordAttachmentValidationSchema = Yup.object().shape({
    attachment: Yup.array().required().min(1)
});

const surgeryRecordInitValues = {
    surgery_date: "",
    reported_by: undefined,
    surgeon_name: "",
    details: "",
}
const surgeryRecordValidationSchema = Yup.object().shape({
    surgery_date: Yup.string().required("Surgery date is required"),
    reported_by: Yup.mixed().required("Reported by is required"),
});

const SurgeryRecordViewScreen = (props: SurgeryRecordViewScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentUser}=useSelector((state:IRootReducerState)=>state.account);
    const {medicalRecordId, surgeryRecordId} = useParams();
    const [isBodyPartsModalOpen, setIsBodyPartsModalOpen] = React.useState<boolean>(false);

    const {
        clientMedicalRecord,
        isClientMedicalRecordLoaded,
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [medicalRecordId, dispatch]);

    useEffect(() => {
        if (clientMedicalRecord?.client_id) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.MedicalRecordList(clientMedicalRecord?.client_id));
            }));
        }
    }, [navigate, dispatch, clientMedicalRecord?.client_id]);

    const openBodyPartsModal = useCallback(() => {
        setIsBodyPartsModalOpen(true);
    }, []);

    const closeBodyPartsModal = useCallback(() => {
        setIsBodyPartsModalOpen(false);
    }, []);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }
    }, [navigate, dispatch, medicalRecordId]);

    const [surgeryRecordDetails, setSurgeryRecordDetails] = useState<any | null>(null)
    const getSurgeryRecord = useCallback(
        (surgeryRecordId: string) => {
            CommonService._chartNotes.FetchSurgeryRecordAPICall(surgeryRecordId, {})
                .then((response: IAPIResponseType<any>) => {
                    setSurgeryRecordDetails(response.data);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error, "error");
                    setSurgeryRecordDetails(null);
                });
        },
        [],
    );

    useEffect(() => {
        if (surgeryRecordId) {
            getSurgeryRecord(surgeryRecordId);
        }
    }, [getSurgeryRecord, surgeryRecordId]);

    const [showAddAttachment, setShowAddAttachment] = useState<boolean>(false);
    const [isAttachAddInProgress, setIsAttachAddInProgress] = useState<boolean>(false);

    const deleteSurgeryAttachment = useCallback(
        (surgeryRecordId: string, attachmentId: string) => {
            CommonService._chartNotes.RemoveSurgeryRecordAttachmentAPICall(surgeryRecordId, attachmentId)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    getSurgeryRecord(surgeryRecordId);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error, "error");
                    getSurgeryRecord(surgeryRecordId);
                });
        },
        [getSurgeryRecord],
    );


    const onAttachmentSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (surgeryRecordDetails) {
            setIsAttachAddInProgress(true);
            values.attachment.forEach((attachment: any) => {
                const formData = CommonService.getFormDataFromJSON({attachment});
                CommonService._chartNotes.AddSurgeryRecordAttachmentAPICall(surgeryRecordDetails._id, formData)
                    .then((response: IAPIResponseType<any>) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        setShowAddAttachment(false);
                        getSurgeryRecord(surgeryRecordDetails._id);
                    })
                    .catch((error: any) => {
                        CommonService.handleErrors(setErrors, error, true);
                    })
                    .finally(() => {
                        setIsAttachAddInProgress(false);
                    })
            })
        }
    }, [surgeryRecordDetails, getSurgeryRecord]);

    const [isEditSurgeryRecordDrawerOpen, setIsEditSurgeryRecordDrawerOpen] = useState<boolean>(false);
    const [isEditInProgress, setIsEditInProgress] = useState<boolean>(false);
    const onEditSurgerySubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (surgeryRecordId) {
            setIsEditInProgress(true);
            if (values.surgery_date) {
                values.surgery_date = CommonService.convertDateFormat(values?.surgery_date);
            }
            CommonService._chartNotes.UpdateSurgeryRecordAPICall(surgeryRecordId, values)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setIsEditSurgeryRecordDrawerOpen(false);
                    getSurgeryRecord(surgeryRecordId);
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                })
                .finally(() => {
                    setIsEditInProgress(false);
                })
        }
    }, [surgeryRecordId, getSurgeryRecord]);
    return (
        <div className={'medical-intervention-surgery-record-screen'}>
            <DrawerComponent isOpen={showAddAttachment} showClose={true}
                             onClose={setShowAddAttachment.bind(null, false)}>
                <div className={'edit-medical-record-component'}>
                    <Formik
                        validationSchema={addSurgeryRecordAttachmentValidationSchema}
                        initialValues={addSurgeryRecordAttachmentFormInitialValues}
                        onSubmit={onAttachmentSubmit}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}>
                        {({values, isValid, errors, setFieldValue, validateForm}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <FormControlLabelComponent label={"Add Surgery Attachment"}/>
                                    <div className={"t-surgery-record-drawer-form-controls"}>
                                        <FieldArray
                                            name="attachment"
                                            render={arrayHelpers => (
                                                <>
                                                    {values?.attachment && values?.attachment?.map((item: any, index: any) => {
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
                                                    setFieldValue(`attachment[${values?.attachment?.length || 0}]`, file);
                                                }
                                            }}
                                            acceptedFilesText={"PDF files are allowed"}
                                            acceptedFileTypes={["pdf"]}
                                        />
                                    </div>
                                    <div className="t-form-actions mrg-top-20">
                                        <ButtonComponent fullWidth={true} type={'submit'}
                                                         isLoading={isAttachAddInProgress}
                                                         disabled={!isValid || isAttachAddInProgress}>
                                            Save
                                        </ButtonComponent>
                                    </div>
                                </Form>)
                        }
                        }
                    </Formik>
                </div>
            </DrawerComponent>
            {surgeryRecordDetails && <DrawerComponent isOpen={isEditSurgeryRecordDrawerOpen} showClose={true}
                                                      onClose={setIsEditSurgeryRecordDrawerOpen.bind(null, false)}>
                <div className={'edit-medical-record-component'}>
                    <Formik
                        validationSchema={surgeryRecordValidationSchema}
                        initialValues={{
                            ...surgeryRecordInitValues,
                            reported_by: surgeryRecordDetails?.reported_by,
                            surgery_date: surgeryRecordDetails?.surgery_date,
                            surgeon_name: surgeryRecordDetails?.surgeon_name,
                            details: surgeryRecordDetails?.details,

                        }}
                        onSubmit={onEditSurgerySubmit}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}>
                        {({values, isValid, errors, setFieldValue, validateForm}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <FormControlLabelComponent label={"Edit Surgery Record"}/>
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
                                        <InputComponent className="t-form-control"
                                                        label={'Reported By'}
                                                        placeholder={'Reported By'}
                                                        value={CommonService.extractName(currentUser)}
                                                        fullWidth={true}
                                                        disabled={true}
                                        />
                                        <Field name={'surgeon_name'}>
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
                                        <Field name={'details'}>
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
                                    </div>
                                    <div className="t-form-actions mrg-top-20">
                                        <ButtonComponent fullWidth={true} type={'submit'}
                                                         isLoading={isEditInProgress}
                                                         disabled={!isValid || isEditInProgress}>
                                            Save
                                        </ButtonComponent>
                                    </div>
                                </Form>)
                        }
                        }
                    </Formik>
                </div>
            </DrawerComponent>}
            <ModalComponent isOpen={isBodyPartsModalOpen} onClose={closeBodyPartsModal}>
                <FormControlLabelComponent label={'View All Body Parts'} className={'view-all-body-parts-header'}/>
                <TableComponent data={clientMedicalRecord?.injury_details} columns={bodyPartsColumns}/>
                <div className={'close-modal-btn'}>
                    <ButtonComponent variant={'contained'} onClick={closeBodyPartsModal}>Close</ButtonComponent>
                </div>
            </ModalComponent>
            {
                (isClientMedicalRecordLoaded && clientMedicalRecord) && <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                        {clientMedicalRecord?.client_details?.first_name || "-"} {clientMedicalRecord?.client_details?.last_name || "-"}
                                            </span>
                                        <ChipComponent className={clientMedicalRecord?.status ? "active" : "inactive"}
                                                       size={'small'}
                                                       label={clientMedicalRecord?.status || "-"}/>
                                    </span>
                            <div className="ts-row width-auto">
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                 onClick={setIsEditSurgeryRecordDrawerOpen.bind(null, true)}>
                                    Edit Details
                                </ButtonComponent>
                            </div>
                        </div>
                        <DataLabelValueComponent label={'Surgery Linked to:'} direction={"row"}
                                                 className={'intervention-injury-details-wrapper'}>
                            <div className={'client-intervention'}>{clientMedicalRecord?.intervention_linked_to}
                                {clientMedicalRecord?.created_at && CommonService.transformTimeStamp(clientMedicalRecord?.created_at)}{" "}
                                {"-"} {clientMedicalRecord?.injury_details.map((injury: any, index: number) => {
                                    return <>{injury.body_part_details.name}({injury.body_side}) {index !== clientMedicalRecord?.injury_details.length - 1 ? <> | </> : ""}</>
                                })}</div>
                            <span className={'view-all-body-parts'}
                                  onClick={openBodyPartsModal}> View All Body Parts </span>
                        </DataLabelValueComponent>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Date of Surgery'}>
                                    {CommonService.transformTimeStamp(surgeryRecordDetails?.surgery_date) || "-"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-2'}></div>
                            <div className={'ts-col-md-2'}>
                                <DataLabelValueComponent label={'Name of Surgeon'}>
                                    {surgeryRecordDetails?.surgeon_name || "-"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-3'}></div>
                            <div className={'ts-col-md-2'}>
                                <DataLabelValueComponent label={'Reported By'}>
                                    {(surgeryRecordDetails?.reported_by_details?.first_name || '-') + ' ' + (surgeryRecordDetails?.reported_by_details?.last_name || '')}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-12'}>
                                <DataLabelValueComponent label={'Brief Details'}>
                                    {surgeryRecordDetails?.details || "-"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                </>
            }
            <div className="ts-col-12 text-right">
                <ButtonComponent
                    prefixIcon={<ImageConfig.AddIcon/>}
                    onClick={
                        setShowAddAttachment.bind(null, true)
                    }
                >
                    Add Attachment
                </ButtonComponent>
            </div>
            <div className="ts-row mrg-top-20">
                <div className="ts-col">
                    {surgeryRecordDetails && surgeryRecordId && surgeryRecordDetails.attachments.map((attachment: any, index: number) => {
                        return (
                            <AttachmentComponent attachment={attachment} key={attachment?._id + index}
                                                 onDelete={() => deleteSurgeryAttachment(surgeryRecordId, attachment._id)}/>
                        )
                    })}
                </div>
            </div>

        </div>
    );

};

export default SurgeryRecordViewScreen;
