import {GET_COUPON_DETAILS, SET_COUPON_DETAILS} from "../actions/discount.action";


export interface IDiscountReducerState {
    isCouponDetailsLoading: boolean,
    isCouponDetailsLoaded: boolean,
    isCouponDetailsLoadingFailed: boolean,
    couponDetails: any
};

const initialData: IDiscountReducerState = {
    isCouponDetailsLoading: false,
    isCouponDetailsLoaded: false,
    isCouponDetailsLoadingFailed: false,
    couponDetails: undefined
};

const discountReducer = (state: IDiscountReducerState = initialData, action: any) => {
    switch (action.type) {
        case GET_COUPON_DETAILS :
            state = {
                ...state,
                isCouponDetailsLoading: true,
                isCouponDetailsLoaded: false,
                isCouponDetailsLoadingFailed: false
            }
            return state;

        case SET_COUPON_DETAILS :
            state = {
                ...state,
                isCouponDetailsLoading:false,
                isCouponDetailsLoaded:!!action.payload.couponDetails,
                isCouponDetailsLoadingFailed:!action.payload.couponDetails,
                couponDetails:action.payload.couponDetails
            }
            return state;

        default :
            return state;
    }
}

export default discountReducer