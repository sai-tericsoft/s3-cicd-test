export const GET_BILLING_FROM_ADDRESS = 'GET_BILLING_FROM_ADDRESS';
export const SET_BILLING_FROM_ADDRESS = 'SET_BILLING_FROM_ADDRESS';

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

