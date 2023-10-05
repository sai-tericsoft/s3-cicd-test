import React from 'react';
import { useNavigate} from "react-router-dom";
import "./notFoundScreen.scss";
import ButtonComponent from "../button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface NotFoundScreenProps {
    backUrl?: string
}

const NotFoundScreen = (props: NotFoundScreenProps) => {
    const navigate = useNavigate();
    return (
        <div className="not-found-screen">
            <div className={'not-found-icon-wrapper'}>
                <ImageConfig.PageNotFound/>
            </div>
            <div className={'not-found-title'}>
                Oops! Page not found.
            </div>
            <div className={'not-found-description'}>
                This page doesn’t exist or was removed!<br/>
                We suggest you to return to home.
            </div>
            <div className={'not-found-action-wrapper'}>
                <ButtonComponent
                    prefixIcon={<ArrowBackIcon/>}
                    onClick={() => navigate('/')}
                    variant={"contained"}
                    color={"primary"}
                >
                    Go back to Home
                </ButtonComponent>
            </div>
        </div>
    )
};

export default NotFoundScreen;
