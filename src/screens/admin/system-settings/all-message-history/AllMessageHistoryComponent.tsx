import "./AllMessageHistoryComponent.scss";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import React, {useCallback, useEffect, useState} from "react";
import {getAllMessageHistory} from "../../../../store/actions/dashboard.action";
import {CommonService} from "../../../../shared/services";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import {ImageConfig, Misc} from "../../../../constants";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import Popover from '@mui/material/Popover';
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';

interface AllMessageHistoryComponentProps {

}

const AllMessageHistoryComponent = (props: AllMessageHistoryComponentProps) => {

    const dispatch = useDispatch();
    const [copiedIndex, setCopiedIndex] = useState<any>(null);
    const {
        messageHistory,
        isMessageHistoryLoading,
        isMessageHistoryLoaded,
        isMessageHistoryFailed,
    } = useSelector((state: IRootReducerState) => state.dashboard);


    useEffect(() => {
        dispatch(getAllMessageHistory());
    }, [dispatch]);

    const handleCopyMessage = useCallback((id: string, message: any) => {
        navigator.clipboard.writeText(message)
            .then(() => {
                setCopiedIndex(id);
                setTimeout(() => {
                    setCopiedIndex(null);
                }, 2000); // Reset the copied index after 2 seconds
            })
    }, []);

    const handleMessageDelete = useCallback((messageId: string) => {
        CommonService.onConfirm({
            image: ImageConfig.DeleteAttachmentConfirmationIcon,
            confirmationTitle: "DELETE MESSAGE",
            confirmationSubTitle: "Are you sure you want to delete this message from\n" +
                "message board? This action cannot be undone."
        }).then(() => {
            CommonService._dashboardService.deleteDashboardMessage(messageId, {})
                .then((response: any) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getAllMessageHistory());
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error, "error");
            });
        });
    }, [dispatch])
    return (
        <div className={'all-message-history-component'}>
            {
                isMessageHistoryLoading && <LoaderComponent/>
            }
            {
                isMessageHistoryFailed &&
                <StatusCardComponent title={"Failed to fetch service details"}/>
            }
            {
                isMessageHistoryLoaded && <>
                    <FormControlLabelComponent label={'Message History'} size={'lg'}/>
                    <div className={'message-history-board'}>
                        {
                            messageHistory?.map((message: any) => {
                                return (<>
                                    <div
                                        className={'time-stamp'}>{CommonService.transformTimeStamp2(message?.created_at)}</div>
                                    <div className={'history-message-wrapper'}>
                                <span className={'history-message'}>
                                    <span>{message?.message}</span>
                                </span>

                                        {
                                            message?.can_delete && <span><IconButtonComponent
                                                onClick={() => handleCopyMessage(message?._id, message?.message)}>
                                        <ImageConfig.CopyIcon/>
                                    </IconButtonComponent></span>}
                                        {copiedIndex === message?._id && <span>Copied!</span>}
                                        {
                                            !message?.can_delete &&
                                            <PopupState variant="popover" popupId="demo-popup-popover">
                                                {(popupState: any) => (
                                                    <div>
                                                        <div className="cursor-pointer pdd-bottom-10" {...bindTrigger(popupState)}>
                                                            <ImageConfig.HorizontalMore/>
                                                        </div>

                                                        <Popover
                                                            {...bindPopover(popupState)}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'center',
                                                            }}
                                                        >
                                                            <div className="pdd-10">
                                                                <div
                                                                    className={'h-v-center  cursor-pointer mrg-right-10'}
                                                                    onClick={() => handleCopyMessage(message?._id, message?.message)}>
                                                                    <span><ImageConfig.CopyIcon/></span>
                                                                    <span className={'mrg-left-15'}>Copy</span>

                                                                </div>

                                                                <div className={'h-v-center mrg-top-10 cursor-pointer'}
                                                                     onClick={() => handleMessageDelete(message?._id)}>
                                                                    <span><ImageConfig.DeleteIcon/></span>
                                                                    <span className={'mrg-left-10'}>Delete</span>

                                                                </div>
                                                            </div>
                                                        </Popover>
                                                    </div>
                                                )}
                                            </PopupState>
                                        }

                                    </div>
                                </>)
                            })
                        }
                        {
                            messageHistory?.length === 0 && <FormControlLabelComponent label={'No New Message'}
                                                                                       className={'d-flex ts-justify-content-center ts-align-items-center mrg-top-100'}/>
                        }
                    </div>
                </>}
        </div>
    );

};

export default AllMessageHistoryComponent;