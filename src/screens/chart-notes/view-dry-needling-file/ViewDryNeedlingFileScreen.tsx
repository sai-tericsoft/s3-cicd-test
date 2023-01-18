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
                            <AttachmentComponent attachment={dryNeedlingFileDetails?.attachment}/>
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
