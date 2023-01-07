import {call, put, takeEvery} from "redux-saga/effects";

import {CommonService} from "../../shared/services";
import {
    GET_INTERVENTION_ATTACHMENT_LIST,
    GET_MEDICAL_INTERVENTION_DETAILS,
    setInterventionAttachmentList,
    setMedicalInterventionDetails
} from "../actions/chart-notes.action";

function* getMedicalInterventionDetails(action: any) {
    try {
        // @ts-ignore
        const resp = yield call(CommonService._chartNotes.FetchMedicalInterventionBasicDetailsAPICall, action.payload.medicalInterventionId);
        yield put(setMedicalInterventionDetails(resp.data));
    } catch (error) {
        yield put(setMedicalInterventionDetails(undefined));
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

export default function* chartNotesSaga() {
    yield takeEvery(GET_MEDICAL_INTERVENTION_DETAILS, getMedicalInterventionDetails);
    yield takeEvery(GET_INTERVENTION_ATTACHMENT_LIST, getInterventionAttachmentList);
}