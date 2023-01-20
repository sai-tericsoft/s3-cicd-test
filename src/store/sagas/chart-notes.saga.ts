import {call, put, takeEvery} from "redux-saga/effects";

import {CommonService} from "../../shared/services";
import {
    GET_CLIENT_MEDICAL_INTERVENTION_DETAILS,
    GET_INTERVENTION_ATTACHMENT_LIST,
    GET_MEDICAL_INTERVENTION_DETAILS,
    GET_MEDICAL_INTERVENTION_LIST,
    GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS,
    GET_MEDICAL_RECORD_SOAP_NOTE_LIST,
    GET_MEDICAL_RECORD_STATS,
    GET_PROGRESS_REPORT_VIEW_DETAILS,
    setClientMedicalInterventionDetails,
    setInterventionAttachmentList,
    setMedicalInterventionDetails,
    setMedicalInterventionList,
    setMedicalRecordProgressReportDetails,
    setMedicalRecordSoapNoteList,
    setMedicalRecordStats,
    setProgressReportViewDetails,
} from "../actions/chart-notes.action";

function* getMedicalInterventionDetails(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._chartNotes.FetchMedicalInterventionBasicDetailsAPICall, action.payload.medicalInterventionId);
        yield put(setMedicalInterventionDetails(resp.data));
    } catch (error) {
        yield put(setMedicalInterventionDetails(undefined));
    }
};

function* getClientMedicalInterventionDetails(action: any) {
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

function* getProgressReportViewDetail(action: any) {
    try {
        //@ts-ignore
        const resp = yield call(CommonService._chartNotes.ProgressReportViewDetailsAPICall, action.payload.interventionId);
        console.log(resp.data);
        yield put(setProgressReportViewDetails(resp.data));
    } catch (error) {
        yield put(setProgressReportViewDetails(undefined))
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

function* getMedicalInterventionList(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._chartNotes.MedicalInterventionListAPICall, action.payload.medicalRecordId);
        yield put(setMedicalInterventionList(resp?.data));
    } catch (error: any) {
        yield put(setMedicalInterventionList([]));
    }
}

function* getMedicalRecordStats(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._chartNotes.MedicalRecordStatsAPICall, action.payload.medicalRecordId);
        yield put(setMedicalRecordStats(resp?.data || []));
    } catch (error: any) {
        yield put(setMedicalRecordStats([]));
    }
}

function* getMedicalRecordSoapNotesList(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._chartNotes.MedicalRecordSoapNoteListAPICall, action.payload.medicalRecordId, {current_intervention_id: action.payload.medicalInterventionId});
        yield put(setMedicalRecordSoapNoteList(resp?.data || []));
    } catch (error: any) {
        yield put(setMedicalRecordSoapNoteList([]));
    }
}

export default function* chartNotesSaga() {
    yield takeEvery(GET_MEDICAL_INTERVENTION_DETAILS, getMedicalInterventionDetails);
    yield takeEvery(GET_CLIENT_MEDICAL_INTERVENTION_DETAILS, getClientMedicalInterventionDetails);
    yield takeEvery(GET_INTERVENTION_ATTACHMENT_LIST, getInterventionAttachmentList);
    yield takeEvery(GET_PROGRESS_REPORT_VIEW_DETAILS, getProgressReportViewDetail);
    yield takeEvery(GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS, getMedicalRecordProgressReportDetails);
    yield takeEvery(GET_MEDICAL_INTERVENTION_LIST, getMedicalInterventionList);
    yield takeEvery(GET_MEDICAL_RECORD_STATS, getMedicalRecordStats);
    yield takeEvery(GET_MEDICAL_RECORD_SOAP_NOTE_LIST, getMedicalRecordSoapNotesList);
}
