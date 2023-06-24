import './App.scss';
import React, {useEffect, useRef} from "react";
import Navigator from "./navigation/navigator";
import AlertComponent from "./shared/components/alert/alertComponent";
import {ColorConfig} from "./constants";
import CheckLoginComponent from "./shared/components/check-login/checkLoginComponent";
import ConfirmationComponent from "./shared/components/confirmation/ConfirmationComponent";
import {createTheme, ThemeOptions, ThemeProvider} from '@mui/material/styles';
import {CommonService} from "./shared/services";
import {logout, updateLastActivityTime} from "./store/actions/account.action";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "./store/reducers";
import {
    get8MinuteRuleChart,
    getAppointmentStatus,
    getAppointmentTypes,
    getBodyPartsList,
    getCaseStatusList,
    getCommunicationModeTypeList,
    getConcussionFileTypes,
    getConsultationDurationList,
    getEmploymentStatusList, getFacilityListLite,
    getFilesUneditableAfterOptionsList,
    getGenderList,
    getInjuryTypeList,
    getLanguageList,
    getMedicalHistoryOptionsList,
    getMedicalRecordDocumentTypes,
    getMusculoskeletalHistoryOptionsList,
    getPaymentModes,
    getPhoneTypeList,
    getPrimaryRemainderHoursList,
    getProgressReportStatsList,
    getReferralTypeList,
    getRelationShipList,
    getRescheduledHoursList,
    getRescheduledTimesList,
    getSecondaryRemainderHoursList,
    getSocialMediaPlatformList,
    getSurgicalHistoryOptionsList,
    getSystemAutoLockDurationOptionsList,
    getUserMentionsList, getValidDaysList
} from "./store/actions/static-data.action";
import AppVersionComponent from "./shared/components/app-version/appVersionComponent";
import {getAllProvidersList} from "./store/actions/user.action";
import LightBoxComponent from "./shared/components/light-box/LightBoxComponent";
import {debounceTime, fromEvent} from "rxjs";
import SystemLockComponent from "./shared/components/system-lock/SystemLockComponent";
import {getSystemSettings} from "./store/actions/settings.action";
import {getAppointmentSettings} from "./store/actions/appointment.action";

interface AppProps {
    setCurrentUser?: any;
    makeCheckLoginHTTPRequest?: any;
}

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: ColorConfig.primary,
        },
        text: {
            primary: ColorConfig.textLight,
        },
        background: {
            default: ColorConfig.backgroundColor,
        },
        info: {
            main: ColorConfig.info,
            contrastText: '#FFF'
        },
        secondary: {
            main: ColorConfig.secondary,
            contrastText: '#FFF'
        },
        error: {
            main: ColorConfig.error,
            contrastText: '#FFF'
        },
        success: {
            main: ColorConfig.success,
            contrastText: ColorConfig.successContrastText
        },
        warning: {
            main: ColorConfig.warn,
            contrastText: '#FFF'
        },
    },
    typography: {fontFamily: 'inter'},
};
const theme = createTheme(themeOptions);

const App = (props: AppProps) => {

    const dispatch = useDispatch();
    const {token} = useSelector((state: IRootReducerState) => state.account);
    const logoutSubscriptionRef = useRef(true);

    useEffect(() => {
        CommonService._communications.logoutSubject.subscribe(() => {
            if (!logoutSubscriptionRef.current) return null;
            dispatch(logout());
        });
        return () => {
            logoutSubscriptionRef.current = false;
        }
    }, [dispatch]);

    useEffect(() => {
        const subscription = fromEvent(window, 'mousemove')
            .pipe((debounceTime(500)))
            .subscribe((event: any) => {
                if (token) {
                    dispatch(updateLastActivityTime())
                } else {
                    subscription.unsubscribe();
                }
            });
        return () => {
            subscription.unsubscribe();
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (token) {
            dispatch(updateLastActivityTime());
            dispatch(getConsultationDurationList());
            dispatch(getGenderList());
            dispatch(getLanguageList());
            dispatch(getEmploymentStatusList());
            dispatch(getPhoneTypeList());
            dispatch(getRelationShipList());
            dispatch(getMedicalHistoryOptionsList());
            dispatch(getSurgicalHistoryOptionsList());
            dispatch(getMusculoskeletalHistoryOptionsList());
            dispatch(getSocialMediaPlatformList());
            dispatch(getReferralTypeList());
            dispatch(getCommunicationModeTypeList());
            dispatch(getBodyPartsList());
            dispatch(getInjuryTypeList());
            dispatch(getAllProvidersList());
            dispatch(getCaseStatusList());
            dispatch(getProgressReportStatsList());
            dispatch(get8MinuteRuleChart());
            dispatch(getConcussionFileTypes());
            dispatch(getMedicalRecordDocumentTypes());
            dispatch(getAppointmentTypes());
            dispatch(getAppointmentStatus());
            dispatch(getPaymentModes());
            dispatch(getSystemAutoLockDurationOptionsList());
            dispatch(getFilesUneditableAfterOptionsList());
            dispatch(getSystemSettings());
            dispatch(getAppointmentSettings());
            dispatch(getPrimaryRemainderHoursList());
            dispatch(getSecondaryRemainderHoursList());
            dispatch(getRescheduledHoursList());
            dispatch(getRescheduledTimesList());
            dispatch(getUserMentionsList());
            dispatch(getValidDaysList());
            dispatch(getFacilityListLite());
        }
    }, [token, dispatch])

    return (
        // <LocalizationProvider dateAdapter={AdapterMoment}>
        <CheckLoginComponent>
            <div className="app">
                <ThemeProvider theme={theme}>
                    <Navigator/>
                    <AlertComponent/>
                    <ConfirmationComponent/>
                    <AppVersionComponent/>
                    <LightBoxComponent/>
                    <SystemLockComponent/>
                </ThemeProvider>
            </div>
        </CheckLoginComponent>
        // </LocalizationProvider>
    );
}

export default App;
