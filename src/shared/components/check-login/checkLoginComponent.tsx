import React, {useCallback, useEffect, useState} from 'react';
import PageLoaderComponent from "../page-loader/pageLoaderComponent";
import {CommonService} from "../../services";
import {Misc} from "../../../constants";
import {logout, setLoggedInUserData, setLoggedInUserToken} from "../../../store/actions/account.action";
import {useDispatch} from "react-redux";
import {IAPIResponseType} from "../../models/api.model";
import {ICheckLoginResponse} from "../../models/account.model";

interface CheckLoginComponentProps {

}

const CheckLoginComponent = (props: React.PropsWithChildren<CheckLoginComponentProps>) => {

    const {children} = props;
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const checkLogin = useCallback(() => {
        const token = CommonService._localStorage.getItem(Misc.LOCAL_STORAGE_JWT_TOKEN);
        if (token) {
            setIsLoading(true);
            CommonService._account.CheckLoginAPICall(token)
                .then((response: IAPIResponseType<ICheckLoginResponse>) => {
                    setIsLoading(false);
                    setIsLoaded(true);
                    dispatch(setLoggedInUserData(response.data.user));
                    dispatch(setLoggedInUserToken(token));
                })
                .catch(() => {
                    dispatch(logout());
                    setIsLoading(false);
                    setIsLoaded(true);
                })
        } else {
            setIsLoading(false);
            setIsLoaded(true);
        }
    }, [dispatch]);

    useEffect(() => {
        checkLogin();
    }, [checkLogin]);

    return (
        <>
            {(isLoading && !isLoaded) && <PageLoaderComponent/>}
            {isLoaded && children}
        </>
    )
};

export default CheckLoginComponent;