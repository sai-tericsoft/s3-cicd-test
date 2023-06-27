import "./MessageBoardComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../../shared/services";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import {ImageConfig, Misc} from "../../../constants";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {useCallback, useEffect, useState} from "react";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import {getAllMessageHistory} from "../../../store/actions/dashboard.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import EditMessageComponent from "../edit-message/EditMessageComponent";

interface MessageBoardComponentProps {

}

const MessageBoardComponent = (props: MessageBoardComponentProps) => {

    const dispatch = useDispatch();
    const {
        messageHistory,
        isMessageHistoryLoading,
        isMessageHistoryLoaded
    } = useSelector((state: IRootReducerState) => state.dashboard)
    const [isViewMessageDrawerOpen, setIsViewMessageDrawerOpen] = useState<boolean>(false)
    const [editableMessage, setEditableMessage] = useState<any | null>(null);
    const [mode, setMode] = useState<'view' | 'edit'>('view');

    const {systemSettings} = useSelector((state: IRootReducerState) => state.settings);

    const handleOpenViewAllMessagesDrawer = useCallback(() => {
        setIsViewMessageDrawerOpen(true)
    }, []);

    const handleCloseAllMessagesDrawer = useCallback(() => {
        setIsViewMessageDrawerOpen(false);
        setMode("view")
    }, []);

    useEffect(() => {
        dispatch(getAllMessageHistory());
    }, [dispatch]);

    const handleBackStep = useCallback(() => {
        setMode('view')
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
                    handleCloseAllMessagesDrawer();
                    dispatch(getAllMessageHistory());
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error, "error");
            });
        });
    }, [dispatch, handleCloseAllMessagesDrawer])


    return (
        <div className={'message-board-component'}>
            {isMessageHistoryLoading && <div><LoaderComponent/></div>}

            <>
                <div className={'ts-row'}>
                    <div className={'ts-col-8'}>
                        <div className={' message-board-wrapper'}>
                            <CardComponent className={'message-board'}>
                                <div className={'message-board-view-all-messages-wrapper'}>
                                    <div className={'message-board-text'}>Message Board</div>

                                    {(messageHistory && messageHistory?.length > 0) && <div className={'view-all-message'} onClick={handleOpenViewAllMessagesDrawer}>
                                         <div>View All Messages</div>
                                    </div>
                                    }
                                </div>
                                {isMessageHistoryLoaded &&
                                    <CardComponent color={'primary'} className={'view-message-board'}>
                                        {
                                            (messageHistory?.length === 0) && <>
                                                <div className={'message-text'}>{systemSettings?.default_message}</div>
                                            </>
                                        }
                                        {messageHistory?.map((message: any,index:number) => {
                                            return (<>
                                                    <div className={'message-text'}>{message?.message}</div>
                                                    <div
                                                        className={'time-stamp'}>{CommonService.transformTimeStamp(message?.created_at)}</div>
                                                    {(index!==messageHistory.length - 1) ?
                                                        <HorizontalLineComponent/> : <div className={'mrg-bottom-10'}/>
                                                    }
                                                </>
                                            )
                                        })}
                                    </CardComponent>
                                }
                            </CardComponent>
                        </div>
                    </div>
                    <div className={'ts-col-4'}>
                        <CardComponent className={'birthday-board'}>
                            <div className={'today-birthday-text'}>
                                Today's Birthday(s)
                            </div>
                            <div className={'coming-soon-image-text-wrapper'}>
                                <div>
                                    <div className={'mrg-left-50'}>
                                        <ImageConfig.ComingSoon/>
                                    </div>
                                    <div>
                                        Coming Soon!
                                    </div>
                                </div>
                            </div>
                        </CardComponent>
                    </div>
                </div>
                <DrawerComponent isOpen={isViewMessageDrawerOpen}
                                 onClose={handleCloseAllMessagesDrawer}
                                 showClose={true}
                                 className={'t-view-all-message'}>
                    {mode === 'view' &&
                        <div>
                            <FormControlLabelComponent label={'View All Messages'} size={'lg'}/>
                            {messageHistory?.map((message: any) => {
                                return (<div className={'message-timestamp-wrapper'}>
                                        <div className={'message-edit-delete-button-wrapper'}>
                                            <div>
                                                <CardComponent color={'primary'}>
                                                    <div>{message?.message}</div>
                                                </CardComponent>
                                            </div>
                                            <span className={'mrg-left-10'}><IconButtonComponent onClick={() => {
                                                setEditableMessage(message)
                                                setMode('edit');

                                            }}><ImageConfig.EditIcon/></IconButtonComponent></span>
                                            <span><IconButtonComponent
                                                onClick={() => handleMessageDelete(message?._id)}
                                                color={'error'}><ImageConfig.DeleteIcon/></IconButtonComponent></span>
                                        </div>
                                        <div
                                            className={'created-at-time-stamp'}>{CommonService.transformTimeStamp(message?.created_at)}</div>
                                    </div>
                                )
                            })}

                        </div>
                    }
                    {
                        mode === 'edit' &&
                        <EditMessageComponent messageObject={editableMessage} onBack={() => handleBackStep()}
                                              closeMessageDrawer={() => handleCloseAllMessagesDrawer()}/>
                    }
                </DrawerComponent>

            </>
        </div>
    );

};

export default MessageBoardComponent;