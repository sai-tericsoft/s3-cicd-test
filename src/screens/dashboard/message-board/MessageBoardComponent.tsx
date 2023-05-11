import "./MessageBoardComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../../shared/services";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import {ImageConfig} from "../../../constants";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {useCallback, useState} from "react";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";

interface MessageBoardComponentProps {

}

const MessageBoardComponent = (props: MessageBoardComponentProps) => {

    const {messageHistory} = useSelector((state: IRootReducerState) => state.dashboard)
    const [isViewMessageDrawerOpen, setIsViewMessageDrawerOpen] = useState<boolean>(false)

    const handleOpenViewAllMessagesDrawer = useCallback(() => {
        setIsViewMessageDrawerOpen(true)
    }, []);

    const handleCloseAllMessagesDrawer = useCallback(() => {
        setIsViewMessageDrawerOpen(false)
    }, [])


    return (
        <div className={'message-board-component'}>
            <div className={'message-board-wrapper'}>
                <CardComponent className={'message-board'}>
                    <div className={'message-board-view-all-messages-wrapper'}>
                        <div className={'message-board-text'}>Message Board</div>
                        <div className={'view-all-message'} onClick={handleOpenViewAllMessagesDrawer}>View All
                            Message(s)
                        </div>
                    </div>
                    <CardComponent color={'primary'} className={'view-message-board'}>
                        {messageHistory?.map((message: any) => {
                            return (<>
                                    <div className={'message-text'}>{message?.message}</div>
                                    <div
                                        className={'time-stamp'}>{CommonService.transformTimeStamp(message?.created_at)}</div>
                                    {messageHistory?.length > 1 &&
                                        <HorizontalLineComponent/>
                                    }
                                </>
                            )
                        })}
                    </CardComponent>
                </CardComponent>
            </div>
            <CardComponent className={'birthday-board'}>
                <div className={'today-birthday-text'}>
                    Today's Birthday
                </div>
                <div className={'coming-soon-image-text-wrapper'}>
                    <div>
                        <div className={'mrg-left-50'}>
                            <ImageConfig.ComingSoon/>
                        </div>
                        <div>
                            Coming Soon
                        </div>
                    </div>
                </div>
            </CardComponent>
            <DrawerComponent isOpen={isViewMessageDrawerOpen}
                             onClose={handleCloseAllMessagesDrawer}
                             showClose={true}
                             className={'t-view-all-message'}>
                <div>
                    <FormControlLabelComponent label={'View All Message(s)'} size={'lg'}/>
                    {messageHistory?.map((message: any) => {
                        return (<div className={'message-timestamp-wrapper'}>
                                <div className={'message-edit-delete-button-wrapper'}>
                                    <div>
                                        <CardComponent color={'primary'}>
                                            <div>{message?.message}</div>
                                        </CardComponent>
                                    </div>
                                    <span><IconButtonComponent><ImageConfig.EditIcon/></IconButtonComponent></span>
                                    <span><IconButtonComponent color={'error'}><ImageConfig.DeleteIcon/></IconButtonComponent></span>
                                </div>
                                <div
                                    className={'created-at-time-stamp'}>{CommonService.transformTimeStamp(message?.created_at)}</div>
                            </div>
                        )
                    })}

                </div>

            </DrawerComponent>
        </div>
    );

};

export default MessageBoardComponent;