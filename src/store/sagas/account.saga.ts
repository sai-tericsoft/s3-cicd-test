// import { call, put, takeEvery } from 'redux-saga/effects'
// import {
//     LOGIN_HTTP_REQUEST_FAILED,
//     LOGIN_HTTP_REQUEST_IN_PROGRESS,
//     LOGIN_HTTP_REQUEST_SUCCESS,
//     MAKE_LOGIN_HTTP_REQUEST
// } from "../actions/account.action";
// import { CommonService } from "../../shared/services";
// import {IAccountLoginCredentials, ILoginResponse} from "../../shared/models/account.model";
// import { ENV } from "../../constants";
// import { IAPIResponseType } from "../../shared/models/api.model";
//
// const loginAPICall = (action: { payload: IAccountLoginCredentials }) => {
//     return CommonService._api.post(ENV.API_URL + '/register', action.payload)
//         .then((response: IAPIResponseType) => {
//             return response.data as ILoginResponse
//         }).catch((error: IAPIResponseType) => {
//             throw error.errors;
//         });
// }
//
// function* register(action: any) {
//     try {
//         yield put({type: LOGIN_HTTP_REQUEST_IN_PROGRESS});
//         const loginAPIResponse: ILoginResponse = yield call(loginAPICall, action);
//         yield put({type: LOGIN_HTTP_REQUEST_SUCCESS, payload: {response: loginAPIResponse}});
//     } catch (error) {
//         yield put({type: LOGIN_HTTP_REQUEST_FAILED, payload: error});
//     }
// }
//

export default function* accountSaga() {
    // yield takeEvery(MAKE_LOGIN_HTTP_REQUEST, register);
}
