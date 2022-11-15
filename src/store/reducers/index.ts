import { combineReducers } from "redux";
import AccountReducer, { IAccountReducerState } from "./account.reducer";

export interface IRootReducerState {
    account: IAccountReducerState,
}

const rootReducer = combineReducers({
    account: AccountReducer,
});

export default rootReducer;
