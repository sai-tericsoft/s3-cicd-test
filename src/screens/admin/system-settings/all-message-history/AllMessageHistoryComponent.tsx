import "./AllMessageHistoryComponent.scss";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {useEffect} from "react";
import {getAllMessageHistory} from "../../../../store/actions/dashboard.action";
import {CommonService} from "../../../../shared/services";

interface AllMessageHistoryComponentProps {

}

const AllMessageHistoryComponent = (props: AllMessageHistoryComponentProps) => {

    const dispatch = useDispatch();
    const {messageHistory} = useSelector((state: IRootReducerState) => state.dashboard);

    useEffect(() => {
        dispatch(getAllMessageHistory());
    }, [dispatch]);

    console.log('mh', messageHistory);

    return (
        <div className={'all-message-history-component'}>
            <FormControlLabelComponent label={'Message History'} size={'lg'}/>
            <div className={'message-history-board'}>
                {
                    messageHistory?.map((message:any)=>{
                        return(<>
                            <div className={'time-stamp'}>{CommonService.transformTimeStamp2(message?.created_at)}</div>
                            <div className={'history-message-wrapper'}>
                                <div className={'history-message'}>
                                {message?.message}
                                </div>
                            </div>
                        </>)
                    })
                }
            </div>
        </div>
    );

};

export default AllMessageHistoryComponent;