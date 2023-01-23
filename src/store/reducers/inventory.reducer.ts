import {IActionModel} from "../../shared/models/action.model";
import {GET_INVENTORY_PRODUCT_DETAILS, SET_INVENTORY_PRODUCT_DETAILS} from "../actions/inventory.action";

export interface IInventoryReducerState {
    isInventoryProductDetailsLoading: boolean,
    isInventoryProductLoaded: boolean,
    isInventoryProductLoadingFailed: boolean,
    inventoryProductDetails?: any,

}
const initialData: IInventoryReducerState = {
    isInventoryProductDetailsLoading: false,
    isInventoryProductLoaded: false,
    isInventoryProductLoadingFailed: false,
    inventoryProductDetails: undefined,
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

        default:
            return state;
    }
}
