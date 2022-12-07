import {IActionModel} from "../../shared/models/action.model";

import {IUser} from "../../shared/models/user.model";
import {GET_SERVICE_PROVIDER_LIST, SET_SERVICE_PROVIDER_LIST} from "../actions/service.action";

export interface IServiceReducerState {
    isServiceProviderListLoading: boolean,
    isServiceProviderListLoaded: boolean,
    serviceProviderList: IUser[],
}

const initialData: IServiceReducerState = {
    isServiceProviderListLoading: false,
    isServiceProviderListLoaded: false,
    serviceProviderList: [],
};

const ServiceReducer = (state = initialData, action: IActionModel): IServiceReducerState => {
    switch (action.type) {
        case GET_SERVICE_PROVIDER_LIST:
            state = {
                ...state,
                isServiceProviderListLoading: true,
                isServiceProviderListLoaded: false,
            };
            return state;
        case SET_SERVICE_PROVIDER_LIST:
            state = {
                ...state,
                isServiceProviderListLoading: false,
                isServiceProviderListLoaded: true,
                serviceProviderList: action.payload.serviceProviderList
            };
            return state;
        default:
            return state;
    }
};

export default ServiceReducer;
