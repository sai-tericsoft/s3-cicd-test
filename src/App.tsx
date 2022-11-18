import './App.scss';
import {Component} from "react";
import Navigator from "./navigation/navigator";
import AlertComponent from "./shared/components/alert/alertComponent";
import {ColorConfig} from "./constants";
import CheckLoginComponent from "./shared/components/check-login/checkLoginComponent";
import ConfirmationComponent from "./shared/components/confirmation/confirmationComponent";
import {createTheme, ThemeOptions, ThemeProvider} from '@mui/material/styles';

interface AppProps {
    setCurrentUser?: any;
    makeCheckLoginHTTPRequest?: any;
}

interface AppState {
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
            contrastText: '#FFF'
        },
        warning: {
            main: ColorConfig.warn,
            contrastText: '#FFF'
        },
    },
    typography: {fontFamily: 'Roboto'},
};
const theme = createTheme(themeOptions);

class App extends Component<AppProps, AppState> {

    render() {
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
}

export default App;
