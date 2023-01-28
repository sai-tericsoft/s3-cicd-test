import "./MaskTextComponent.scss";
import {useCallback, useState} from "react";
import ToolTipComponent from "../tool-tip/ToolTipComponent";

interface MaskTextComponentProps {
    value: string;
    maskingCharacter?: string;
    showToolTip?: boolean;
    autoHide?: boolean;
    autoHideAfter?: number; // in seconds
    onToggle?: (isTextMasked: boolean) => void;
}

const MaskTextComponent = (props: MaskTextComponentProps) => {

    const {value, showToolTip, onToggle} = props;
    const maskingCharacter = props.maskingCharacter || "*";
    const autoHide = props.autoHide !== undefined ? props.autoHide : true;
    const autoHideAfter = props.autoHideAfter || 5;
    const [isTextMasked, setIsTextMasked] = useState<boolean>(true);

    const handleMaskingText = useCallback(() => {
        setIsTextMasked(!isTextMasked);
        if (onToggle) {
            onToggle(!isTextMasked);
        }
        if (autoHide) {
            setTimeout(() => {
                setIsTextMasked(true);
                if (onToggle) {
                    onToggle(true);
                }
            }, autoHideAfter * 1000);
        }
    }, [autoHide, onToggle, autoHideAfter, isTextMasked]);

    return (
        <div className={'mask-text-component'}>
            {
                showToolTip &&
                <ToolTipComponent position={"top-start"} tooltip={(isTextMasked ? "Show" : "Hide") + (" Information")}>
                    <div className={"mask-text"}
                         onClick={handleMaskingText}>
                        {isTextMasked ? value.replaceAll(/./g, maskingCharacter) : value}
                    </div>
                </ToolTipComponent>
            }
            {
                !showToolTip && <div className={"mask-text"}
                                     onClick={handleMaskingText}>
                    {isTextMasked ? value.replaceAll(/./g, maskingCharacter) : value}
                </div>
            }
        </div>
    );

};

export default MaskTextComponent;
