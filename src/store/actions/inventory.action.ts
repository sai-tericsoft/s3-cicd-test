
export const GET_INVENTORY_PRODUCT_DETAILS = 'GET_INVENTORY_PRODUCT_DETAILS';
export const SET_INVENTORY_PRODUCT_DETAILS = 'SET_INVENTORY_PRODUCT_DETAILS';
export const GET_INVENTORY_PRODUCT_LIST = 'GET_INVENTORY_PRODUCT_LIST';
export const SET_INVENTORY_PRODUCT_LIST = 'SET_INVENTORY_PRODUCT_LIST';

export const getInventoryProductDetails = (productId: string) => {
    console.log('productId',productId);
    return {
        type: GET_INVENTORY_PRODUCT_DETAILS, payload: {
            productId
        }
    };
};

export const setInventoryProductDetails = (inventoryProductDetails:any) => {
    return {
        type: SET_INVENTORY_PRODUCT_DETAILS, payload: {
            inventoryProductDetails
        }
    };
};

export const getInventoryProductList = () => {
    return {
        type: GET_INVENTORY_PRODUCT_LIST
    }
}

export const setInventoryProductList = (inventoryProductList: any) => {
    return {
        type: SET_INVENTORY_PRODUCT_LIST, payload: {
            inventoryProductList
        }
    }
}