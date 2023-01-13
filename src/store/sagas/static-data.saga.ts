import {call, put, takeEvery} from "redux-saga/effects";

import {
    GET_BODY_PART_LIST, GET_CASE_STATUS_LIST,
    GET_COMMUNICATION_MODE_TYPE_LIST,
    GET_CONSULTATION_DURATION_LIST,
    GET_EMPLOYMENT_STATUS_LIST,
    GET_GENDER_LIST, GET_INJURY_TYPE_LIST,
    GET_LANGUAGE_LIST,
    GET_MEDICAL_HISTORY_OPTIONS_LIST,
    GET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST,
    GET_PHONE_TYPE_LIST, GET_PROGRESS_REPORT_STATS_LIST,
    GET_REFERRAL_TYPE_LIST,
    GET_RELATIONSHIP_LIST,
    GET_SOCIAL_MEDIA_PLATFORM_LIST,
    GET_SURGICAL_HISTORY_OPTIONS_LIST, setBodyPartsList, setCaseStatusList, setCommunicationModeTypeList,
    setConsultationDurationList,
    setEmploymentStatusList,
    setGenderList, setInjuryTypeList,
    setLanguageList,
    setMedicalHistoryOptionsList,
    setMusculoskeletalHistoryOptionsList,
    setPhoneTypeList, setProgressReportStatsList, setReferralTypeList,
    setRelationShipList, setSocialMediaPlatformList,
    setSurgicalHistoryOptionsList
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

function* getSurgicalHistoryOptionsList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getSurgicalHistoryOptionsList);
        yield put(setSurgicalHistoryOptionsList(resp?.data));
    } catch (error: any) {
        yield put(setSurgicalHistoryOptionsList([]));
    }
}

function* getMusculoskeletalHistoryOptionsList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getMusculoskeletalHistoryOptionsList);
        yield put(setMusculoskeletalHistoryOptionsList(resp?.data));
    } catch (error: any) {
        yield put(setMusculoskeletalHistoryOptionsList([]));
    }
}

function* getSocialMediaPlatformList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getSocialMediaPlatformList);
        yield put(setSocialMediaPlatformList(resp?.data));
    } catch (error: any) {
        yield put(setSocialMediaPlatformList([]));
    }
}

function* getReferralTypeList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getReferralTypeList);
        yield put(setReferralTypeList(resp?.data));
    } catch (error: any) {
        yield put(setReferralTypeList([]));
    }
}

function* getCommunicationModeTypeList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getCommunicationModeTypeList);
        yield put(setCommunicationModeTypeList(resp?.data));
    } catch (error: any) {
        yield put(setCommunicationModeTypeList([]));
    }
}

function* getBodyPartList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getBodyPartList);
        yield put(setBodyPartsList(resp?.data));
    } catch (error: any) {
        yield put(setBodyPartsList([]));
    }
}

function* getInjuryTypeList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getInjuryTypeList);
        yield put(setInjuryTypeList(resp?.data));
    } catch (error: any) {
        yield put(setInjuryTypeList([]));
    }
}

function* getCaseStatusList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getCaseStatusList);
        yield put(setCaseStatusList(resp?.data));
    } catch (error: any) {
        yield put(setCaseStatusList([]));
    }
}

function* getProgressReportStatList() {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._staticData.getProgressReportStatList);
        yield put(setProgressReportStatsList(resp?.data));
    } catch (error: any) {
        yield put(setProgressReportStatsList([]));
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
    yield takeEvery(GET_SURGICAL_HISTORY_OPTIONS_LIST, getSurgicalHistoryOptionsList);
    yield takeEvery(GET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST, getMusculoskeletalHistoryOptionsList);
    yield takeEvery(GET_SOCIAL_MEDIA_PLATFORM_LIST, getSocialMediaPlatformList);
    yield takeEvery(GET_REFERRAL_TYPE_LIST, getReferralTypeList);
    yield takeEvery(GET_COMMUNICATION_MODE_TYPE_LIST, getCommunicationModeTypeList);
    yield takeEvery(GET_BODY_PART_LIST, getBodyPartList);
    yield takeEvery(GET_INJURY_TYPE_LIST, getInjuryTypeList);
    yield takeEvery(GET_CASE_STATUS_LIST, getCaseStatusList);
    yield takeEvery(GET_PROGRESS_REPORT_STATS_LIST, getProgressReportStatList);
}
