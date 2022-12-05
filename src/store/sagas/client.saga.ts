import {call, put, takeEvery} from "redux-saga/effects";

import {CommonService} from "../../shared/services";
import {
    GET_CLIENT_ACCOUNT_DETAILS,
    GET_CLIENT_BASIC_DETAILS,
    GET_CLIENT_MEDICAL_DETAILS,
    setClientAccountDetails,
    setClientBasicDetails,
    setClientMedicalDetails,
} from "../actions/client.action";

function* getClientBasicDetails(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._client.ClientBasicDetailsAPICall, action.payload.clientId);
        yield put(setClientBasicDetails(resp.data));
    } catch (error) {
        yield put(setClientBasicDetails(undefined));
    }
}

function* getClientMedicalDetails(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._client.ClientMedicalDetailsApiCall, action.payload.clientId);
        yield put(setClientMedicalDetails(resp.data));
    } catch (error) {
        yield put(setClientMedicalDetails(undefined));
    }
}

function* getClientAccountDetails(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._client.ClientAccountDetailsApiCall, action.payload.clientId);
        yield put(setClientAccountDetails(resp.data));
    } catch (error) {
        yield put(setClientAccountDetails(undefined));
    }
}

export default function* clientSaga() {
    yield takeEvery(GET_CLIENT_BASIC_DETAILS, getClientBasicDetails);
    yield takeEvery(GET_CLIENT_MEDICAL_DETAILS, getClientMedicalDetails);
    yield takeEvery(GET_CLIENT_ACCOUNT_DETAILS, getClientAccountDetails);
}
