import {call, put, takeEvery} from "redux-saga/effects";

import {CommonService} from "../../shared/services";
import {
    GET_INTERVENTION_ATTACHMENT_LIST,
    GET_MEDICAL_INTERVENTION_DETAILS,
    setInterventionAttachmentList,
    GET_CLIENT_MEDICAL_INTERVENTION_DETAILS,
    setClientMedicalInterventionDetails,
    setMedicalInterventionDetails, GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS, setMedicalRecordProgressReportDetails
} from "../actions/chart-notes.action";
import {setProgressReportStatsList} from "../actions/static-data.action";

function* getMedicalInterventionDetails(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._chartNotes.FetchMedicalInterventionBasicDetailsAPICall, action.payload.medicalInterventionId);
        yield put(setMedicalInterventionDetails(resp.data));
    } catch (error) {
        yield put(setMedicalInterventionDetails(undefined));
    }
};

function* getClientMedicalInterventionDetails(action:any){
    try {
        // @ts-ignore
        const resp = yield call(CommonService._chartNotes.FetchClientMedicalInterventionEAPICall, action.payload.medicalInterventionId);
        yield put(setClientMedicalInterventionDetails(resp.data));
    } catch (error) {
        yield put(setClientMedicalInterventionDetails(undefined));
    }
}


function* getInterventionAttachmentList(action: any) {
    try {
        //@ts-ignore
        const resp = yield call(CommonService._chartNotes.ExerciseLogAttachmentListAPICall, action.payload.interventionId);
        yield put(setInterventionAttachmentList(resp.data));
    } catch (error) {
        yield put(setInterventionAttachmentList(undefined))
    }
}

function* getMedicalRecordProgressReportDetails(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._chartNotes.MedicalRecordProgressReportDetailsAPICall, action.payload.progressReportId);
        yield put(setMedicalRecordProgressReportDetails(resp?.data));
    } catch (error: any) {
        yield put(setMedicalRecordProgressReportDetails([]));
    }
}

export default function* chartNotesSaga() {
    yield takeEvery(GET_MEDICAL_INTERVENTION_DETAILS, getMedicalInterventionDetails);
    yield takeEvery(GET_CLIENT_MEDICAL_INTERVENTION_DETAILS, getClientMedicalInterventionDetails);
    yield takeEvery(GET_INTERVENTION_ATTACHMENT_LIST, getInterventionAttachmentList);
    yield takeEvery(GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS, getMedicalRecordProgressReportDetails);
}
