import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {
    GET_ALL_PROVIDERS_LIST,
    GET_USER_BASIC_DETAILS,
    GET_USER_SLOTS,
    setAllProvidersList,
    setUserBasicDetails,
    setUserSlots,
} from "../actions/user.action";

function* getAllProvidersList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._user.getUserListLite, {role: "provider"});
        yield put(setAllProvidersList(resp?.data));
    } catch (error: any) {
        yield put(setAllProvidersList([]));
    }
}

function* getUserBasicDetails(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._user.getUserBasicDetails, action.payload.userId);
        yield put(setUserBasicDetails(resp.data));
    } catch (error) {
        yield put(setUserBasicDetails(undefined));
    }
}

function* getUserSlots(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._user.slotDetailsAPICall, action.payload.userId, action.payload.facilityId);
        yield put(setUserSlots(resp.data));
    } catch (error) {
        yield put(setUserSlots(undefined));
    }
}

export default function* userSaga() {
    yield takeEvery(GET_USER_BASIC_DETAILS, getUserBasicDetails);
    yield takeEvery(GET_ALL_PROVIDERS_LIST, getAllProvidersList);
    yield takeEvery(GET_USER_SLOTS, getUserSlots);
}
