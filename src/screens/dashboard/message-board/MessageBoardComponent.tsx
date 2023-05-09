import "./MessageBoardComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../../shared/services";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

interface MessageBoardComponentProps {

}

const MessageBoardComponent = (props: MessageBoardComponentProps) => {

    const {messageHistory} = useSelector((state: IRootReducerState) => state.dashboard)

    console.log('messageHistory',messageHistory);

    return (
        <div className={'message-board-component'}>
            <div className={'message-board-wrapper'}>
                <CardComponent className={'message-board'}>
                    <div className={'message-board-view-all-messages-wrapper'}>
                        <div className={'message-board-text'}>Message Board</div>
                        <div className={'view-all-message'}>View All Message(s)</div>
                    </div>
                    <CardComponent color={'primary'} className={'view-message-board'}>
                        {messageHistory?.map((message:any)=>{
                            return( <>
                                <div className={'message-text'}>{message?.message}</div>
                                    <div className={'time-stamp'}>{CommonService.transformTimeStamp(message?.created_at)}</div>
                                    {messageHistory?.length>1 &&
                                    <HorizontalLineComponent/>
                                    }
                                </>
                            )
                        })}
                    </CardComponent>
                </CardComponent>
            </div>
        </div>
    );

};

export default MessageBoardComponent;