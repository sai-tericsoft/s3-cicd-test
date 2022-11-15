import './comingSoonScreen.scss'
import React from 'react';

interface ComingSoonScreenProps {
    featureName?: string;
}

const ComingSoonScreen = (props: ComingSoonScreenProps) => {
        const {featureName} = props
        return (
            <div className="coming-soon-screen animated-gif-wrapper">
                {/*<img src={ImageConfig.ComingSoonGif} alt={"comingSoon"}/>*/}
                <div className="coming-soon-title">{featureName} Feature Coming Soon!</div>
                <div className="coming-soon-description">We are currently coding. You will be notified once this feature is
                    available.
                </div>
            </div>
        )
    }

;

export default ComingSoonScreen;