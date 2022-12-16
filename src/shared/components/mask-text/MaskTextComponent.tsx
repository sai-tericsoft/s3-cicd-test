import "./MaskTextComponent.scss";
import {useCallback, useState} from "react";
import ToolTipComponent from "../tool-tip/ToolTipComponent";

interface MaskTextComponentProps {
    value: string;
    maskingCharacter?: string;
}

const MaskTextComponent = (props: MaskTextComponentProps) => {

    const {value} = props;
    const maskingCharacter = props.maskingCharacter || "*";
    const [isTextMasked, setIsTextMasked] = useState<boolean>(true);

    const handleMaskingText = useCallback(() => {
        setIsTextMasked(!isTextMasked);
    }, [isTextMasked]);

    return (
        <div className={'mask-text-component'}>
            <ToolTipComponent position={"top-start"} tooltip={(isTextMasked ? "Show" : "Hide") + (" Information")}>
                <div className={"mask-text"}
                     onClick={handleMaskingText}>
                    {isTextMasked ? value.replaceAll(/./g, maskingCharacter) : value}
                </div>
            </ToolTipComponent>
        </div>
    );

};

export default MaskTextComponent;