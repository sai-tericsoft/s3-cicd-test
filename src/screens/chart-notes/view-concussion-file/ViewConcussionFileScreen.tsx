import "./ViewConcussionFileScreen.scss";
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
import {ImageConfig, Misc} from "../../../constants";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import EditConcussionFileComponent from "../edit-concussion-file/EditConcussionFileComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import commonService from "../../../shared/services/common.service";

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
        const [searchParams] = useSearchParams();
        const [isShared, setIsShared] = useState<boolean>(false);

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
                        setIsShared(response.data.is_shared);
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
            if (medicalRecordId) {
                const referrer: any = searchParams.get("referrer");
                const module_name: any = searchParams.get("module_name");
                const active_tab: any = searchParams.get("activeTab");

                dispatch(setCurrentNavParams("View Concussion File", null, () => {
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

        const handleConcussionFileFileDelete = useCallback(() => {
            CommonService.onConfirm({
                image: ImageConfig.Confirm,
                // showLottie: true,
                confirmationTitle: "DELETE ATTACHMENT",
                confirmationSubTitle: "Are you sure you want to delete this attachment?"
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

        const handleConcussionDocumentDelete = useCallback(() => {
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
                if (concussionFileId) {
                    CommonService._chartNotes.ConcussionFileDocumentDelete(concussionFileId, {})
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
        }, [concussionFileId, medicalRecordId, navigate, searchParams]);

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
                        setConcussionFileFileAttachmentFile(undefined);
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

        const handleConcussionFileShare = useCallback(() => {
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
                if (concussionFileId) {
                    CommonService._chartNotes.ConcussionFileEditAPICall(concussionFileId, {is_shared: true})
                        .then((response: any) => {
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully shared document", "success");
                            setIsShared(true);
                        }).catch((error: any) => {
                        CommonService._alert.showToast(error?.error || "Error sharing document", "success");
                    });
                }
            })
        }, [concussionFileId]);

        useEffect(() => {
            if (concussionFileId) {
                getConcussionFileFileDetails();
            }
        }, [getConcussionFileFileDetails, concussionFileId]);

        const removeAccess = useCallback((item: any) => {
            const payload = {
                is_shared: false
            }
            CommonService._chartNotes.ConcussionFileEditAPICall(item?._id, payload)
                .then((response: any) => {
                    commonService._alert.showToast("Access removed successfully", "success");
                    setIsShared(false);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || "Error removing access", "error");
                });

        }, [])

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
                            isDocumentShared={isShared}
                            medicalRecordDetails={concussionFileDetails?.medical_record_details}
                            attachmentType={"concussionFile"}
                            onEdit={openEditConcussionFileFileDrawer}
                            showEdit={true}
                            onConcussionFileShare={handleConcussionFileShare}
                            onRemoveAccess={removeAccess}
                            onDelete={handleConcussionDocumentDelete}
                            medicalRecordDocumentId={concussionFileId}
                            noteTypeCategory={concussionFileDetails?.note_type_category}
                        />
                        <div className={'concussion-attachment'}>
                            {
                                concussionFileDetails?.attachment &&
                                <AttachmentComponent
                                    attachment={concussionFileDetails?.attachment}
                                    onDelete={handleConcussionFileFileDelete}
                                    isDeleting={isConcussionFileAttachmentDeleting}
                                    showDelete={true}
                                />
                            }
                            {
                                !concussionFileDetails?.attachment &&
                                <div className={'t-form'}>
                                    <div className="t-form-controls">
                                        {
                                            !concussionFileAttachmentFile &&
                                            <FormControlLabelComponent label={'Upload Document*'}/>
                                        }
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
                                                                 acceptedFileTypes={["pdf", "png", "jpeg"]}
                                                                 acceptedFilesText={"PNG,  JPEG and PDF files are allowed upto 100MB"}
                                            />
                                        }
                                    </div>
                                    <div className="t-form-actions">
                                        <ButtonComponent
                                            variant={"outlined"}
                                            className={isConcussionFileAttachmentAdding ? 'mrg-right-15' : ''}
                                            onClick={() => setConcussionFileFileAttachmentFile(undefined)}
                                            disabled={isConcussionFileAttachmentAdding}
                                        >
                                            Cancel
                                        </ButtonComponent>&nbsp;&nbsp;
                                        <ButtonComponent
                                            className={'mrg-left-15'}
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
