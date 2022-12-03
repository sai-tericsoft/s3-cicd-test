import './App.scss';
import {useEffect, useRef} from "react";
import Navigator from "./navigation/navigator";
import AlertComponent from "./shared/components/alert/alertComponent";
import {ColorConfig} from "./constants";
import CheckLoginComponent from "./shared/components/check-login/checkLoginComponent";
import ConfirmationComponent from "./shared/components/confirmation/ConfirmationComponent";
import {createTheme, ThemeOptions, ThemeProvider} from '@mui/material/styles';
import {CommonService} from "./shared/services";
import {logout} from "./store/actions/account.action";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "./store/reducers";
import {
    getCommunicationModeTypeList,
    getConsultationDurationList,
    getEmploymentStatusList,
    getGenderList,
    getLanguageList,
    getMedicalHistoryOptionsList,
    getMusculoskeletalHistoryOptionsList,
    getPhoneTypeList,
    getReferralTypeList,
    getRelationShipList,
    getSocialMediaPlatformList,
    getSurgicalHistoryOptionsList
} from "./store/actions/static-data.action";

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
    typography: {fontFamily: 'Roboto'},
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
        if (token) {
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
                </ThemeProvider>
            </div>
        </CheckLoginComponent>
        // </LocalizationProvider>
    );
}

export default App;
