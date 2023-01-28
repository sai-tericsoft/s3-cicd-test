import "./ESignApprovalComponent.scss";
import ButtonComponent from "../button/ButtonComponent";
import {useCallback} from "react";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../services";
import LoaderComponent from "../loader/LoaderComponent";

interface ESignApprovalComponentProps {
    isLoading?: boolean;
    canSign?: boolean;
    isSigned: boolean;
    isSigning?: boolean;
    onSign?: () => void;
    signedAt?: string;
}

const ESignApprovalComponent = (props: ESignApprovalComponentProps) => {

    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const {isSigned, isLoading, onSign, isSigning, canSign, signedAt} = props;

    const handleOnSign = useCallback(() => {
        if (onSign) {
            onSign();
        }
    }, [onSign]);

    return (
        <div className={'e-sign-approval-component'}>
            <div className="e-sign-image-action-wrapper">
                <div className={`e-sign-image-container ${isSigned ? "signed" : "unsigned"}`}>
                    <img src={currentUser?.signature_url} alt="Signature"/>
                </div>
                {
                    !isSigned && <div className="e-sign-action-container">
                        <ButtonComponent onClick={handleOnSign} isLoading={isSigning} disabled={isSigning || !canSign}>
                            Sign
                        </ButtonComponent>
                    </div>
                }
            </div>
            <div className="e-sign-time-stamp">
                Electronically Signed On : <> {signedAt && CommonService.transformTimeStamp(signedAt)} </>
            </div>
            {
                isLoading && <div className={'e-sign-loading'}>
                    <LoaderComponent size={"sm"} type={"spinner"}/>
                </div>
            }
        </div>
    );

};

export default ESignApprovalComponent;
