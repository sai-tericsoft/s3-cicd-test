// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas
import accountSaga from './account.saga';
import staticDataSaga from "./static-data.saga";
import clientSaga from "./client.saga";
import serviceSaga from "./service.saga";
import chartNoteSaga from "./chart-note.saga";

// Redux Saga: Root Saga
export default function* rootSaga() {
    yield all([
        fork(accountSaga),
        fork(staticDataSaga),
        fork(clientSaga),
        fork(serviceSaga),
        fork(chartNoteSaga)
    ]);
}
