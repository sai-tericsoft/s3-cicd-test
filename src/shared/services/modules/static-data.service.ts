import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const EMERGENCY_PHONE_NUMBER = 911;
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const genderOptions = [{title: 'Male', code: 'male'}, {title: 'Female', code: 'female'}, {
    title: 'Other',
    code: 'other'
}];

const heightInFeet = [
    {title: '1 feet', code: '1'}, {title: '2 feet', code: '2'}, {title: '3 feet', code: '3'},
    {title: '4 feet', code: '4'}, {title: '5 feet', code: '5'}, {title: '6 feet', code: '6'},
    {title: '7 feet', code: '7'}, {title: '8 feet', code: '8'}
];

const heightInInches = [{title: '0 inch', code: '0'}, {title: '1 inch', code: '1'}, {
    title: '2 inches',
    code: '2'
}, {title: '3 inches', code: '3'},
    {title: '4 inches', code: '4'}, {title: '5 inches', code: '5'}, {title: '6 inches', code: '6'},
    {title: '7 inches', code: '7'}, {title: '8 inches', code: '8'}, {title: '9 inches', code: '9'},
    {title: '10 inches', code: '10'}, {title: '11 inches', code: '11'}];

const yesNoOptions = [{title: 'Yes', code: true}, {title: 'No', code: false}];


const getStatesList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.STATE_LIST.METHOD](APIConfig.STATE_LIST.URL, payload);
}

const getCitiesList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CITY_LIST.METHOD](APIConfig.CITY_LIST.URL, payload);
}
const getZipCodesist = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ZIPCODE_LIST.METHOD](APIConfig.ZIPCODE_LIST.URL, payload);
}

const getTimeZonesList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.TIMEZONE_LIST.METHOD](APIConfig.TIMEZONE_LIST.URL, payload);
}


const getTestPanelList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.STATIC_TEST_PANEL_LIST.METHOD](APIConfig.STATIC_TEST_PANEL_LIST.URL, payload);
}

const getTestPanelListList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.STATIC_TEST_PANEL_LIST_LITE.METHOD](APIConfig.STATIC_TEST_PANEL_LIST_LITE.URL, payload);
}

const getTestPanelBulkDetails = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.TEST_PANEL_BULK_DETAILS.METHOD](APIConfig.TEST_PANEL_BULK_DETAILS.URL, payload);
}

const getPayorMixList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.PAYOR_MIX_STATIC_LIST.METHOD](APIConfig.PAYOR_MIX_STATIC_LIST.URL, payload);
}
const getFacilityAccountPreferencesSettingsStaticData = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.FACILITY_ACCOUNT_PREFERENCES_STATIC_DATA.METHOD](APIConfig.FACILITY_ACCOUNT_PREFERENCES_STATIC_DATA.URL, payload);
}

const getEthnicityList = (payload: any) => {
// @ts-ignore
    return ApiService[APIConfig.ETHNICITY_LIST.METHOD](APIConfig.ETHNICITY_LIST.URL, payload);
}

const getRaceList = (payload: any) => {
// @ts-ignore
    return ApiService[APIConfig.RACE_LIST.METHOD](APIConfig.RACE_LIST.URL, payload);
}

const getInsuranceCompanyList = (payload: any) => {
// @ts-ignore
    return ApiService[APIConfig.GET_INSURANCE_COMPANY_LIST.METHOD](APIConfig.GET_INSURANCE_COMPANY_LIST.URL, payload);
}

const getInsurancePlanList = (payload: any) => {
// @ts-ignore
    return ApiService[APIConfig.GET_INSURANCE_PLAN_LIST.METHOD](APIConfig.GET_INSURANCE_PLAN_LIST.URL, payload);
}

const getRelationshipList = (payload: any) => {
// @ts-ignore
    return ApiService[APIConfig.GET_RELATIONSHIP_LIST.METHOD](APIConfig.GET_RELATIONSHIP_LIST.URL, payload);
}

const getTestPanelResultingModeList = (payload: any) => {
// @ts-ignore
    return ApiService[APIConfig.TEST_PANEL_RESULTING_MODE_LIST.METHOD](APIConfig.TEST_PANEL_RESULTING_MODE_LIST.URL, payload);
}

const getTestPanelDepartmentList = (payload: any) => {
// @ts-ignore
    return ApiService[APIConfig.TEST_PANEL_DEPARTMENT_LIST.METHOD](APIConfig.TEST_PANEL_DEPARTMENT_LIST.URL, payload);
}

const getTestPanelAnalyzerList = (payload: any) => {
// @ts-ignore
    return ApiService[APIConfig.TEST_PANEL_ANALYSER_LIST.METHOD](APIConfig.TEST_PANEL_ANALYSER_LIST.URL, payload);
}

const getTestPanelIntakeForm = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_TEST_PANEL_INTAKE_FORM.METHOD](APIConfig.GET_TEST_PANEL_INTAKE_FORM.URL(payload.testPanelCode), payload)
}
const getBillingModes = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.BILLING_MODES_LIST.METHOD](APIConfig.BILLING_MODES_LIST.URL, payload)
}

const StaticDataService = {
    weekDays,
    EMERGENCY_PHONE_NUMBER,
    getStatesList,
    getCitiesList,
    getZipCodesist,
    getTimeZonesList,
    getTestPanelList,
    getTestPanelListList,
    getPayorMixList,
    getFacilityAccountPreferencesSettingsStaticData,
    getTestPanelBulkDetails,
    getEthnicityList,
    getRaceList,
    getInsuranceCompanyList,
    getInsurancePlanList,
    getRelationshipList,
    genderOptions,
    yesNoOptions,
    heightInFeet,
    heightInInches,
    getTestPanelResultingModeList,
    getTestPanelAnalyzerList,
    getTestPanelDepartmentList,
    getTestPanelIntakeForm,
    getBillingModes
}

export default StaticDataService;
