import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {GET_COUPON_DETAILS, setCouponDetails} from "../actions/discount.action";

function* getCouponDetails(action: any){
    try {
        // @ts-ignore
        const resp = yield call(CommonService._discountService.CouponDetailsAPICall, action.payload.couponId);
        yield put(setCouponDetails(resp.data));
    } catch (error) {
        yield put(setCouponDetails(undefined));
    }
};

export default function* discountSaga(){
    yield takeEvery(GET_COUPON_DETAILS,getCouponDetails)
}