import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {GET_SERVICE_PROVIDER_LIST, setServiceProviderList} from "../actions/service.action";

function* getServiceProviderList(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._service.ServiceProviderListAPICall, action.payload.serviceId);
        yield put(setServiceProviderList(resp.data));
    } catch (error) {
        yield put(setServiceProviderList([]));
    }
}

export default function* serviceSaga() {
    yield takeEvery(GET_SERVICE_PROVIDER_LIST, getServiceProviderList);
}
