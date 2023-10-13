import "./ViewDryNeedlingFileScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import MedicalRecordAttachmentBasicDetailsCardComponent
    from "../medical-record-attachment-basic-details-card/MedicalRecordAttachmentBasicDetailsCardComponent";
import AttachmentComponent from "../../../shared/attachment/AttachmentComponent";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import {useDispatch} from "react-redux";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import EditDryNeedlingFileComponent from "../edit-dry-needling-file/EditDryNeedlingFileComponent";
import {ImageConfig, Misc} from "../../../constants";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";

interface ViewDryNeedlingFileScreenProps {

}

const ViewDryNeedlingFileScreen = (props: ViewDryNeedlingFileScreenProps) => {

        const {medicalRecordId, dryNeedlingFileId} = useParams();
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [dryNeedlingFileDetails, setDryNeedlingFileDetails] = useState<any>(undefined);
        const [isDryNeedlingFileDetailsLoaded, setIsDryNeedlingFileDetailsLoaded] = useState<boolean>(false);
        const [isDryNeedlingFileDetailsLoading, setIsDryNeedlingFileDetailsLoading] = useState<boolean>(false);
        const [isDryNeedlingFileDetailsLoadingFailed, setIsDryNeedlingFileDetailsLoadingFailed] = useState<boolean>(false);
        const [isEditDryNeedlingFileDrawerOpened, setIsEditDryNeedlingFileDrawerOpened] = useState<boolean>(false);
        const [isDryNeedlingAttachmentDeleting, setIsDryNeedlingAttachmentDeleting] = useState<boolean>(false);
        const [isDryNeedlingAttachmentAdding, setIsDryNeedlingAttachmentAdding] = useState<boolean>(false);
        const [dryNeedlingFileAttachmentFile, setDryNeedlingFileAttachmentFile] = useState<any>(undefined);
        const [searchParams] = useSearchParams();

        const openEditDryNeedlingFileDrawer = useCallback(() => {
            setIsEditDryNeedlingFileDrawerOpened(true);
        }, []);

        const closeEditDryNeedlingFileDrawer = useCallback(() => {
            setIsEditDryNeedlingFileDrawerOpened(false);
        }, []);

        const getDryNeedlingFileDetails = useCallback(() => {
            if (dryNeedlingFileId) {
                setIsDryNeedlingFileDetailsLoading(true);
                setIsDryNeedlingFileDetailsLoadingFailed(false);
                setIsDryNeedlingFileDetailsLoaded(false);
                CommonService._chartNotes.DryNeedlingFileDetailsAPICall(dryNeedlingFileId, {})
                    .then((response: any) => {
                        setDryNeedlingFileDetails(response.data);
                        setIsDryNeedlingFileDetailsLoading(false);
                        setIsDryNeedlingFileDetailsLoadingFailed(false);
                        setIsDryNeedlingFileDetailsLoaded(true);
                    }).catch((error: any) => {
                    setIsDryNeedlingFileDetailsLoading(false);
                    setIsDryNeedlingFileDetailsLoadingFailed(true);
                    setIsDryNeedlingFileDetailsLoaded(false);
                });
            }
        }, [dryNeedlingFileId]);

        const handleEditDryNeedlingFile = useCallback(() => {
            getDryNeedlingFileDetails();
            setIsEditDryNeedlingFileDrawerOpened(false);
        }, [getDryNeedlingFileDetails]);

        useEffect(() => {
            if (medicalRecordId) {
                const referrer: any = searchParams.get("referrer");
                const module_name: any = searchParams.get("module_name");
                const active_tab: any = searchParams.get("activeTab");

                dispatch(setCurrentNavParams("View Dry Needling File", null, () => {
                    if (referrer && referrer !== "undefined" && referrer !== "null") {
                        if (module_name === "client_module") {
                            navigate(referrer);
                        } else {
                            navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?referrer=' + referrer + '&activeTab=' + active_tab);
                        }
                    } else {
                        navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=' + active_tab);
                    }
                }));
            }
        }, [searchParams, navigate, dispatch, medicalRecordId]);

        const handleDryNeedlingFileDelete = useCallback(() => {
            CommonService.onConfirm({
                image: ImageConfig.PopupLottie,
                showLottie: true,
                confirmationTitle: "DELETE ATTACHMENT",
                confirmationSubTitle: "Are you sure you want to delete this attachment\n" +
                    "from this file?"
            }).then(() => {
                setIsDryNeedlingAttachmentDeleting(true);
                if (dryNeedlingFileId) {
                    CommonService._chartNotes.DryNeedlingFileDeleteAttachmentAPICall(dryNeedlingFileId, {})
                        .then((response: any) => {
                            setDryNeedlingFileDetails((prevState: any) => {
                                return {
                                    ...prevState,
                                    attachment: null
                                }
                            });
                            setIsDryNeedlingAttachmentDeleting(false);
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully deleted attachment", "success");
                        }).catch((error: any) => {
                        setIsDryNeedlingAttachmentDeleting(false);
                        CommonService._alert.showToast(error?.error || "Error deleting an attachment", "success");
                    });
                } else {
                    CommonService._alert.showToast('Dry Needling File Id is missing', "error");
                }
            });
        }, [dryNeedlingFileId]);

        const handleDryNeedlingDocumentDelete = useCallback(() => {
            CommonService.onConfirm({
                image: ImageConfig.ConfirmationLottie,
                showLottie: true,
                confirmationTitle: "DELETE DOCUMENT",
                // confirmationSubTitle: "Are you sure you want to delete this document\n" +
                //     "from this file?"
                confirmationDescription: <div className="delete-document">
                    <div className={'delete-document-text text-center '}>Are you sure you want to delete this
                        document <br/> from this file?
                    </div>
                </div>
            }).then(() => {
                if (dryNeedlingFileId) {
                    CommonService._chartNotes.DryNeedlingDocumentDelete(dryNeedlingFileId, {})
                        .then((response: any) => {
                                const referrer: any = searchParams.get("referrer");
                                const module_name: any = searchParams.get("module_name");
                                if (module_name === "client_module") {
                                    navigate(referrer);
                                } else {
                                    medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=attachmentList');
                                }
                                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully deleted document", "success");
                            }
                        ).catch((error: any) => {
                        CommonService._alert.showToast(error?.error || "Error deleting document", "success");
                    })
                }
            });
        }, [dryNeedlingFileId, medicalRecordId, navigate]);

        const handleDryNeedlingFileAttachmentAdd = useCallback(() => {
            if (dryNeedlingFileId) {
                const payload = {
                    attachment: dryNeedlingFileAttachmentFile
                };
                const formData = CommonService.getFormDataFromJSON(payload);
                setIsDryNeedlingAttachmentAdding(true);
                CommonService._chartNotes.DryNeedlingFileAddAttachmentAPICall(dryNeedlingFileId, formData)
                    .then((response: any) => {
                        setDryNeedlingFileDetails((prevState: any) => {
                            return {
                                ...prevState,
                                attachment: response.data
                            }
                        });
                        setIsDryNeedlingAttachmentAdding(false);
                        setDryNeedlingFileAttachmentFile(undefined);
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully added attachment", "success");
                    }).catch((error: any) => {
                    setIsDryNeedlingAttachmentAdding(false);
                    CommonService._alert.showToast(error?.error || "Error adding an attachment", "success");
                });
            } else {
                CommonService._alert.showToast('Dry Needling File Id is missing', "error");
            }
        }, [dryNeedlingFileAttachmentFile, dryNeedlingFileId]);

        const handleDryNeedlingShare = useCallback(() => {
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
                if (dryNeedlingFileId) {
                    CommonService._chartNotes.DryNeedlingFileEditAPICall(dryNeedlingFileId, {is_shared: true})
                        .then((response: any) => {
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully shared document", "success");
                            medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=attachmentList');
                        }).catch((error: any) => {
                        CommonService._alert.showToast(error?.error || "Error sharing document", "success");
                    });
                }
            })
        }, [dryNeedlingFileId, medicalRecordId, navigate]);

        useEffect(() => {
            if (dryNeedlingFileId) {
                getDryNeedlingFileDetails();
            }
        }, [getDryNeedlingFileDetails, dryNeedlingFileId]);

        return (
            <div className={'view-dry-needling-file-screen'}>
                {
                    isDryNeedlingFileDetailsLoading && <LoaderComponent/>
                }
                {
                    isDryNeedlingFileDetailsLoadingFailed &&
                    <StatusCardComponent title={'Failed to load dry needling file details.'}/>
                }
                {
                    isDryNeedlingFileDetailsLoaded && <>
                        <MedicalRecordAttachmentBasicDetailsCardComponent
                            pageTitle={"View Dry Needling File"}
                            attachmentDetails={dryNeedlingFileDetails}
                            medicalRecordDetails={dryNeedlingFileDetails?.medical_record_details}
                            attachmentType={"dryNeedlingFile"}
                            onDelete={handleDryNeedlingDocumentDelete}
                            onEdit={openEditDryNeedlingFileDrawer}
                            showEdit={true}
                            onDryNeedingShare={handleDryNeedlingShare}
                        />

                        <div className={'dry-needling-attachment'}>
                            {
                                dryNeedlingFileDetails?.attachment &&
                                <AttachmentComponent
                                    attachment={dryNeedlingFileDetails?.attachment}
                                    onDelete={handleDryNeedlingFileDelete}
                                    isDeleting={isDryNeedlingAttachmentDeleting}
                                    showDelete={true}
                                />
                            }
                            {
                                !dryNeedlingFileDetails?.attachment && <>
                                    <FormControlLabelComponent label={'Upload Dry Needling File*'}/>
                                    <div className={'t-form'}>
                                        <div className="t-form-controls">
                                            {
                                                dryNeedlingFileAttachmentFile &&
                                                <FilePreviewThumbnailComponent file={dryNeedlingFileAttachmentFile}
                                                                               onRemove={() => setDryNeedlingFileAttachmentFile(undefined)}
                                                />
                                            }
                                            {
                                                !dryNeedlingFileAttachmentFile &&
                                                <FilePickerComponent maxFileCount={1}
                                                                     onFilesDrop={(files: any) => {
                                                                         setDryNeedlingFileAttachmentFile(files[0]);
                                                                     }}
                                                                     acceptedFileTypes={["pdf", "png", "jpeg"]}
                                                                     acceptedFilesText={"PNG,JPEG and PDF files are allowed upto 100MB"}
                                                />
                                            }
                                        </div>
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                variant={"outlined"}
                                                className={isDryNeedlingAttachmentAdding ? 'mrg-right-15' : ''}
                                                onClick={() => setDryNeedlingFileAttachmentFile(undefined)}
                                                disabled={isDryNeedlingAttachmentAdding}
                                            >
                                                Cancel
                                            </ButtonComponent>&nbsp;&nbsp;
                                            <ButtonComponent
                                                className={'mrg-left-15'}
                                                onClick={handleDryNeedlingFileAttachmentAdd}
                                                disabled={!dryNeedlingFileAttachmentFile || isDryNeedlingAttachmentAdding}
                                                isLoading={isDryNeedlingAttachmentAdding}
                                            >
                                                Save
                                            </ButtonComponent>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </>
                }
                {
                    dryNeedlingFileId &&
                    <DrawerComponent isOpen={isEditDryNeedlingFileDrawerOpened}
                                     showClose={true}
                                     onClose={closeEditDryNeedlingFileDrawer}>
                        <EditDryNeedlingFileComponent onEdit={handleEditDryNeedlingFile}
                                                      dryNeedlingFileId={dryNeedlingFileId}
                                                      dryNeedlingFileDetails={dryNeedlingFileDetails}/>
                    </DrawerComponent>
                }
            </div>
        );

    }
;

export default ViewDryNeedlingFileScreen;
