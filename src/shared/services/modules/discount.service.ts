import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const CouponDetailsAPICall = (couponId:string,payload:any)=>{
    //@ts-ignore
    return ApiService[APIConfig.GET_COUPON_VIEW_DETAILS.METHOD](APIConfig.GET_COUPON_VIEW_DETAILS.URL(couponId), payload);
}

const CouponAddAPICall = (payload:any)=>{
    //@ts-ignore
    return ApiService[APIConfig.ADD_COUPON.METHOD](APIConfig.ADD_COUPON.URL, payload);
}

const CouponEditAPICall = (couponId:string,payload:any)=>{
    //@ts-ignore
    return ApiService[APIConfig.EDIT_COUPON.METHOD](APIConfig.EDIT_COUPON.URL(couponId), payload);
}




const DiscountService={
    CouponDetailsAPICall,
    CouponAddAPICall,
    CouponEditAPICall
}

export default DiscountService;