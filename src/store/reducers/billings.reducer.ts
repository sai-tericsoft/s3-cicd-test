import {IActionModel} from "../../shared/models/action.model";
import {GET_BILLING_FROM_ADDRESS, SET_BILLING_FROM_ADDRESS} from "../actions/billings.action";

export interface IBillingsReducerState {
    isBillingFromAddressLoading: boolean,
    isBillingFromAddressLoaded: boolean,
    isBillingFromAddressLoadingFailed: boolean,
    billingFromAddress?: any,
}

const initialData: IBillingsReducerState = {
    isBillingFromAddressLoading: false,
    isBillingFromAddressLoaded: false,
    isBillingFromAddressLoadingFailed: false,
    billingFromAddress: undefined,

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

        default:
            return state
    }
}
