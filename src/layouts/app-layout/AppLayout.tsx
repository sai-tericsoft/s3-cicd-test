import React, {useEffect, useRef} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../store/reducers";
import {CommonService} from "../../shared/services";
import {logout} from "../../store/actions/account.action";

export interface AppLayoutProps {

}

const AppLayout = (props: AppLayoutProps) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const {token} = useSelector((state: IRootReducerState) => state.account);
    const logoutSubscriptionRef = useRef(true);

    console.log(props, location);

    useEffect(() => {
        if (!token) {
            navigate('/login?returnUrl=' + encodeURIComponent(location.pathname + location.search));
        }
    }, [token, navigate, location]);

    useEffect(() => {
        CommonService._communications.logoutSubject.subscribe(() => {
            // CommonService._alert.showToast('Session expired, Please register', 'info');
            if (!logoutSubscriptionRef.current) return null;
            dispatch(logout());
        });
        return () => {
            logoutSubscriptionRef.current = false;
        }
    }, [dispatch]);

    useEffect(() => { // TODO: move to appropriate position later
        if (token) {
            // dispatch(getActiveStatusList());
            // dispatch(getFacilityStatusList());
            // dispatch(getFacilityTypesList());
            // dispatch(getUserList());
            // dispatch(getLocationStatusList());
            // dispatch(getLocationTypesList());
            // dispatch(getFacilityListLite());
            // dispatch(getLocationListLite());
        }
    }, [dispatch, token]);

    return (
        <div className="app-layout">
            <div className="header-and-page-container">
                <div className="page-container">
                    <Outlet/>
                </div>
            </div>
        </div>
    );

}


export default AppLayout;




