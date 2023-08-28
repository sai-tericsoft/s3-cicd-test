export const GET_BILLING_FROM_ADDRESS = 'GET_BILLING_FROM_ADDRESS';
export const GET_BILLING_SETTINGS = 'GET_BILLING_SETTINGS';
export const SET_BILLING_FROM_ADDRESS = 'SET_BILLING_FROM_ADDRESS';
 export const SET_BILLING_SETTINGS = 'SET_BILLING_SETTINGS';
export const getBillingFromAddress = () => {
    return {
        type: GET_BILLING_FROM_ADDRESS,
    };
};

export const setBillingFromAddress = (billingFromAddress: any) => {
    return {
        type: SET_BILLING_FROM_ADDRESS,
        payload: {
            billingFromAddress
        },
    };
}

export const getBillingSettings = () => {
    return {
        type: GET_BILLING_SETTINGS,
    };
}

export const setBillingSettings = (billingSettings: any) => {
    return {
        type: SET_BILLING_SETTINGS,
        payload: {
            billingSettings
        },
    };
}

