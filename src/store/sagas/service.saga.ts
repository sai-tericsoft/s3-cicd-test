import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {
    GET_ALL_SERVICE_LIST,
    GET_SERVICE_PROVIDER_LIST,
    setAllServiceList,
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
        const resp = yield call(CommonService._service.AllServiceListAPICall);
        yield put(setAllServiceList(resp.data));
    } catch (error) {
        yield put(setAllServiceList([]));
    }
}

export default function* serviceSaga() {
    yield takeEvery(GET_SERVICE_PROVIDER_LIST, getServiceProviderList);
    yield takeEvery(GET_ALL_SERVICE_LIST, getAllServiceList)
}
