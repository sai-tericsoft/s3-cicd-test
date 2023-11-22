
import "./ExerciseLogAttachmentListComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect} from "react";
import {getInterventionAttachmentList} from "../../../store/actions/chart-notes.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import {ImageConfig, Misc} from "../../../constants";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

interface ExerciseLogAttachmentListComponentProps {

}

const ExerciseLogAttachmentListComponent = (props: ExerciseLogAttachmentListComponentProps) => {

    const {medicalInterventionId} = useParams();
    const [isAttachmentBeingUploaded, setIsAttachmentBeingUploaded] = React.useState<boolean>(false);
    const [isAttachmentBeingDeleted, setIsAttachmentBeingDeleted] = React.useState<boolean>(false);
    const dispatch = useDispatch();
    const {
        attachmentList,
        isAttachmentListLoading,
        isAttachmentListLoaded,
        isAttachmentListLoadingFailed
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (medicalInterventionId) {
            dispatch(getInterventionAttachmentList(medicalInterventionId));
        }
    }, [medicalInterventionId, dispatch]);

    const hiddenFileInput = React.useRef<any>(null);

    const handleClick = useCallback(() => {
        hiddenFileInput.current.click();
    }, []);

    const handleFileSubmit = useCallback((event: any) => {
        if (medicalInterventionId) {
            setIsAttachmentBeingUploaded(true);
            const formData = CommonService.getFormDataFromJSON({attachment: event.target.files[0]});
            event.target.value = null;
            CommonService._chartNotes.AddExerciseLogAttachment(medicalInterventionId, formData)
                .then((response: any) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getInterventionAttachmentList(medicalInterventionId));
                    setIsAttachmentBeingUploaded(false);
                })
                .catch((error: any) => {
                    setIsAttachmentBeingUploaded(false);
                    CommonService._alert.showToast(error[Misc.API_RESPONSE_MESSAGE_KEY], "error");
                })
        }
    }, [dispatch, medicalInterventionId])

    const removeAttachment = useCallback((item: any, medicalInterventionId: string) => {
        CommonService.onConfirm({
            confirmationTitle: 'Do you want to remove this attachment',
            confirmationSubTitle: `Do you want to remove "${item.name}" this attachment"?`
        }).then(() => {
            setIsAttachmentBeingDeleted(true);
            CommonService._chartNotes.RemoveExerciseLogAttachmentAPICall(medicalInterventionId, item._id, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getInterventionAttachmentList(medicalInterventionId));
                    setIsAttachmentBeingDeleted(false);
                }).catch((error: any) => {
                setIsAttachmentBeingDeleted(false);
                CommonService._alert.showToast(error.error || "Error deleting attachment", "error");
            })
        })
    }, [dispatch]);

    return (
        <div className={'exercise-log-attachment-list-component'}>
            <div className={'exercise-log-attachment-add-component'}>
                <input type={"file"} ref={hiddenFileInput} accept={"application/pdf"} onChange={handleFileSubmit}
                       style={{display: 'none'}}/>
            </div>
            <>
                {
                    !medicalInterventionId &&
                    <StatusCardComponent title={"Intervention ID missing. Cannot fetch details"}/>
                }
            </>
            {
                medicalInterventionId && <>
                    {
                        isAttachmentListLoading && <div>
                            <LoaderComponent/>
                        </div>
                    }
                    {
                        isAttachmentListLoadingFailed &&
                        <StatusCardComponent title={"Failed to fetch attachment list"}/>
                    }
                    {
                        isAttachmentListLoaded && <>
                            <CardComponent title={'Attachments'}
                                           actions={<ButtonComponent
                                               disabled={isAttachmentListLoading || isAttachmentBeingUploaded}
                                               isLoading={isAttachmentBeingUploaded}
                                               onClick={handleClick}
                                               prefixIcon={<ImageConfig.AddIcon/>}>
                                               Attach Exercise Log</ButtonComponent>}>
                                <>
                                    {(attachmentList.attachments.length > 0) &&
                                        <>
                                            {attachmentList?.attachments?.map((attachment: any) => {
                                                return <span className={'chip-wrapper'}>
                                        <ChipComponent className={'chip chip-items'}
                                                       disabled={isAttachmentBeingDeleted}
                                                       color={'success'}
                                                       label={attachment.name}
                                                       prefixIcon={<ImageConfig.PDF_ICON/>}
                                                       onDelete={() => removeAttachment(attachment, medicalInterventionId)}/>
                                                </span>
                                            })}
                                        </>
                                    }
                                    {(attachmentList?.attachments?.length === 0) &&
                                        <StatusCardComponent title={'No Attachments'}/>
                                    }
                                </>
                            </CardComponent>
                        </>
                    }
                </>
            }
        </div>
    );

};

export default ExerciseLogAttachmentListComponent;
