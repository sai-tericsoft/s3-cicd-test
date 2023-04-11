import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const CouponDetailsAPICall = (couponId:string,payload:any)=>{
    //@ts-ignore
    return ApiService[APIConfig.GET_COUPON_VIEW_DETAILS.METHOD](APIConfig.GET_COUPON_VIEW_DETAILS.URL(couponId), payload);

}




const DiscountService={
    CouponDetailsAPICall
}

export default DiscountService;