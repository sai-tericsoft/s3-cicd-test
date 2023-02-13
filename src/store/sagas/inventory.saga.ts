import {call, put, takeEvery} from "redux-saga/effects";
import {CommonService} from "../../shared/services";

import {
    GET_INVENTORY_PRODUCT_DETAILS, GET_INVENTORY_PRODUCT_LIST,
    setInventoryProductDetails,
    setInventoryProductList
} from "../actions/inventory.action";


function* getInventoryProductDetails(action: any) {
    console.log('action.payload.productId',action.payload.productId);
    try {
        // @ts-ignore
        const resp = yield call(CommonService._inventory.InventoryProductViewDetailsAPICall, action.payload.productId);
        yield put(setInventoryProductDetails(resp.data));
    } catch (error) {
        yield put(setInventoryProductDetails(undefined));
    }
}

function* getInventoryProductList(action: any) {
    console.log('action.payload.payload',action);
    try {
        // @ts-ignore
        const resp = yield call(CommonService._inventory.InventoryProductListAPICall);
        yield put(setInventoryProductList(resp.data));
    } catch (error) {
        yield put(setInventoryProductList(undefined));
    }
}

export default function* inventorySaga() {
    yield takeEvery(GET_INVENTORY_PRODUCT_DETAILS, getInventoryProductDetails);
    yield takeEvery(GET_INVENTORY_PRODUCT_LIST, getInventoryProductList);
}