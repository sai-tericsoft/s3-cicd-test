import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const AddInventoryProductAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_INVENTORY_PRODUCT.METHOD](APIConfig.ADD_INVENTORY_PRODUCT.URL, payload);
}

const InventoryService = {
    AddInventoryProductAPICall,
}
export default InventoryService;