import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {GET_APPOINTMENT_LIST_LITE, setAppointmentListLite} from "../actions/appointment.action";


function* getAppointmentListLite(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._appointment.getAppointmentListLite, action.payload);
        yield put(setAppointmentListLite(resp.data));
    } catch (error) {
        yield put(setAppointmentListLite(undefined));
    }
}

export default function* appointmentsSaga() {
    yield takeEvery(GET_APPOINTMENT_LIST_LITE, getAppointmentListLite)
}