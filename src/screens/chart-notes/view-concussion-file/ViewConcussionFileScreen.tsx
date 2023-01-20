import "./ViewConcussionFileScreen.scss";
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
import {ImageConfig, Misc} from "../../../constants";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import EditConcussionFileComponent from "../edit-concussion-file/EditConcussionFileComponent";

interface ViewConcussionFileScreenProps {

}

const ViewConcussionFileScreen = (props: ViewConcussionFileScreenProps) => {

        const {medicalRecordId, concussionFileId} = useParams();
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [concussionFileDetails, setConcussionFileFileDetails] = useState<any>(undefined);
        const [isConcussionFileFileDetailsLoaded, setIsConcussionFileFileDetailsLoaded] = useState<boolean>(false);
        const [isConcussionFileFileDetailsLoading, setIsConcussionFileFileDetailsLoading] = useState<boolean>(false);
        const [isConcussionFileFileDetailsLoadingFailed, setIsConcussionFileFileDetailsLoadingFailed] = useState<boolean>(false);
        const [isEditConcussionFileFileDrawerOpened, setIsEditConcussionFileFileDrawerOpened] = useState<boolean>(false);
        const [isConcussionFileAttachmentDeleting, setIsConcussionFileAttachmentDeleting] = useState<boolean>(false);
        const [isConcussionFileAttachmentAdding, setIsConcussionFileAttachmentAdding] = useState<boolean>(false);
        const [concussionFileAttachmentFile, setConcussionFileFileAttachmentFile] = useState<any>(undefined);

        const openEditConcussionFileFileDrawer = useCallback(() => {
            setIsEditConcussionFileFileDrawerOpened(true);
        }, []);

        const closeEditConcussionFileFileDrawer = useCallback(() => {
            setIsEditConcussionFileFileDrawerOpened(false);
        }, []);

        const getConcussionFileFileDetails = useCallback(() => {
            if (concussionFileId) {
                setIsConcussionFileFileDetailsLoading(true);
                setIsConcussionFileFileDetailsLoadingFailed(false);
                setIsConcussionFileFileDetailsLoaded(false);
                CommonService._chartNotes.ConcussionFileDetailsAPICall(concussionFileId, {})
                    .then((response: any) => {
                        setConcussionFileFileDetails(response.data);
                        setIsConcussionFileFileDetailsLoading(false);
                        setIsConcussionFileFileDetailsLoadingFailed(false);
                        setIsConcussionFileFileDetailsLoaded(true);
                    }).catch((error: any) => {
                    setIsConcussionFileFileDetailsLoading(false);
                    setIsConcussionFileFileDetailsLoadingFailed(true);
                    setIsConcussionFileFileDetailsLoaded(false);
                });
            }
        }, [concussionFileId]);

        const handleEditConcussionFileFile = useCallback(() => {
            getConcussionFileFileDetails();
            setIsEditConcussionFileFileDrawerOpened(false);
        }, [getConcussionFileFileDetails]);

        useEffect(() => {
            dispatch(setCurrentNavParams("View Concussion File", null, () => {
                medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }, [medicalRecordId, navigate, dispatch]);

        const handleConcussionFileFileDelete = useCallback(() => {
            CommonService.onConfirm({
                image: ImageConfig.DeleteAttachmentConfirmationIcon,
                confirmationTitle: "DELETE ATTACHMENT",
                confirmationSubTitle: "Are you sure you want to delete this attachment\n" +
                    "from this file?"
            }).then(() => {
                setIsConcussionFileAttachmentDeleting(true);
                if (concussionFileId) {
                    CommonService._chartNotes.ConcussionFileDeleteAttachmentAPICall(concussionFileId, {})
                        .then((response: any) => {
                            setConcussionFileFileDetails((prevState: any) => {
                                return {
                                    ...prevState,
                                    attachment: null
                                }
                            });
                            setIsConcussionFileAttachmentDeleting(false);
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully deleted attachment", "success");
                        }).catch((error: any) => {
                        setIsConcussionFileAttachmentDeleting(false);
                        CommonService._alert.showToast(error?.error || "Error deleting an attachment", "success");
                    });
                } else {
                    CommonService._alert.showToast('Concussion File Id is missing', "error");
                }
            });
        }, [concussionFileId]);

        const handleConcussionFileFileAttachmentAdd = useCallback(() => {
            if (concussionFileId) {
                const payload = {
                    attachment: concussionFileAttachmentFile
                };
                const formData = CommonService.getFormDataFromJSON(payload);
                setIsConcussionFileAttachmentAdding(true);
                CommonService._chartNotes.ConcussionFileAddAttachmentAPICall(concussionFileId, formData)
                    .then((response: any) => {
                        setConcussionFileFileDetails((prevState: any) => {
                            return {
                                ...prevState,
                                attachment: response.data
                            }
                        });
                        setIsConcussionFileAttachmentAdding(false);
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully added attachment", "success");
                    }).catch((error: any) => {
                    setIsConcussionFileAttachmentAdding(false);
                    CommonService._alert.showToast(error?.error || "Error adding an attachment", "success");
                });
            } else {
                CommonService._alert.showToast('Concussion File Id is missing', "error");
            }
        }, [concussionFileAttachmentFile, concussionFileId]);

        useEffect(() => {
            if (concussionFileId) {
                getConcussionFileFileDetails();
            }
        }, [getConcussionFileFileDetails, concussionFileId]);

        return (
            <div className={'view-concussion-file-screen'}>
                {
                    isConcussionFileFileDetailsLoading && <LoaderComponent/>
                }
                {
                    isConcussionFileFileDetailsLoadingFailed &&
                    <StatusCardComponent title={'Failed to load concussion file details.'}/>
                }
                {
                    isConcussionFileFileDetailsLoaded && <>
                        <MedicalRecordAttachmentBasicDetailsCardComponent
                            pageTitle={`View ${concussionFileDetails?.concussion_type_details?.type} File`}
                            attachmentDetails={concussionFileDetails}
                            medicalRecordDetails={concussionFileDetails?.medical_record_details}
                            attachmentType={"concussionFile"}
                            onEdit={openEditConcussionFileFileDrawer}
                        />
                        <div className={'concussion-attachment'}>
                            {
                                concussionFileDetails?.attachment &&
                                <AttachmentComponent
                                    attachment={concussionFileDetails?.attachment}
                                    onDelete={handleConcussionFileFileDelete}
                                    isDeleting={isConcussionFileAttachmentDeleting}
                                />
                            }
                            {
                                !concussionFileDetails?.attachment &&
                                <div className={'t-form'}>
                                    <div className="t-form-controls">
                                        {
                                            concussionFileAttachmentFile &&
                                            <FilePreviewThumbnailComponent file={concussionFileAttachmentFile}
                                                                           onRemove={() => setConcussionFileFileAttachmentFile(undefined)}
                                            />
                                        }
                                        {
                                            !concussionFileAttachmentFile &&
                                            <FilePickerComponent maxFileCount={1}
                                                                 onFilesDrop={(files: any) => {
                                                                     setConcussionFileFileAttachmentFile(files[0]);
                                                                 }}
                                                                 acceptedFileTypes={["pdf", "png", "jpg", "jpeg"]}
                                                                 acceptedFilesText={"PNG, JPG, JPEG and PDF files are allowed upto 100MB"}
                                            />
                                        }
                                    </div>
                                    <div className="t-form-actions">
                                        <ButtonComponent
                                            variant={"outlined"}
                                            onClick={() => setConcussionFileFileAttachmentFile(undefined)}
                                            disabled={isConcussionFileAttachmentAdding}
                                        >
                                            Cancel
                                        </ButtonComponent>&nbsp;&nbsp;
                                        <ButtonComponent
                                            onClick={handleConcussionFileFileAttachmentAdd}
                                            disabled={!concussionFileAttachmentFile || isConcussionFileAttachmentAdding}
                                            isLoading={isConcussionFileAttachmentAdding}
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
                    concussionFileId &&
                    <DrawerComponent isOpen={isEditConcussionFileFileDrawerOpened}
                                     showClose={true}
                                     onClose={closeEditConcussionFileFileDrawer}>
                        <EditConcussionFileComponent onEdit={handleEditConcussionFileFile}
                                                     concussionFileId={concussionFileId}
                                                     concussionFileDetails={concussionFileDetails}/>
                    </DrawerComponent>
                }
            </div>
        );

    }
;

export default ViewConcussionFileScreen;