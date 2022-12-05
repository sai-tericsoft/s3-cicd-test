import { combineReducers } from "redux";
import AccountReducer, { IAccountReducerState } from "./account.reducer";
import NavigationReducer, {INavigationReducerState} from "./navigation.reducer";
import StaticDataReducer, {IStaticDataReducerState} from "./static-data.reducer";
import ClientReducer, {IClientReducerState} from "./client.reducer";

export interface IRootReducerState {
    account: IAccountReducerState,
    navigation: INavigationReducerState,
    staticData: IStaticDataReducerState,
    client: IClientReducerState,
}

const rootReducer = combineReducers({
    account: AccountReducer,
    navigation: NavigationReducer,
    staticData: StaticDataReducer,
    client: ClientReducer
});

export default rootReducer;
