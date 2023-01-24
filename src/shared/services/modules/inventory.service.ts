import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const InventoryProductViewDetailsAPICall = (productId:string,payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_INVENTORY_PRODUCT_VIEW_DETAILS.METHOD](APIConfig.GET_INVENTORY_PRODUCT_VIEW_DETAILS.URL(productId), payload);

}

const InventoryProductEditDetailsAPICall = (productId:string,payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.EDIT_INVENTORY_PRODUCT.METHOD](APIConfig.EDIT_INVENTORY_PRODUCT.URL(productId), payload,{'Content-Type': 'multipart/form-data'});

}


const InventoryService = {
    InventoryProductViewDetailsAPICall,
    InventoryProductEditDetailsAPICall
}
export default InventoryService;