import { BehaviorSubject, Subject } from "rxjs";
import {IConfirmationConfig} from "../models/confirmation.model";

const logoutSubject: Subject<void> = new Subject();
const updateLoginUserTokenSubject: Subject<string | undefined> = new Subject<string | undefined>()
const updateActiveUserIdSubject: Subject<string> = new Subject<string>();
const NetworkChangeSubject: Subject<boolean> = new Subject<boolean>();
const ReloadStateSubject: Subject<void> = new Subject<void>();
const PageLoadingStateSubject: Subject<boolean> = new Subject<boolean>();

const FetchPageDataSubject: Subject<any> = new Subject<any>();

const DialogStateSubject: Subject<{ component: any, promise: { resolve: any, reject: any } }> = new Subject<{ component: any; promise: { resolve: any; reject: any } }>()

const SetUserColorScheme: Subject<'light' | 'dark'> = new Subject<'light' | 'dark'>();
const ConfirmStateSubject: Subject<{ config: IConfirmationConfig, promise: { resolve: any, reject: any } }> = new Subject<{ config: IConfirmationConfig; promise: { resolve: any; reject: any } }>()
const pageBackButtonSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
const pageTitleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

const Communications = {
    logoutSubject,
    updateActiveUserIdSubject,
    updateLoginUserTokenSubject,
    NetworkChangeSubject,
    ReloadStateSubject,
    SetUserColorScheme,
    PageLoadingStateSubject,
    pageBackButtonSubject,
    pageTitleSubject,
    ConfirmStateSubject,
    DialogStateSubject,
    FetchPageDataSubject
};

export default Communications;
