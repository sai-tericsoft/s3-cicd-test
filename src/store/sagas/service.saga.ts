import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {
    GET_ALL_SERVICE_LIST,
    GET_SERVICE_LIST_LITE,
    GET_SERVICE_PROVIDER_LIST,
    setAllServiceList,
    setAllServiceListLite,
    setServiceProviderList
} from "../actions/service.action";

function* getServiceProviderList(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._service.ServiceProviderListAPICall, action.payload.serviceId);
        yield put(setServiceProviderList(resp.data));
    } catch (error) {
        yield put(setServiceProviderList([]));
    }
}

function* getAllServiceList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._service.AllServiceListAPICall, {is_active: true});
        yield put(setAllServiceList(resp.data));
    } catch (error) {
        yield put(setAllServiceList([]));
    }
}

function* getServiceListLite() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._service.AllServiceListLite, {is_active: true});
        yield put(setAllServiceListLite(resp.data));
    } catch (error) {
        yield put(setAllServiceListLite([]));
    }
}

export default function* serviceSaga() {
    yield takeEvery(GET_SERVICE_PROVIDER_LIST, getServiceProviderList);
    yield takeEvery(GET_ALL_SERVICE_LIST, getAllServiceList)
    yield takeEvery(GET_SERVICE_LIST_LITE, getServiceListLite)
}
