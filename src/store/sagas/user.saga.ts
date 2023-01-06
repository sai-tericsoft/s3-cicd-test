import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {GET_ALL_PROVIDERS_LIST, setAllProvidersList} from "../actions/user.action";

function* getAllProvidersList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._user.getUserListLite, {role: "provider"});
        yield put(setAllProvidersList(resp?.data));
    } catch (error: any) {
        yield put(setAllProvidersList([]));
    }
}

export default function* userSaga() {
    yield takeEvery(GET_ALL_PROVIDERS_LIST, getAllProvidersList);
}
