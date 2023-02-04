// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas
import accountSaga from './account.saga';
import staticDataSaga from "./static-data.saga";
import clientSaga from "./client.saga";
import serviceSaga from "./service.saga";
import userSaga from "./user.saga";
import chartNotesSaga from "./chart-notes.saga";
import inventorySaga from "./inventory.saga";
import settingsSaga from "./settings.saga";

// Redux Saga: Root Saga
export default function* rootSaga() {
    yield all([
        fork(accountSaga),
        fork(staticDataSaga),
        fork(clientSaga),
        fork(serviceSaga),
        fork(userSaga),
        fork(chartNotesSaga),
        fork(inventorySaga),
        fork(settingsSaga)
    ]);
}
