import { combineReducers } from "redux";
import AccountReducer, { IAccountReducerState } from "./account.reducer";
import NavigationReducer, {INavigationReducerState} from "./navigation.reducer";

export interface IRootReducerState {
    account: IAccountReducerState,
    navigation: INavigationReducerState,
}

const rootReducer = combineReducers({
    account: AccountReducer,
    navigation: NavigationReducer,
});

export default rootReducer;
