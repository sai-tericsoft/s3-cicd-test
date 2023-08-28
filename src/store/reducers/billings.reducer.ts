import {IActionModel} from "../../shared/models/action.model";
import {
    GET_BILLING_FROM_ADDRESS,
    GET_BILLING_SETTINGS,
    SET_BILLING_FROM_ADDRESS,
    SET_BILLING_SETTINGS
} from "../actions/billings.action";

export interface IBillingsReducerState {
    isBillingFromAddressLoading: boolean,
    isBillingFromAddressLoaded: boolean,
    isBillingFromAddressLoadingFailed: boolean,
    billingFromAddress?: any,
    isBillingSettingsLoading: boolean,
    isBillingSettingsLoaded: boolean,
    isBillingSettingsLoadingFailed: boolean,
    billingSettings?: any,
}

const initialData: IBillingsReducerState = {
    isBillingFromAddressLoading: false,
    isBillingFromAddressLoaded: false,
    isBillingFromAddressLoadingFailed: false,
    billingFromAddress: undefined,
    isBillingSettingsLoading: false,
    isBillingSettingsLoaded: false,
    isBillingSettingsLoadingFailed: false,
    billingSettings: undefined,

}

export const BillingReducer = (state = initialData, action: IActionModel): any => {
    switch (action.type) {
        case GET_BILLING_FROM_ADDRESS:
            state = {
                ...state,
                isBillingFromAddressLoading: true,
                isBillingFromAddressLoaded: false,
                isBillingFromAddressLoadingFailed: false,
            };
            return state;
        case SET_BILLING_FROM_ADDRESS:
            state = {
                ...state,
                isBillingFromAddressLoading: false,
                isBillingFromAddressLoaded: !!action.payload.billingFromAddress,
                isBillingFromAddressLoadingFailed: !action.payload.billingFromAddress,
                billingFromAddress: action.payload.billingFromAddress
            }
            return state;
        case GET_BILLING_SETTINGS:
            state = {
                ...state,
                isBillingSettingsLoading: true,
                isBillingSettingsLoaded: false,
                isBillingSettingsLoadingFailed: false,
            };
            return state;
        case SET_BILLING_SETTINGS:
            state = {
                ...state,
                isBillingSettingsLoading: false,
                isBillingSettingsLoaded: !!action.payload.billingSettings,
                isBillingSettingsLoadingFailed: !action.payload.billingSettings,
                billingSettings: action.payload.billingSettings
            }
            return state;

        default:
            return state
    }
}
