import {combineReducers} from "redux";
import AccountReducer, {IAccountReducerState} from "./account.reducer";
import NavigationReducer, {INavigationReducerState} from "./navigation.reducer";
import StaticDataReducer, {IStaticDataReducerState} from "./static-data.reducer";
import ClientReducer, {IClientReducerState} from "./client.reducer";
import ServiceReducer, {IServiceReducerState} from "./service.reducer";

import UserReducer, {IUserReducerState} from "./user.reducer";
import ChartNotesReducer, {IChartNotesReducerState} from "./chart-notes.reducer";
import {IInventoryReducerState, InventoryReducer} from "./inventory.reducer";
import SettingsReducer, {ISettingsReducerState} from "./settings.reducer";


export interface IRootReducerState {
    account: IAccountReducerState,
    navigation: INavigationReducerState,
    staticData: IStaticDataReducerState,
    client: IClientReducerState,
    service: IServiceReducerState,
    user: IUserReducerState,
    chartNotes: IChartNotesReducerState,
    inventory: IInventoryReducerState,
    settings: ISettingsReducerState
}

const rootReducer = combineReducers({
    account: AccountReducer,
    navigation: NavigationReducer,
    staticData: StaticDataReducer,
    client: ClientReducer,
    service: ServiceReducer,
    user: UserReducer,
    chartNotes: ChartNotesReducer,
    inventory: InventoryReducer,
    settings: SettingsReducer
});

export default rootReducer;
