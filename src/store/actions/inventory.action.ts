
export const GET_INVENTORY_PRODUCT_DETAILS = 'GET_INVENTORY_PRODUCT_DETAILS';
export const SET_INVENTORY_PRODUCT_DETAILS = 'SET_INVENTORY_PRODUCT_DETAILS';

export const getInventoryProductDetails = (productId: string) => {
    console.log('productId',productId);
    return {
        type: GET_INVENTORY_PRODUCT_DETAILS, payload: {
            productId
        }
    };
};

export const setInventoryProductDetails = (inventoryProductDetails:any) => {
    console.log('inventoryProductDetails',inventoryProductDetails);
    return {
        type: SET_INVENTORY_PRODUCT_DETAILS, payload: {
            inventoryProductDetails
        }
    };
};