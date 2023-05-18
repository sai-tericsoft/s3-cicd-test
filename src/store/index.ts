import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";
import { ENV } from "../constants";

const saga = createSagaMiddleware();
const middlewares: any = [saga];

if (ENV.ENABLE_REDUX_LOGS) {
    middlewares.push(logger);
}

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
saga.run(rootSaga);
