import "./LottieFileGenerationComponent.scss";
import React from 'react';
import Lottie from "lottie-react";

interface LottieFileGenerationComponentProps {
    animationData?: any
    autoplay?: boolean
    loop?: boolean
}

const LottieFileGenerationComponent = (props: LottieFileGenerationComponentProps) => {
    const {animationData, autoplay, loop} = props
    return (
        <div className="lottie-file-wrapper">
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}/>
        </div>
    )

};

export default LottieFileGenerationComponent;