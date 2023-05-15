import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {GET_BILLING_FROM_ADDRESS, setBillingFromAddress} from "../actions/billings.action";

function* getBillingFromAddress(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._billingsService.GetBillingFromAddress, action.payload);
        yield put(setBillingFromAddress(resp.data));
    } catch (error) {
        yield put(setBillingFromAddress(undefined));
    }
}

export default function* billingsSaga() {
    yield takeEvery(GET_BILLING_FROM_ADDRESS, getBillingFromAddress)
}