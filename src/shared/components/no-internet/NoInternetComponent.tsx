import "./NoInternetComponent.scss";
import React, {useEffect, useState} from "react";
import {ImageConfig} from "../../../constants";
import ButtonComponent from "../button/ButtonComponent";
import RefreshIcon from '@mui/icons-material/Refresh';

const NoInternetComponent = (props: React.PropsWithChildren<any>) => {
    const [isOffline, setIsOffline] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        window.addEventListener('offline', () => setIsOffline(true));
        window.addEventListener('online', () => setIsOffline(false));
    }, []);

    const retryConnection = () => {
        setIsChecking(true);
        if (navigator.onLine) {
            setIsOffline(false);
            setIsChecking(false);
        } else {
            setIsOffline(true);
            setIsChecking(false);
        }
    }

    return (
        <>
            {isOffline ?
                <div className={'no-internet-component'}>
                    <div className={'no-internet-icon-wrapper'}>
                        <ImageConfig.NoInternetIcon/>
                    </div>
                    <div className={'no-internet-title'}>
                        No Internet Connection
                    </div>
                    <div className={'no-internet-description'}>
                        Seems like you are not connected <br/>
                        to the internet.
                    </div>
                    <div className={'refresh-page-action-wrapper'}>
                        <ButtonComponent
                            prefixIcon={<RefreshIcon/>}
                            onClick={() => retryConnection}
                            variant={"contained"}
                            color={"primary"}
                            isLoading={isChecking}
                            >
                            Refresh Page
                        </ButtonComponent>
                    </div>

                </div>
                :
                props.children
            }
        </>
    );

};

export default NoInternetComponent;
