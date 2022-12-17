import {IActionModel} from "../../shared/models/action.model";
import {IUser} from "../../shared/models/user.model";
import {GET_ALL_PROVIDERS_LIST, SET_ALL_PROVIDERS_LIST} from "../actions/user.action";

export interface IUserReducerState {
    allProvidersList: IUser[],
    isAllProvidersListLoading: boolean,
    isAllProvidersListLoaded: boolean
}


const initialData: IUserReducerState = {
    allProvidersList: [],
    isAllProvidersListLoading: false,
    isAllProvidersListLoaded: false
};

const UserReducer = (state = initialData, action: IActionModel): IUserReducerState => {
    switch (action.type) {
        case GET_ALL_PROVIDERS_LIST:
            state = {
                ...state,
                isAllProvidersListLoading: true,
                isAllProvidersListLoaded: false,
            };
            return state;
        case SET_ALL_PROVIDERS_LIST:
            state = {
                ...state,
                isAllProvidersListLoading: false,
                isAllProvidersListLoaded: true,
                allProvidersList: action.payload.allProvidersList
            };
            return state;
        default:
            return state;
    }
};

export default UserReducer;
