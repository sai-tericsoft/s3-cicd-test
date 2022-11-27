import {call, put, takeEvery} from "redux-saga/effects";

import {GET_CONSULTATION_DURATION_LIST, setConsultationDurationList} from "../actions/static-data.action";
import {CommonService} from "../../shared/services";

function* getConsultationDurationList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getConsultationDurationList);
        console.log(resp);
        yield put(setConsultationDurationList(resp?.data));
    } catch (error: any) {
        yield put(setConsultationDurationList([]));
    }
}

export default function* staticDataSaga() {
    yield takeEvery(GET_CONSULTATION_DURATION_LIST, getConsultationDurationList);
}
