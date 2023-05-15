export const GET_COUPON_DETAILS = 'GET_COUPON_DETAILS';
export const SET_COUPON_DETAILS = 'SET_COUPON_DETAILS';

export const getCouponDetails =(couponId:string)=>{
    return {
        type: GET_COUPON_DETAILS , payload:{
            couponId
        }
    };
};

export const setCouponDetails = (couponDetails:any)=>{
    return {
        type : SET_COUPON_DETAILS, payload:{
            couponDetails
        }
    }
}