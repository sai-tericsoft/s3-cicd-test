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
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import commonService from "../../../shared/services/common.service";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

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
    const [birthdayListData, setBirthdayListData] = useState<any>([])

    const {systemSettings} = useSelector((state: IRootReducerState) => state.settings);

    const handleOpenViewAllMessagesDrawer = useCallback(() => {
        setIsViewMessageDrawerOpen(true)
    }, []);

    const handleCloseAllMessagesDrawer = useCallback(() => {
        setIsViewMessageDrawerOpen(false);
        setMode("view")
    }, []);

    useEffect(() => {
        dispatch(getAllMessageHistory(false));
    }, [dispatch]);

    const handleBackStep = useCallback(() => {
        setMode('view')
    }, []);

    const handleMessageDelete = useCallback((messageId: string) => {
        CommonService.onConfirm({
            image: ImageConfig.ConfirmationLottie,
            showLottie: true,
            confirmationTitle: "Delete Message",
            confirmationSubTitle: "Are you sure you want to delete this message from the message board? This action cannot be undone.",
            no: {
                // color: "error",
                text: "Cancel",
                variant: "outlined"
            },
            yes:{
                color: "primary",
                text: "Delete",
                variant: "contained"
            }
        }).then(() => {
            CommonService._dashboardService.editDashboardMessage(messageId, {is_deleted: true})
                .then((response: any) => {
                    CommonService._alert.showToast('Message deleted successfully!', "success");
                    // handleCloseAllMessagesDrawer();
                    dispatch(getAllMessageHistory(false));
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error, "error");
            });
        });
    }, [dispatch]);

    const getBirthdayList = useCallback(() => {
        CommonService._dashboardService.todayBirthdayList()
            .then((response: any) => {
                setBirthdayListData(response.data)
            }).catch((error: any) => {
            // CommonService._alert.showToast(error.error, "error");
        })
    }, []);

    useEffect(() => {
        getBirthdayList()
    }, [getBirthdayList]);

    const handleSendWishes = useCallback((id: string) => {
        CommonService._dashboardService.sendBirthdayWishes(id)
            .then((response: any) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                getBirthdayList();
            }).catch((error: any) => {
            CommonService._alert.showToast(error.error, "error");
        })
    }, [getBirthdayList]);


    return (
        <div className={'message-board-component'}>
            {isMessageHistoryLoading && <div><LoaderComponent/></div>}

            <>
                <div className={'ts-row'}>
                    <div className={'ts-col-7'}>
                        <div className={' message-board-wrapper'}>
                            <CardComponent className={'message-board'}>
                                <div className={'message-board-view-all-messages-wrapper'}>
                                    <div className={'message-board-text'}>Message Board</div>

                                    {(messageHistory && messageHistory?.length > 0) &&
                                        <div className={'view-all-message'} onClick={handleOpenViewAllMessagesDrawer}>
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
                                        {messageHistory?.map((message: any, index: number) => {
                                            return (<>
                                                    <div className={'message-text'}>{message?.message}</div>
                                                    <div
                                                        className={'time-stamp'}>{CommonService.transformTimeStamp2(message?.updated_at)}</div>
                                                    {(index !== messageHistory.length - 1) ?
                                                        <HorizontalLineComponent className={'horizontal-divider'}/> :
                                                        <div className={'mrg-bottom-10'}/>
                                                    }
                                                </>
                                            )
                                        })}
                                    </CardComponent>
                                }
                            </CardComponent>
                        </div>
                    </div>
                    <div className={'ts-col-5'}>
                        <CardComponent className={'birthday-board'}>
                            <div className={'today-birthday-text'}>
                                <div className={'birthday-heading'}> Today's Birthday(s)</div>
                            </div>
                            {
                                birthdayListData.length === 0 && <div className={'coming-soon-image-text-wrapper'}>
                                    <div className={'text-align-center'}>
                                        <div className={'mrg-left-10 text-align-center'}>
                                            Sorry, no birthday(s) to
                                        </div>
                                        <div className={'mrg-left-30'}>celebrate today.
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                birthdayListData.length > 0 && birthdayListData?.map((birthday: any) => {
                                    return <div className={'ts-row'}>
                                        <div className={' ts-col-9 birthday-detail-wrapper'}>
                                            <div className={'avatar-container'}>
                                                <AvatarComponent className={'avatar-name'}
                                                                 title={commonService.generateClientNameFromClientDetails(birthday)}/>
                                            </div>
                                            <div
                                                className={'client-name'}><span
                                                className={birthday?.is_alias_name_set ? 'alias-name' : ""}> {CommonService.generateClientNameFromClientDetails(birthday)} </span>(ID:{birthday?.client_id})
                                            </div>
                                        </div>
                                        <ButtonComponent color={"primary"} className={'ts-col-1 icon-wrapper'}
                                                         disabled={birthday?.is_notified}
                                                         onClick={() => handleSendWishes(birthday?._id)}>
                                            <ImageConfig.FORWARD_ICON/>
                                        </ButtonComponent>
                                    </div>
                                })
                            }

                        </CardComponent>
                    </div>
                </div>
                <DrawerComponent isOpen={isViewMessageDrawerOpen}
                                 onClose={handleCloseAllMessagesDrawer}
                                 showClose={true}
                                 className={'t-view-all-message'}>
                    {mode === 'view' &&
                        <div>
                            <FormControlLabelComponent label={'View All Message(s)'} size={'lg'}/>
                            {messageHistory?.map((message: any) => {
                                return (<div className={'message-timestamp-wrapper'}>
                                        <div className={'message-edit-delete-button-wrapper'}>
                                            <div>
                                                <CardComponent className={'message-wrapper'}>
                                                    <div>{message?.message}</div>
                                                </CardComponent>
                                            </div>
                                            <span className={'mrg-left-10'}><IconButtonComponent
                                                onClick={() => handleMessageDelete(message?._id)}
                                                color={'error'}><ImageConfig.DeleteIcon/></IconButtonComponent></span>

                                            <span><IconButtonComponent onClick={() => {
                                                setEditableMessage(message)
                                                setMode('edit');

                                            }}><ImageConfig.EditIcon/></IconButtonComponent></span>

                                        </div>
                                        <div
                                            className={'created-at-time-stamp message-timestamp'}>{CommonService.transformTimeStamp2(message?.created_at)}</div>
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
