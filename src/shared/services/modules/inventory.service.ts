import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const AddInventoryProductAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_INVENTORY_PRODUCT.METHOD](APIConfig.ADD_INVENTORY_PRODUCT.URL, payload, {'Content-Type': 'multipart/form-data'});
}

const InventoryProductViewDetailsAPICall = (productId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_INVENTORY_PRODUCT_VIEW_DETAILS.METHOD](APIConfig.GET_INVENTORY_PRODUCT_VIEW_DETAILS.URL(productId), payload);
}

const InventoryProductEditAPICall = (productId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.EDIT_INVENTORY_PRODUCT.METHOD](APIConfig.EDIT_INVENTORY_PRODUCT.URL(productId), payload, {'Content-Type': 'multipart/form-data'});
}

const InventoryService = {
    AddInventoryProductAPICall,
    InventoryProductViewDetailsAPICall,
    InventoryProductEditAPICall
}

export default InventoryService;
