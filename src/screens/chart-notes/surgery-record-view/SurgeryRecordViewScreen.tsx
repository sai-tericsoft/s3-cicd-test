import "./SurgeryRecordViewScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
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
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import * as Yup from "yup";
import AttachmentComponent from "../../../shared/attachment/AttachmentComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import moment from "moment-timezone";
import commonService from "../../../shared/services/common.service";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import {ListItemButton} from "@mui/material";
import momentTimezone from "moment-timezone";
import LinkComponent from "../../../shared/components/link/LinkComponent";

interface SurgeryRecordViewScreenProps {

}

const bodyPartsColumns: any = [
    {
        title: "Body Part",
        dataIndex: "body_part",
        key: "body_part",
        width: 91,
        render: (item: any) => {
            return <>{item.body_part_details.name}</>
        }
    },
    {
        title: "Body  Side(s)",
        dataIndex: "body_side",
        key: "body_side",
        width: 114,
        render: (item: any) => {
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
    documents: [],
}
const surgeryRecordValidationSchema = Yup.object().shape({
    surgery_date: Yup.string().required("Surgery date is required"),
    reported_by: Yup.mixed().required("Reported by is required"),
});

const SurgeryRecordViewScreen = (props: SurgeryRecordViewScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // const [module, setModule] = useState<any>('');
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const {medicalRecordId, surgeryRecordId} = useParams();
    const [isBodyPartsModalOpen, setIsBodyPartsModalOpen] = React.useState<boolean>(false);
    const [surgeryRecordDetails, setSurgeryRecordDetails] = useState<any | null>(null);
    const [isSurgeryRecordDetailsLoading, setIsSurgeryRecordDetailsLoading] = React.useState<boolean>(false);

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
        const referrer: any = searchParams.get("referrer");
        const module_name: any = searchParams.get("module_name");
        // setModule(module_name);
        dispatch(setCurrentNavParams("Surgery Records", null, () => {
            if (referrer) {
                console.log(module_name, module_name);
                if (module_name === "client_module") {
                    console.log(module_name, module_name);
                    navigate(referrer);
                } else {
                    medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?referrer=' + referrer);
                }
            } else {
                medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }
        }));
    }, [searchParams, navigate, dispatch, medicalRecordId]);


    const openBodyPartsModal = useCallback(() => {
        setIsBodyPartsModalOpen(true);
    }, []);

    const closeBodyPartsModal = useCallback(() => {
        setIsBodyPartsModalOpen(false);
    }, []);


    const getSurgeryRecord = useCallback(
        (surgeryRecordId: string) => {
            setIsSurgeryRecordDetailsLoading(true);
            CommonService._chartNotes.FetchSurgeryRecordAPICall(surgeryRecordId, {})
                .then((response: IAPIResponseType<any>) => {
                    setSurgeryRecordDetails(response.data);
                    setIsSurgeryRecordDetailsLoading(false);
                })
                .catch((error: any) => {
                    setIsSurgeryRecordDetailsLoading(false);
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

    const [isAttachAddInProgress, setIsAttachAddInProgress] = useState<boolean>(false);

    const deleteSurgeryAttachment = useCallback(
        (surgeryRecordId: string, attachmentId: string) => {
            CommonService.onConfirm({
                image: ImageConfig.Confirm,
                // showLottie: true,
                confirmationTitle: "DELETE ATTACHMENT",
                confirmationDescription: <div className="delete-document">
                    <div className={'delete-document-text text-center '}>Are you sure you want to delete this
                        attachment?
                    </div>
                </div>
            }).then((response: any) => {
                CommonService._chartNotes.RemoveSurgeryRecordAttachmentAPICall(surgeryRecordId, attachmentId)
                    .then((response: IAPIResponseType<any>) => {
                        // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        getSurgeryRecord(surgeryRecordId);
                    })
                    .catch((error: any) => {
                        CommonService._alert.showToast(error, "error");
                        getSurgeryRecord(surgeryRecordId);
                    });
            });

        },
        [getSurgeryRecord],
    );

    const handleShareSurgeryRecord = useCallback((surgeryRecordId: string) => {
        CommonService.onConfirm({
            image: ImageConfig.PopupLottie,
            showLottie: true,
            confirmationTitle: "SHARE WITH CLIENT",
            confirmationDescription: <div className="delete-document">
                <div className={'delete-document-text text-center '}>Are you sure you want to share this
                    document <br/> with the client?
                </div>
            </div>
        }).then(() => {
            try {
                CommonService._chartNotes.UpdateSurgeryRecordAPICall(surgeryRecordId, {is_shared: true})
                    .then((response: IAPIResponseType<any>) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        getSurgeryRecord(surgeryRecordId);
                        // medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=medicalRecord');
                    }).catch((error: any) => {
                    CommonService._alert.showToast(error, "error");
                })
            } catch (error: any) {
                CommonService._alert.showToast(error, "error");
            }
        })
    }, [getSurgeryRecord]);

    const handleRemoveAccess = useCallback((item: any) => {
        CommonService.onConfirm({
            image: ImageConfig.PopupLottie,
            showLottie: true,
            confirmationTitle: "REMOVE ACCESS",
            confirmationSubTitle: "Are you sure you want to remove access for this shared record?",
        })
            .then((res: any) => {
                try {
                    CommonService._chartNotes.UpdateSurgeryRecordAPICall(item._id, {is_shared: false})
                        .then((response: IAPIResponseType<any>) => {
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                            getSurgeryRecord(item._id);
                        })
                        .catch((error: any) => {
                            CommonService._alert.showToast(error, "error");
                        });
                } catch (error: any) {
                    CommonService._alert.showToast(error, "error");
                }
            })
    }, [getSurgeryRecord]);


    const onAttachmentSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (surgeryRecordDetails) {
            setIsAttachAddInProgress(true);
            values.attachment.forEach((attachment: any) => {
                const formData = CommonService.getFormDataFromJSON({attachment});
                CommonService._chartNotes.AddSurgeryRecordAttachmentAPICall(surgeryRecordDetails._id, formData)
                    .then((response: IAPIResponseType<any>) => {
                        // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        // setShowAddAttachment(false);
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
        const payload = {
            ...values,
            surgery_date: moment(values.surgery_date).format("YYYY-MM-DD")
        }
        if (surgeryRecordId) {
            setIsEditInProgress(true);
            CommonService._chartNotes.UpdateSurgeryRecordAPICall(surgeryRecordId, payload)
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

    const handleDeleteSurgeryRecord = useCallback(() => {
        CommonService.onConfirm({
            image: ImageConfig.ConfirmationLottie,
            showLottie: true,
            confirmationTitle: "DELETE SURGERY RECORD",
            confirmationDescription: <div className="delete-document">
                <div className={'delete-document-text text-center '}>Are you sure you want to delete this surgery
                    record <br/> from this file?
                </div>
            </div>
        }).then((response: any) => {
                if (surgeryRecordId) {
                    CommonService._chartNotes.SurgeryRecordDeleteAPICall(surgeryRecordId)
                        .then((response: IAPIResponseType<any>) => {
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                            (medicalRecordId) && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
                        })
                        .catch((error: any) => {
                            CommonService._alert.showToast(error, "error");
                        });
                }
            }
        )
    }, [medicalRecordId, surgeryRecordId, navigate]);

    const handlePrint = useCallback(() => {
        const payload = {
            timezone: momentTimezone.tz.guess(),
        }
        if (medicalRecordId && surgeryRecordId) {
            CommonService._chartNotes.PrintSurgeryRecord(medicalRecordId, surgeryRecordId, payload)
                .then((res: any) => {
                    const attachment = {
                        type: 'application/pdf',
                        url: res.data.url,
                        name: 'progress report',
                        key: ''
                    };
                    CommonService.printAttachment(attachment);
                })
                .catch((err: any) => {
                    console.log(err);
                })
        }
    }, [surgeryRecordId, medicalRecordId]);


    return (
        <div className={'medical-intervention-surgery-record-screen'}>

            <DrawerComponent isOpen={isEditSurgeryRecordDrawerOpen} showClose={true}
                             className={'edit-medical-record-drawer'}
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
                        {({values, isValid, touched, errors, setFieldValue, validateForm}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <FormControlLabelComponent label={"Edit Surgery Record"} size={'xl'}/>
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
                                                        label={'Brief Surgical Details'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    {/*<div className={'attachment-heading'}>*/}
                                    {/*    Attachment*/}
                                    {/*</div>*/}
                                    {/*<>*/}
                                    {/*    {*/}
                                    {/*        (!values.attachment) && <>*/}
                                    {/*            <FilePickerComponent maxFileCount={1}*/}
                                    {/*                                 onFilesDrop={(acceptedFiles, rejectedFiles) => {*/}
                                    {/*                                     if (acceptedFiles && acceptedFiles.length > 0) {*/}
                                    {/*                                         const file = acceptedFiles[0];*/}
                                    {/*                                         setFieldValue('attachment', file);*/}
                                    {/*                                     }*/}
                                    {/*                                 }}*/}
                                    {/*                                 acceptedFileTypes={[ "png", "jpg", "jpeg"]}*/}
                                    {/*                                 acceptedFilesText={"PNG, JPG and JPEG files are allowed upto 100MB"}*/}
                                    {/*            />*/}
                                    {/*            {*/}
                                    {/*                (_.get(touched, "attachment") && !!(_.get(errors, "attachment"))) &&*/}
                                    {/*                <ErrorComponent*/}
                                    {/*                    errorText={(_.get(errors, "attachment"))}/>*/}
                                    {/*            }*/}
                                    {/*        </>*/}
                                    {/*    }*/}
                                    {/*</>*/}
                                    {/*<>*/}
                                    {/*    {*/}
                                    {/*        (values.attachment) && <>*/}
                                    {/*            <FilePreviewThumbnailComponent*/}

                                    {/*                file={values.attachment}*/}
                                    {/*                onRemove={() => {*/}
                                    {/*                    setFieldValue('attachment', undefined);*/}
                                    {/*                }}*/}
                                    {/*            />*/}
                                    {/*        </>*/}
                                    {/*    }*/}
                                    {/*</>*/}
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
            </DrawerComponent>
            <ModalComponent isOpen={isBodyPartsModalOpen} onClose={closeBodyPartsModal}>
                <FormControlLabelComponent label={'View All Body Parts'} className={'view-all-body-parts-header'}/>
                <TableComponent data={clientMedicalRecord?.injury_details} columns={bodyPartsColumns}/>
                <div className={'close-modal-btn'}>
                    <ButtonComponent variant={'contained'} onClick={closeBodyPartsModal}>Close</ButtonComponent>
                </div>
            </ModalComponent>
            <PageHeaderComponent title={'View Surgery Record'}
                                 actions={
                                     <div className="last-updated-status">
                                         <div className="last-updated-status-text">Last updated on:&nbsp;</div>
                                         {isClientMedicalRecordLoaded &&
                                             <div
                                                 className="last-updated-status-bold">
                                                 {(surgeryRecordDetails?.updated_at ? moment(surgeryRecordDetails.updated_at).tz(moment.tz.guess()).format('DD-MMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                                                 {surgeryRecordDetails?.last_updated_by_details?.first_name ? surgeryRecordDetails?.last_updated_by_details?.first_name + ' ' + surgeryRecordDetails?.last_updated_by_details?.last_name : ' NA'}
                                             </div>
                                         }
                                     </div>}/>
            {
                isSurgeryRecordDetailsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                (isClientMedicalRecordLoaded && clientMedicalRecord) && <>
                    {
                        surgeryRecordDetails?.is_shared &&
                        <div className={"medical-record-attachment-remove-access-wrapper"}>
                            <div className={"medical-record-attachment-data-wrapper"}>
                                This file was shared to the client
                                on <b>{surgeryRecordDetails?.shared_at ? CommonService.transformTimeStamp(surgeryRecordDetails?.shared_at) : 'N/A'}</b>.
                            </div>
                            <LinkComponent className={'remove-access'}
                                           onClick={() => {
                                               handleRemoveAccess(surgeryRecordDetails);
                                           }}

                            >
                                Remove Access
                            </LinkComponent>
                        </div>
                    }
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                            <span
                                                className={clientMedicalRecord?.client_details?.is_alias_name_set ? 'alias-name' : ''}>
                                                {commonService.generateClientNameFromClientDetails(clientMedicalRecord?.client_details)}
                                                </span>
                                            </span>
                                        <ChipComponent className={clientMedicalRecord?.status ? "active" : "inactive"}
                                                       size={'small'}
                                                       label={clientMedicalRecord?.status_details?.title || "-"}/>
                                    </span>
                            <div className="ts-row width-auto">
                                {/*{surgeryRecordId && <ButtonComponent prefixIcon={<ImageConfig.ShareIcon/>}*/}
                                {/*                                     onClick={() => handleShareSurgeryRecord(surgeryRecordId)}*/}
                                {/*                                     className={'mrg-right-20'}>*/}
                                {/*    Share*/}
                                {/*</ButtonComponent>}*/}
                                {/*<ButtonComponent variant={'outlined'} color={'error'} className={'mrg-right-20'}*/}
                                {/*                 onClick={handleDeleteSurgeryRecord}*/}
                                {/*                 prefixIcon={<ImageConfig.DeleteIcon/>}>Delete Surgery*/}
                                {/*    Record</ButtonComponent>*/}
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                 variant={'outlined'}
                                                 className={'mrg-right-10'}
                                                 onClick={setIsEditSurgeryRecordDrawerOpen.bind(null, true)}>
                                    Edit Details
                                </ButtonComponent>
                                <MenuDropdownComponent className={'billing-details-drop-down-menu'} menuBase={
                                    <ButtonComponent variant={'outlined'} fullWidth={true}
                                    >
                                        Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                                    </ButtonComponent>
                                } menuOptions={
                                    surgeryRecordId && medicalRecordId ? [
                                        <ListItemButton onClick={() => handleShareSurgeryRecord(surgeryRecordId)}>
                                            Share
                                        </ListItemButton>,
                                        <ListItemButton onClick={handlePrint}>
                                            Print
                                        </ListItemButton>,
                                        <ListItemButton onClick={handleDeleteSurgeryRecord}>
                                            Delete Surgery
                                            Record
                                        </ListItemButton>,
                                    ] : [<ListItemButton onClick={handleDeleteSurgeryRecord}>
                                        Delete Surgery
                                        Record
                                    </ListItemButton>]}/>
                            </div>
                        </div>
                        <DataLabelValueComponent label={'Surgery Linked to:'} direction={"row"}
                                                 className={'intervention-injury-details-wrapper'}>
                            <div className={'client-intervention'}>{clientMedicalRecord?.intervention_linked_to}
                                {clientMedicalRecord?.created_at && CommonService.transformTimeStamp(clientMedicalRecord?.created_at)}{" "}
                                {"-"} {clientMedicalRecord?.injury_details.map((injury: any, index: number) => {
                                    return <>{" "}{injury.body_part_details.name}({injury.body_side}){index !== clientMedicalRecord?.injury_details.length - 1 ? <>,</> : ""}</>
                                })}</div>
                            <span className={'view-all-body-parts'}
                                  onClick={openBodyPartsModal}> View All Body Parts </span>
                        </DataLabelValueComponent>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Date of Surgery'}>
                                    {CommonService.convertDateFormat2(surgeryRecordDetails?.surgery_date) || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-2'}></div>
                            <div className={'ts-col-md-2'}>
                                <DataLabelValueComponent label={'Name of Surgeon'}>
                                    {surgeryRecordDetails?.surgeon_name || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-3'}></div>
                            <div className={'ts-col-md-2'}>
                                <DataLabelValueComponent label={'Reported By'}>
                                    {(surgeryRecordDetails?.reported_by_details?.first_name || '"N/A"') + ' ' + (surgeryRecordDetails?.reported_by_details?.last_name || '')}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-12'}>
                                <DataLabelValueComponent label={'Brief Surgical Details'}>
                                    {surgeryRecordDetails?.details || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>

                    {/*<div className="ts-col-12 text-right">*/}
                    {/*    <ButtonComponent*/}
                    {/*        disabled={surgeryRecordDetails?.attachments?.length > 0}*/}
                    {/*        onClick={setShowAddAttachment.bind(null, true)}*/}
                    {/*    >*/}
                    {/*        Add Attachment*/}
                    {/*    </ButtonComponent>*/}
                    {/*</div>*/}

                </>
            }
            <div className="ts-row mrg-top-20">
                <div className="ts-col">
                    {surgeryRecordDetails && surgeryRecordId && surgeryRecordDetails?.attachments?.map((attachment: any, index: number) => {
                        return (
                            <AttachmentComponent
                                attachment={attachment}
                                key={attachment?._id + index}
                                showDelete={true}
                                onDelete={() => deleteSurgeryAttachment(surgeryRecordId, attachment?._id)}/>
                        )
                    })}
                </div>
            </div>

            {/*<DrawerComponent isOpen={showAddAttachment} showClose={true} className={'edit-medical-record-drawer'}*/
            }
            {/*                 onClose={setShowAddAttachment.bind(null, false)}>*/
            }
            {
                surgeryRecordDetails && !surgeryRecordDetails?.attachments?.length &&
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
                                    <div className={"t-surgery-record-drawer-form-controls"}>
                                        <FieldArray
                                            name="attachment"
                                            render={arrayHelpers => (
                                                <>
                                                    {values?.attachment && values?.attachment?.map((item: any, index: any) => {
                                                        return (
                                                            <FilePreviewThumbnailComponent file={item}
                                                                                           key={item.name + index}
                                                                                           onRemove={() => {
                                                                                               arrayHelpers.remove(index);
                                                                                           }}
                                                            />
                                                        )
                                                    })}
                                                </>
                                            )}/>
                                        {values?.attachment.length === 0 && <>
                                            <FormControlLabelComponent label={"Upload Attachment:"}
                                                                       className={'attachment-heading'}/>

                                            <FilePickerComponent
                                                maxFileCount={1}
                                                id={"sv_upload_btn"}
                                                onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                    if (acceptedFiles && acceptedFiles.length > 0) {
                                                        const file = acceptedFiles[0];
                                                        setFieldValue(`attachment[${values?.attachment?.length || 0}]`, file);
                                                    }
                                                }}
                                                acceptedFileTypes={["png", "jpeg", "pdf"]}
                                                acceptedFilesText={"PNG, JPEG and PDF files are allowed upto 100MB"}
                                            /></>}

                                    </div>
                                    <div className="t-form-actions mrg-top-20">
                                        <ButtonComponent
                                            variant={"outlined"}
                                            onClick={() => setFieldValue('attachment', [])}
                                            disabled={values?.attachment?.length === 0}
                                        >
                                            Cancel
                                        </ButtonComponent>&nbsp;
                                        <ButtonComponent type={'submit'}
                                                         className={'mrg-left-15'}
                                                         isLoading={isAttachAddInProgress}
                                                         disabled={!isValid || isAttachAddInProgress}>
                                            Update
                                        </ButtonComponent>
                                    </div>
                                </Form>)
                        }
                        }
                    </Formik>
                </div>
            }
            {/*</DrawerComponent>*/
            }

        </div>
    )
        ;

};

export default SurgeryRecordViewScreen;
