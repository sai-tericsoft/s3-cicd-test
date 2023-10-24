import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {
    GET_BILLING_ADDRESS_LIST,
    GET_BILLING_FROM_ADDRESS,
    GET_BILLING_SETTINGS, setBillingAddressList,
    setBillingFromAddress,
    setBillingSettings
} from "../actions/billings.action";

function* getBillingFromAddress(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._billingsService.GetBillingFromAddress, action.payload);
        yield put(setBillingFromAddress(resp.data));
    } catch (error) {
        yield put(setBillingFromAddress(undefined));
    }
}

function *getBillingSettings(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._billingsService.GetBillingSettings, action.payload);
        yield put(setBillingSettings(resp.data));
    } catch (error) {
        yield put(setBillingSettings(undefined));
    }
}

function *getBillingAddressList(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._billingsService.GetBillingAddressList, action.payload.clientId);
        yield put(setBillingAddressList(resp.data));
    } catch (error) {
        yield put(setBillingAddressList([]));
    }
}
export default function* billingsSaga() {
    yield takeEvery(GET_BILLING_FROM_ADDRESS, getBillingFromAddress);
    yield takeEvery(GET_BILLING_SETTINGS, getBillingSettings);
    yield takeEvery(GET_BILLING_ADDRESS_LIST, getBillingAddressList);
}