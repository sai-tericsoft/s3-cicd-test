import "./AccessDeniedComponent.scss";
import {ImageConfig} from "../../../constants";
import ButtonComponent from "../button/ButtonComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useNavigate} from "react-router-dom";

interface AccessDeniedComponentProps {

}

const AccessDeniedComponent = (props: AccessDeniedComponentProps) => {

    const navigate = useNavigate();

    return (
        <div className="access-denied-screen">
            <div className={'access-denied-icon-wrapper'}>
                <ImageConfig.AccessDenied/>
            </div>
            <div className={'access-denied-title'}>
                Access Denied
            </div>
            <div className={'access-denied-description'}>
                The page you’re trying to access has restricted access.<br/>
                Please refer to your system admin.
            </div>
            <div className={'access-denied-action-wrapper'}>
                <ButtonComponent
                    prefixIcon={<ArrowBackIcon/>}
                    onClick={() =>navigate('/') }
                    variant={"contained"}
                    color={"primary"}
                >
                    Go back to Home
                </ButtonComponent>
            </div>
        </div>
    );

};

export default AccessDeniedComponent;
