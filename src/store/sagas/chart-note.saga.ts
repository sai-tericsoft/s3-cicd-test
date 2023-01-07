import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";
import {GET_CLIENT_FAVOURITE_CODES, setClientFavouriteCode} from "../actions/chart-notes.action";


function* getClientFavouriteCodeList(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._client.GetAllFavouriteCodes, action.payload);
        yield put(setClientFavouriteCode(resp.data.docs));
    } catch (error) {
        console.log(error, 'getClientFavouriteCodeList');
        yield put(setClientFavouriteCode(undefined));
    }
}

export default function* chartNoteSaga() {
    yield takeEvery(GET_CLIENT_FAVOURITE_CODES, getClientFavouriteCodeList)
}