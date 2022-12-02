import {call, put, takeEvery} from "redux-saga/effects";

import {
    GET_CONSULTATION_DURATION_LIST,
    GET_EMPLOYMENT_STATUS_LIST,
    GET_GENDER_LIST,
    GET_LANGUAGE_LIST, GET_MEDICAL_HISTORY_OPTIONS_LIST,
    GET_PHONE_TYPE_LIST, GET_RELATIONSHIP_LIST,
    setConsultationDurationList,
    setEmploymentStatusList,
    setGenderList,
    setLanguageList, setMedicalHistoryOptionsList,
    setPhoneTypeList, setRelationShipList
} from "../actions/static-data.action";
import {CommonService} from "../../shared/services";

function* getConsultationDurationList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getConsultationDurationList);
        yield put(setConsultationDurationList(resp?.data));
    } catch (error: any) {
        yield put(setConsultationDurationList([]));
    }
}

function* getGenderList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getGenderList);
        yield put(setGenderList(resp?.data));
    } catch (error: any) {
        yield put(setGenderList([]));
    }
}

function* getPhoneTypeList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getPhoneTypeList);
        yield put(setPhoneTypeList(resp?.data));
    } catch (error: any) {
        yield put(setPhoneTypeList([]));
    }
}

function* getEmploymentStatusList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getEmployeeStatusList);
        yield put(setEmploymentStatusList(resp?.data));
    } catch (error: any) {
        yield put(setEmploymentStatusList([]));
    }
}

function* getLanguageList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getLanguageList);
        yield put(setLanguageList(resp?.data));
    } catch (error: any) {
        yield put(setLanguageList([]));
    }
}

function* getRelationshipList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getRelationshipStatusList);
        yield put(setRelationShipList(resp?.data));
    } catch (error: any) {
        yield put(setRelationShipList([]));
    }
}

function* getMedicalHistoryOptionsList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getMedicalHistoryOptionsList);
        yield put(setMedicalHistoryOptionsList(resp?.data));
    } catch (error: any) {
        yield put(setMedicalHistoryOptionsList([]));
    }
}

export default function* staticDataSaga() {
    yield takeEvery(GET_CONSULTATION_DURATION_LIST, getConsultationDurationList);
    yield takeEvery(GET_GENDER_LIST, getGenderList);
    yield takeEvery(GET_PHONE_TYPE_LIST, getPhoneTypeList);
    yield takeEvery(GET_LANGUAGE_LIST, getLanguageList);
    yield takeEvery(GET_EMPLOYMENT_STATUS_LIST, getEmploymentStatusList);
    yield takeEvery(GET_RELATIONSHIP_LIST, getRelationshipList);
    yield takeEvery(GET_MEDICAL_HISTORY_OPTIONS_LIST, getMedicalHistoryOptionsList);
}
