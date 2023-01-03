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

interface ExerciseLogAttachmentListComponentProps {

}

const ExerciseLogAttachmentListComponent = (props: ExerciseLogAttachmentListComponentProps) => {

    const {interventionId} = useParams();
    const dispatch = useDispatch();
    const {
        attachmentList,
        isAttachmentListLoading,
        isAttachmentListLoaded,
        isAttachmentListLoadingFailed
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (interventionId) {
            dispatch(getInterventionAttachmentList(interventionId))
        }
    }, [interventionId, dispatch]);

    const removeAttachment = useCallback((item: any, interventionId: string) => {
        CommonService.onConfirm({
            confirmationTitle: 'Do you want to remove this attachment',
            confirmationSubTitle: `Do you want to remove "${item.name}" this attachment"?`
        }).then(() => {
            CommonService._chartNotes.RemoveExerciseLogAttachmentAPICall(interventionId, item._id, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getInterventionAttachmentList(interventionId));
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error deleting attachment", "error");
            })
        })

    }, [])

    return (
        <div className={'exercise-log-attachment-list-component'}>
            <>
                {
                    !interventionId && <StatusCardComponent title={"Intervention ID missing. Cannot fetch details"}/>
                }
            </>
            {
                interventionId && <>
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
                        (isAttachmentListLoaded && attachmentList.attachments.length > 0) && <>
                            <CardComponent title={'Attachments'}>
                                {attachmentList?.attachments?.map((attachment: any) => {
                                    return <span className={'chip-wrapper'}>
                                        <ChipComponent className={'chip chip-items'}  label={attachment.name}
                                                       prefixIcon={<ImageConfig.PDF_Icon/>}
                                                       onDelete={() => removeAttachment(attachment, interventionId)}/>
                                    </span>

                                })}

                            </CardComponent>
                        </>
                    }
                    {
                        (isAttachmentListLoaded && !attachmentList.attachments.length) &&
                        <> <CardComponent title={'Attachments'}>
                            <StatusCardComponent title={'No Attachments'}/>
                        </CardComponent>
                        </>
                    }
                </>
            }


        </div>
    );

};

export default ExerciseLogAttachmentListComponent;