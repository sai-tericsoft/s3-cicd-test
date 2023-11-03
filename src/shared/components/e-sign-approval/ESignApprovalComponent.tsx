import "./ESignApprovalComponent.scss";
import ButtonComponent from "../button/ButtonComponent";
import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../services";
import LoaderComponent from "../loader/LoaderComponent";
import {IAPIResponseType} from "../../models/api.model";
import {ICheckLoginResponse} from "../../models/account.model";
import { setLoggedInUserData, setLoggedInUserToken} from "../../../store/actions/account.action";
import {Misc} from "../../../constants";

interface ESignApprovalComponentProps {
    isLoading?: boolean;
    canSign?: boolean;
    isSigned: boolean;
    isSigning?: boolean;
    onSign?: () => void;
    signedAt?: string;
    signature_url?: string;
}

const ESignApprovalComponent = (props: ESignApprovalComponentProps) => {

    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const {isSigned, isLoading, onSign, isSigning, canSign, signedAt, signature_url} = props;
    const dispatch = useDispatch();

    const handleOnSign = useCallback(() => {
        if (onSign) {
            onSign();
        }
    }, [onSign]);

    useEffect(() => {
        if(!signature_url){
            const token = CommonService._localStorage.getItem(Misc.LOCAL_STORAGE_JWT_TOKEN);
            if (token) {
                CommonService._account.CheckLoginAPICall(token)
                    .then((response: IAPIResponseType<ICheckLoginResponse>) => {
                        dispatch(setLoggedInUserData(response.data.user));
                        dispatch(setLoggedInUserToken(token));
                    })
                    .catch(() => {

                    })
            }
        }
    }, [signature_url, dispatch]);


    return (
        <div className={'e-sign-approval-component'}>
            <div className="e-sign-image-action-wrapper">
                <div className={`e-sign-image-container ${isSigned ? "signed" : "unsigned"}`}>
                    <img src={signature_url ? signature_url : currentUser?.signature} alt="Signature"/>
                </div>
                {
                    !isSigned && <div className="e-sign-action-container">
                        <ButtonComponent onClick={handleOnSign} isLoading={isSigning} disabled={isSigning || !canSign}>
                            Sign
                        </ButtonComponent>
                    </div>
                }
            </div>
            {signedAt && <div className="e-sign-time-stamp">
                Electronically signed on : <> {CommonService.transformTimeStamp(signedAt)} </>
            </div>}
            {
                isLoading && <div className={'e-sign-loading'}>
                    <LoaderComponent size={"sm"} type={"spinner"}/>
                </div>
            }
        </div>
    );

};

export default ESignApprovalComponent;
