import "./BrandingComponent.scss";
import {ImageConfig, Misc} from "../../../../constants";
import React from "react";

interface BrandingComponentProps {

}

const BrandingComponent = (props: BrandingComponentProps) => {

    return (
        <div className={'branding-component'}>
            <img src={ImageConfig.Logo} alt={Misc.APP_NAME + 'Logo'}/>
        </div>
    );

};

export default BrandingComponent;