import "./AllMessageHistoryComponent.scss";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {useCallback, useEffect, useState} from "react";
import {getAllMessageHistory} from "../../../../store/actions/dashboard.action";
import {CommonService} from "../../../../shared/services";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import {ImageConfig, Misc} from "../../../../constants";

interface AllMessageHistoryComponentProps {

}

const AllMessageHistoryComponent = (props: AllMessageHistoryComponentProps) => {

    const dispatch = useDispatch();
    const [copiedIndex, setCopiedIndex] = useState<any>(null);
    const {messageHistory} = useSelector((state: IRootReducerState) => state.dashboard);
    const [openCardId, setOpenCardId] = useState<string | null>(null);


    const toggleCard = useCallback((id: string) => {
        if (openCardId === id) {
            setOpenCardId(null); // Close the card if it is already open
        } else {
            setOpenCardId(id); // Open the card for the clicked item
        }
    }, [openCardId]);

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

                                <span><IconButtonComponent
                                    onClick={() => handleCopyMessage(message?._id, message?.message)}>
                                        <ImageConfig.CopyIcon/>
                                    </IconButtonComponent></span>
                                {copiedIndex === message?._id && <span>Copied!</span>}
                                {
                                    !message?.can_delete && <span>
                                        <IconButtonComponent onClick={() => toggleCard(message._id)}>
                                    <ImageConfig.HorizontalMore/>
                                    </IconButtonComponent>
                                    <div>
                                            {openCardId === message._id && (
                                                <div className="card-content">
                                                    <div
                                                        className={'mrg-top-10 mrg-left-20 mrg-bottom-10 cursor-pointer ts-align-items-center'}
                                                        onClick={() => handleCopyMessage(message?._id, message?.message)}>
                                                        <span> <ImageConfig.CopyIcon/></span><span
                                                        className={'mrg-left-20'}>Copy</span>

                                                    </div>
                                                    <div
                                                        className={' mrg-left-10 cursor-pointer ts-align-items-center'}
                                                        onClick={() => handleMessageDelete(message?._id)}>
                                                        <span className={'mrg-left-5'}> <ImageConfig.DeleteIcon/></span><span
                                                        className={'mrg-left-20'}>Delete</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </span>
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
        </div>
    );

};

export default AllMessageHistoryComponent;