import { combineReducers } from "redux";
import AccountReducer, { IAccountReducerState } from "./account.reducer";
import NavigationReducer, {INavigationReducerState} from "./navigation.reducer";
import StaticDataReducer, {IStaticDataReducerState} from "./static-data.reducer";

export interface IRootReducerState {
    account: IAccountReducerState,
    navigation: INavigationReducerState,
    staticData: IStaticDataReducerState,
}

const rootReducer = combineReducers({
    account: AccountReducer,
    navigation: NavigationReducer,
    staticData: StaticDataReducer,
});

export default rootReducer;
