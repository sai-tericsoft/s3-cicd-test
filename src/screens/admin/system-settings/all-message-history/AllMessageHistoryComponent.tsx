import "./AllMessageHistoryComponent.scss";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {useCallback, useEffect, useState} from "react";
import {getAllMessageHistory} from "../../../../store/actions/dashboard.action";
import {CommonService} from "../../../../shared/services";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import {ImageConfig} from "../../../../constants";

interface AllMessageHistoryComponentProps {

}

const AllMessageHistoryComponent = (props: AllMessageHistoryComponentProps) => {

    const dispatch = useDispatch();
    const [copiedIndex, setCopiedIndex] = useState<any>(null);
    const {messageHistory} = useSelector((state: IRootReducerState) => state.dashboard);

    useEffect(() => {
        dispatch(getAllMessageHistory());
    }, [dispatch]);

    const handleCopyMessage = useCallback((id:string,message:any)=>{
        navigator.clipboard.writeText(message)
            .then(() => {
                setCopiedIndex(id);
                setTimeout(() => {
                    setCopiedIndex(null);
                }, 2000); // Reset the copied index after 2 seconds
            })
    },[]);
    
    return (
        <div className={'all-message-history-component'}>
            <FormControlLabelComponent label={'Message History'} size={'lg'}/>
            <div className={'message-history-board'}>
                {
                    messageHistory?.map((message: any) => {
                        return (<>
                            <div className={'time-stamp'}>{CommonService.transformTimeStamp2(message?.created_at)}</div>
                            <div className={'history-message-wrapper'}>
                                <span className={'history-message'}>
                                    <span>{message?.message}</span>
                                </span>
                                <span><IconButtonComponent onClick={()=>handleCopyMessage(message?._id,message?.message)}>
                                        <ImageConfig.CopyIcon/>
                                    </IconButtonComponent></span>
                                {copiedIndex === message?._id && <span>Copied!</span>}
                            </div>
                        </>)
                    })
                }
            </div>
        </div>
    );

};

export default AllMessageHistoryComponent;