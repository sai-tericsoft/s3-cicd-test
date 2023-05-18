import {IActionModel} from "../../shared/models/action.model";
import {GET_INVENTORY_PRODUCT_DETAILS,
    SET_INVENTORY_PRODUCT_DETAILS,
    GET_INVENTORY_PRODUCT_LIST,
    SET_INVENTORY_PRODUCT_LIST
} from "../actions/inventory.action";

export interface IInventoryReducerState {
    isInventoryProductDetailsLoading: boolean,
    isInventoryProductLoaded: boolean,
    isInventoryProductLoadingFailed: boolean,
    inventoryProductDetails?: any,
    isInventoryProductListLoading: boolean,
    isInventoryProductListLoaded: boolean,
    isInventoryProductListLoadingFailed: boolean,
    inventoryProductList?: any

}
const initialData: IInventoryReducerState = {
    isInventoryProductDetailsLoading: false,
    isInventoryProductLoaded: false,
    isInventoryProductLoadingFailed: false,
    inventoryProductDetails: undefined,
    isInventoryProductListLoading: false,
    isInventoryProductListLoaded: false,
    isInventoryProductListLoadingFailed: false,
    inventoryProductList: undefined
};

export const InventoryReducer = (state = initialData, action: IActionModel): any => {
     switch (action.type) {
        case GET_INVENTORY_PRODUCT_DETAILS:
            return {
                ...state,
                isInventoryProductDetailsLoading: true,
                isInventoryProductLoaded: false,
                isInventoryProductLoadingFailed: false,
                inventoryProductDetails: undefined,
            };
        case SET_INVENTORY_PRODUCT_DETAILS:
            return {
                ...state,
                isInventoryProductDetailsLoading: false,
                isInventoryProductLoaded: true,
                isInventoryProductLoadingFailed: false,
                inventoryProductDetails: action.payload.inventoryProductDetails,
            };
         case GET_INVENTORY_PRODUCT_LIST:
                return {
                    ...state,
                    isInventoryProductListLoading: true,
                    isInventoryProductListLoaded: false,
                    isInventoryProductListLoadingFailed: false,
                    inventoryProductList: undefined,
                };
           case SET_INVENTORY_PRODUCT_LIST:
                return {
                    ...state,
                    isInventoryProductListLoading: false,
                    isInventoryProductListLoaded: true,
                    isInventoryProductListLoadingFailed: false,
                    inventoryProductList: action.payload.inventoryProductList,
                }

        default:
            return state;
    }
}
