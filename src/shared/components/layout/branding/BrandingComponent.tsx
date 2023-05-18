import "./BrandingComponent.scss";
import {ImageConfig, Misc} from "../../../../constants";
import React from "react";

interface BrandingComponentProps {

}

const BrandingComponent = (props: BrandingComponentProps) => {

    return (
        <div className={'branding-component'}>
            <img className={"logo-default"} src={ImageConfig.Logo} alt={Misc.APP_NAME + 'Logo'}/>
            <img className={"logo-sm"} src={ImageConfig.LogoSM} alt={Misc.APP_NAME + 'Logo'}/>
        </div>
    );

};

export default BrandingComponent;