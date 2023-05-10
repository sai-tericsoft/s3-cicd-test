import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {GET_ALL_MESSAGE_HISTORY, setAllMessageHistory} from "../actions/dashboard.action";


function* getMessageHistory() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._dashboardService.dashboardMessageHistory);
        yield put(setAllMessageHistory(resp.data));
    } catch (error: any) {
        yield put(setAllMessageHistory(undefined));
    }
}

export default function* dashboardSaga() {
    yield takeEvery(GET_ALL_MESSAGE_HISTORY, getMessageHistory);

}