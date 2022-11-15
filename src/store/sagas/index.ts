// Imports: Dependencies
import {all, fork} from 'redux-saga/effects';
// Imports: Redux Sagas
import accountSaga from './account.saga';

// Redux Saga: Root Saga
export default function* rootSaga() {
    yield all([
        fork(accountSaga),
    ]);
}
