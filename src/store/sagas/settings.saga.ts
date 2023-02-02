import {call, put, takeEvery} from "redux-saga/effects";

import {CommonService} from "../../shared/services";
import {GET_SYSTEM_SETTINGS, setSystemSettings} from "../actions/settings.action";

function* getSystemSettings() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._systemSettings.GetSystemSettingsAPICall);
        yield put(setSystemSettings(resp?.data));
    } catch (error: any) {
        yield put(setSystemSettings(undefined));
    }
}

export default function*settingsSaga() {
    yield takeEvery(GET_SYSTEM_SETTINGS, getSystemSettings);
}
