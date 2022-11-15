import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const getAccountExecutiveList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_LIST.METHOD](APIConfig.USER_LIST.URL, payload);
}

const registerPatient = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.Register.METHOD](APIConfig.Register.URL, payload);
}

const savePatientIntakeForm = (panelCode: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_TEST_PANEL_INTAKE_FORM.METHOD](APIConfig.SAVE_TEST_PANEL_INTAKE_FORM.URL(panelCode), payload);
}

const getTestResults = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_TEST_RESULT.METHOD](APIConfig.GET_TEST_RESULT.URL, payload);
}

const downloadCsv =(payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.FACILITY_CSV_DOWNLOAD.METHOD](APIConfig.FACILITY_CSV_DOWNLOAD.URL, payload);
}

const UserService = {
    getAccountExecutiveList,
    registerPatient,
    savePatientIntakeForm,
    getTestResults,
    downloadCsv
}

export default UserService;
