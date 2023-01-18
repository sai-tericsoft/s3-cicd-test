import "./ViewDryNeedlingFileScreen.scss";
import {useNavigate, useParams} from "react-router-dom";
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

        const openEditDryNeedlingFileDrawer = useCallback(() => {
            setIsEditDryNeedlingFileDrawerOpened(true);
        }, []);

        const closeEditDryNeedlingFileDrawer = useCallback(() => {
            setIsEditDryNeedlingFileDrawerOpened(false);
        }, []);

        const handleEditDryNeedlingFile = useCallback(() => {
            getDryNeedlingFileDetails();
            setIsEditDryNeedlingFileDrawerOpened(false);
        }, []);

        useEffect(() => {
            dispatch(setCurrentNavParams("View Dry Needling File", null, () => {
                medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }, [medicalRecordId, navigate, dispatch]);

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
        }, []);

        const handleDryNeedlingFileDelete = useCallback(() => {
            CommonService.onConfirm({
                image: ImageConfig.DeleteAttachmentConfirmationIcon,
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
        }, [dryNeedlingFileDetails]);

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
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully added attachment", "success");
                    }).catch((error: any) => {
                    setIsDryNeedlingAttachmentAdding(false);
                    CommonService._alert.showToast(error?.error || "Error adding an attachment", "success");
                });
            } else {
                CommonService._alert.showToast('Dry Needling File Id is missing', "error");
            }
        }, [dryNeedlingFileAttachmentFile, dryNeedlingFileId]);

        useEffect(() => {
            if (dryNeedlingFileId) {
                getDryNeedlingFileDetails();
            }
        }, [dryNeedlingFileId]);

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
                            onEdit={openEditDryNeedlingFileDrawer}
                        />
                        <div className={'dry-needling-attachment'}>
                            {
                                dryNeedlingFileDetails?.attachment &&
                                <AttachmentComponent
                                    attachment={dryNeedlingFileDetails?.attachment}
                                    onDelete={handleDryNeedlingFileDelete}
                                    isDeleting={isDryNeedlingAttachmentDeleting}
                                />
                            }
                            {
                                !dryNeedlingFileDetails?.attachment &&
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
                                                                 acceptedFileTypes={["pdf", "png", "jpg", "jpeg"]}
                                                                 acceptedFilesText={"PNG, JPG, JPEG and PDF files are allowed upto 100MB"}
                                            />
                                        }
                                    </div>
                                    <div className="t-form-actions">
                                        <ButtonComponent
                                            variant={"outlined"}
                                            onClick={() => setDryNeedlingFileAttachmentFile(undefined)}
                                            disabled={isDryNeedlingAttachmentAdding}
                                        >
                                            Cancel
                                        </ButtonComponent>&nbsp;&nbsp;
                                        <ButtonComponent
                                            onClick={handleDryNeedlingFileAttachmentAdd}
                                            disabled={!dryNeedlingFileAttachmentFile || isDryNeedlingAttachmentAdding}
                                            isLoading={isDryNeedlingAttachmentAdding}
                                        >
                                            Save
                                        </ButtonComponent>
                                    </div>
                                </div>
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
