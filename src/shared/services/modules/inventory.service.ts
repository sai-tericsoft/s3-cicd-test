import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const InventoryProductViewDetailsAPICall = (productId:string,payload: any) => {
    console.log('payload',payload);
    console.log('productIdApi',productId);
    // @ts-ignore
    return ApiService[APIConfig.GET_INVENTORY_PRODUCT_VIEW_DETAILS.METHOD](APIConfig.GET_INVENTORY_PRODUCT_VIEW_DETAILS.URL(productId), payload);

}

const InventoryService = {
    InventoryProductViewDetailsAPICall
}
export default InventoryService;