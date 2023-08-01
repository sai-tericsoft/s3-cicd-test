import "./ViewMedicalRecordDocumentScreen.scss";
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
import EditMedicalRecordDocumentComponent from "../edit-medical-record-document/EditMedicalRecordDocumentComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";

interface ViewMedicalRecordDocumentScreenProps {

}

const ViewMedicalRecordDocumentScreen = (props: ViewMedicalRecordDocumentScreenProps) => {

        const {medicalRecordId, medicalRecordDocumentId} = useParams();
        const [searchParams] = useSearchParams();
        const [module, setModule] = useState<any>('');
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [medicalRecordDocumentDetails, setMedicalRecordDocumentDetails] = useState<any>(undefined);
        const [isMedicalRecordDocumentDetailsLoaded, setIsMedicalRecordDocumentDetailsLoaded] = useState<boolean>(false);
        const [isMedicalRecordDocumentDetailsLoading, setIsMedicalRecordDocumentDetailsLoading] = useState<boolean>(false);
        const [isMedicalRecordDocumentDetailsLoadingFailed, setIsMedicalRecordDocumentDetailsLoadingFailed] = useState<boolean>(false);
        const [isEditMedicalRecordDocumentDrawerOpened, setIsEditMedicalRecordDocumentDrawerOpened] = useState<boolean>(false);
        const [isMedicalRecordAttachmentDeleting, setIsMedicalRecordAttachmentDeleting] = useState<boolean>(false);
        const [isMedicalRecordAttachmentAdding, setIsMedicalRecordAttachmentAdding] = useState<boolean>(false);
        const [medicalRecordDocumentAttachmentFile, setMedicalRecordDocumentAttachmentFile] = useState<any>(undefined);

        useEffect(() => {
            if (medicalRecordId) {
                const referrer: any = searchParams.get("referrer");
                const module_name: any = searchParams.get("module_name");
                const active_tab: any = searchParams.get("activeTab");
                setModule(module_name);
                dispatch(setCurrentNavParams("View Document", null, () => {
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

        const openEditMedicalRecordDocumentDrawer = useCallback(() => {
            setIsEditMedicalRecordDocumentDrawerOpened(true);
        }, []);

        const closeEditMedicalRecordDocumentDrawer = useCallback(() => {
            setIsEditMedicalRecordDocumentDrawerOpened(false);
        }, []);

        const getMedicalRecordDocumentDetails = useCallback(() => {
            if (medicalRecordDocumentId) {
                setIsMedicalRecordDocumentDetailsLoading(true);
                setIsMedicalRecordDocumentDetailsLoadingFailed(false);
                setIsMedicalRecordDocumentDetailsLoaded(false);
                CommonService._chartNotes.MedicalRecordDocumentDetailsAPICall(medicalRecordDocumentId, {})
                    .then((response: any) => {
                        setMedicalRecordDocumentDetails(response?.data);
                        setIsMedicalRecordDocumentDetailsLoading(false);
                        setIsMedicalRecordDocumentDetailsLoadingFailed(false);
                        setIsMedicalRecordDocumentDetailsLoaded(true);
                    }).catch((error: any) => {
                    setIsMedicalRecordDocumentDetailsLoading(false);
                    setIsMedicalRecordDocumentDetailsLoadingFailed(true);
                    setIsMedicalRecordDocumentDetailsLoaded(false);
                });
            }
        }, [medicalRecordDocumentId]);

        const handleEditMedicalRecordDocument = useCallback(() => {
            getMedicalRecordDocumentDetails();
            setIsEditMedicalRecordDocumentDrawerOpened(false);
        }, [getMedicalRecordDocumentDetails]);

        const handleMedicalRecordDocumentDelete = useCallback(() => {
            CommonService.onConfirm({
                image: ImageConfig.ConfirmationLottie,
                showLottie: true,
                confirmationTitle: "DELETE ATTACHMENT",
                confirmationDescription: <div className="delete-document">
                    <div className={'delete-document-text text-center '}>Are you sure you want to delete this
                        attachment <br/> from this file?
                    </div>
                </div>
            }).then(() => {
                setIsMedicalRecordAttachmentDeleting(true);
                if (medicalRecordDocumentId) {
                    CommonService._chartNotes.MedicalRecordDocumentDeleteAttachmentAPICall(medicalRecordDocumentId, {})
                        .then((response: any) => {
                            setMedicalRecordDocumentDetails((prevState: any) => {
                                return {
                                    ...prevState,
                                    attachment: null
                                }
                            });
                            setIsMedicalRecordAttachmentDeleting(false);
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully deleted attachment", "success");
                            const referrer: any = searchParams.get("referrer");
                            const module_name: any = searchParams.get("module_name");
                            if (referrer && referrer !== "undefined" && referrer !== "null") {
                                if (module_name === "client_module") {
                                    navigate(referrer);
                                } else {

                                }
                            }
                        }).catch((error: any) => {
                        setIsMedicalRecordAttachmentDeleting(false);
                        CommonService._alert.showToast(error?.error || "Error deleting an attachment", "success");
                    });
                } else {
                    CommonService._alert.showToast('Medical Record Document Id is missing', "error");
                }
            });
        }, [medicalRecordDocumentId, navigate, searchParams]);

        const handleMedicalRecordDocumentAttachmentAdd = useCallback(() => {
            if (medicalRecordDocumentId) {
                const payload = {
                    attachment: medicalRecordDocumentAttachmentFile
                };
                const formData = CommonService.getFormDataFromJSON(payload);
                setIsMedicalRecordAttachmentAdding(true);
                CommonService._chartNotes.MedicalRecordDocumentAddAttachmentAPICall(medicalRecordDocumentId, formData)
                    .then((response: any) => {
                        setMedicalRecordDocumentDetails((prevState: any) => {
                            return {
                                ...prevState,
                                attachment: response.data
                            }
                        });
                        setMedicalRecordDocumentAttachmentFile(undefined);
                        setIsMedicalRecordAttachmentAdding(false);
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully added attachment", "success");

                    }).catch((error: any) => {
                    setIsMedicalRecordAttachmentAdding(false);
                    CommonService._alert.showToast(error?.error || "Error adding an attachment", "success");
                });
            } else {
                CommonService._alert.showToast('Medical Record Document Id is missing', "error");
            }
        }, [medicalRecordDocumentAttachmentFile, medicalRecordDocumentId]);

        useEffect(() => {
            if (medicalRecordDocumentId) {
                getMedicalRecordDocumentDetails();
            }
        }, [getMedicalRecordDocumentDetails, medicalRecordDocumentId]);

        const handleDocumentDelete = useCallback(() => {
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
                if (medicalRecordDocumentId) {
                    CommonService._chartNotes.DeleteDocument(medicalRecordDocumentId)
                        .then((response: any) => {
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Document deleted successfully", "success");
                            const referrer: any = searchParams.get("referrer");
                            const module_name: any = searchParams.get("module_name");
                            setModule(module_name);
                            if (module_name === "client_module") {
                                navigate(referrer);
                            } else {
                                medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=attachmentList');
                            }

                        }).catch((error: any) => {
                        CommonService._alert.showToast(error?.error || "Error deleting document", "success");
                    })
                }
            })

        }, [medicalRecordDocumentId, navigate, searchParams, medicalRecordId])


        return (
            <div className={'view-medical-record-details-screen'}>
                {
                    isMedicalRecordDocumentDetailsLoading && <LoaderComponent/>
                }
                {
                    isMedicalRecordDocumentDetailsLoadingFailed &&
                    <StatusCardComponent title={'Failed to load medical record details.'}/>
                }
                {
                    isMedicalRecordDocumentDetailsLoaded && <>
                        <MedicalRecordAttachmentBasicDetailsCardComponent
                            pageTitle={"View Document"}
                            attachmentDetails={medicalRecordDocumentDetails}
                            medicalRecordDetails={medicalRecordDocumentDetails?.medical_record_details}
                            attachmentType={"medicalRecordDocument"}
                            showEdit={module === 'client_documents' ? false : true}
                            onEdit={openEditMedicalRecordDocumentDrawer}
                            onDelete={handleDocumentDelete}
                        />
                        <div className={'medical-record-document-attachment'}>
                            {
                                medicalRecordDocumentDetails?.attachment &&
                                <AttachmentComponent
                                    attachment={medicalRecordDocumentDetails?.attachment}
                                    showDelete={module === 'client_documents' ? false : true}
                                    onDelete={handleMedicalRecordDocumentDelete}
                                    isDeleting={isMedicalRecordAttachmentDeleting}
                                />
                            }
                            {
                                !medicalRecordDocumentDetails?.attachment && <>
                                    <FormControlLabelComponent label={"Upload Document*"}/>
                                    <div className={'t-form'}>
                                        <div className="t-form-controls">
                                            {
                                                medicalRecordDocumentAttachmentFile &&
                                                <FilePreviewThumbnailComponent file={medicalRecordDocumentAttachmentFile}
                                                                               onRemove={() => setMedicalRecordDocumentAttachmentFile(undefined)}
                                                />
                                            }
                                            {
                                                !medicalRecordDocumentAttachmentFile &&
                                                <FilePickerComponent maxFileCount={1}
                                                                     onFilesDrop={(files: any) => {
                                                                         setMedicalRecordDocumentAttachmentFile(files[0]);
                                                                     }}
                                                                     acceptedFileTypes={["mp4", "pdf", "png", "jpeg", "avi"]}
                                                                     acceptedFilesText={"PNG, JPEG, PDF, MP4 and AVI files are allowed upto 100MB"}
                                                />
                                            }
                                        </div>
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                variant={"outlined"}
                                                onClick={() => setMedicalRecordDocumentAttachmentFile(undefined)}
                                                disabled={isMedicalRecordAttachmentAdding}
                                            >
                                                Cancel
                                            </ButtonComponent>&nbsp;&nbsp;
                                            <ButtonComponent
                                                onClick={handleMedicalRecordDocumentAttachmentAdd}
                                                disabled={!medicalRecordDocumentAttachmentFile || isMedicalRecordAttachmentAdding}
                                                isLoading={isMedicalRecordAttachmentAdding}
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
                    medicalRecordDocumentId &&
                    <DrawerComponent isOpen={isEditMedicalRecordDocumentDrawerOpened}
                                     showClose={true}
                                     onClose={closeEditMedicalRecordDocumentDrawer}>
                        <EditMedicalRecordDocumentComponent onEdit={handleEditMedicalRecordDocument}
                                                            medicalRecordDocumentId={medicalRecordDocumentId}
                                                            medicalRecordDocumentDetails={medicalRecordDocumentDetails}/>
                    </DrawerComponent>
                }
            </div>
        );

    }
;

export default ViewMedicalRecordDocumentScreen;
