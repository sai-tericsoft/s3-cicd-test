import "./SuccessPopupComponent.scss";
import {ImageConfig} from "../../../constants";
import React from "react";
import LottieFileGenerationComponent from "../lottie-file-generation/LottieFileGenerationComponent";

interface SuccessPopupComponentProps {
    title?: string;
    subTitle?: string;
    description?: string;
    onCTAClick?: () => void;
    imageData?: any;
    showLottie?: boolean;
    actions?: React.ReactNode;
}

const SuccessPopupComponent = (props: SuccessPopupComponentProps) => {

    const {showLottie, actions,subTitle} = props;
    const title = props.title || 'Yay!';
    const description = props.description || 'Congratulations';
    const imageData = props.imageData || ImageConfig.VerifiedCheck;

    return (
        <div className={'success-popup-component'}>
            <div className={'success-popup-image'}>
                {
                    showLottie ? <LottieFileGenerationComponent
                            loop={true}
                            autoplay={true}
                            animationData={imageData}/> :
                        <img src={imageData} alt={'success-popup-tick'}/>
                }
            </div>
            <div className="success-popup-meta">
                <div className={'success-popup-title'}>{title}</div>
                <div className={'success-popup-sub-title'}>{subTitle}</div>
                <div className={'success-popup-description'}>
                    {description}
                </div>
                {
                    actions && <div className="success-popup-cta">
                        {actions}
                    </div>
                }
            </div>
        </div>
    );

}

export default SuccessPopupComponent;
