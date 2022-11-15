import ENV from "./ENV";

const APIConfig = {
    // authentication start
    LOGIN: {
        URL: ENV.API_URL + "/login",
        METHOD: "post"
    },
    CHECK_LOGIN: {
        URL: ENV.API_URL + "/checkLogin",
        METHOD: "get"
    },
    LOGOUT: {
        URL: ENV.API_URL + "/logout",
        METHOD: "get"
    },
    // authentication end

    // static apis start
    ZIPCODE_LIST: {
        URL: ENV.API_URL + "/staticData/zipcode",
        METHOD: "get"
    },
    ROLE_LIST: {
        URL: ENV.API_URL + "/getRoles",
        METHOD: "get"
    },
    STATE_LIST: {
        URL: ENV.API_URL + "/staticData/states",
        METHOD: "get"
    },
    CITY_LIST: {
        URL: ENV.API_URL + "/staticData/cities",
        METHOD: "get"
    },
    TIMEZONE_LIST: {
        URL: ENV.API_URL + "/infrastructure/staticData/getTimezones",
        METHOD: "get"
    },
    STATIC_TEST_PANEL_LIST: {
        URL: ENV.API_URL + "/infrastructure/staticData/getPanelList",
        METHOD: "post"
    },
    STATIC_TEST_PANEL_LIST_LITE: {
        URL: ENV.API_URL + "/panel/listLite",
        METHOD: "get"
    },
    PAYOR_MIX_STATIC_LIST: {
        URL: ENV.API_URL + "/infrastructure/staticData/payorMix",
        METHOD: "get"
    },
    ETHNICITY_LIST: {
        URL: ENV.API_URL + "/staticData/ethnicity",
        METHOD: "get"
    },
    RACE_LIST: {
        URL: ENV.API_URL + "/staticData/race",
        METHOD: "get"
    },

    BILLING_MODES_LIST: {
        URL: ENV.API_URL + "/staticData/billingModes",
        METHOD: "get"
    },

    // static apis end

    // facility apis start
    FACILITY_LIST: {
        URL: ENV.API_URL + "/facility/list",
        METHOD: "post"
    },
    TOGGLE_FACILITY_ACTIVE_STATUS: {
        URL: (facilityId: any) => ENV.API_URL + '/facility/' + facilityId + '/toggle',
        METHOD: "put"
    },
    FACILITY_TYPE_LIST: {
        URL: ENV.API_URL + "/infrastructure/staticData/getFacilityTypes",
        METHOD: "get"
    },
    FACILITY_LIST_LITE: {
        URL: ENV.API_URL + "/facility/listLite",
        METHOD: "get"
    },
    // facility apis end

    // location apis start
    LOCATION_LIST: {
        URL: ENV.API_URL + "/location/list",
        METHOD: "post"
    },
    LOCATION_LIST_LITE: {
        URL: ENV.API_URL + "/location/listLite",
        METHOD: "get"
    },

    GET_LOCATION_PHYSICIAN_LIST: {
        URL: (location_id: any) => ENV.API_URL + '/location/' + location_id + '/getPhysiciansList',
        METHOD: "get"
    },

    GET_ICD_CODES_FAVOURITE_LIST: {
        URL: (locationId: any) => ENV.API_URL + '/location/' + locationId + "/getFavouriteIcdCodes",
        METHOD: "get"
    },

    // location apis end

    // lab apis start
    LAB_LIST: {
        URL: ENV.API_URL + "/lab/list",
        METHOD: "post"
    },
    LAB_LIST_LITE: {
        URL: ENV.API_URL + "/lab/listLite",
        METHOD: "get"
    },
    TOGGLE_LOCATION_ACTIVE_STATUS: {
        URL: (locationId: any) => ENV.API_URL + '/location/' + locationId + '/toggle',
        METHOD: "put"
    },
    // lab apis end

    // testOrder apis start

    TEST_ORDER_LIST: {
        URL: ENV.API_URL + "/order/list",
        METHOD: "post"
    },
    UPLOAD_TEST_ORDER_ATTACHMENTS: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/addAttachment',
        METHOD: "post"
    },
    UPLOAD_TEST_ORDER_PATIENT_ATTACHMENTS: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/addAttachment',
        METHOD: "post"
    },
    ADD_FAVOURITE_ICD10_CODE: {
        URL: (location_id: any, icdId: any) => ENV.API_URL + '/location/' + location_id + '/addFavouriteIcdCode/' + icdId,
        METHOD: "post"
    },
    DELETE_TEST_ORDER_ATTACHMENTS: {
        URL: (testOrder_id: any, attachmentId: any) => ENV.API_URL + '/order/' + attachmentId + '/deleteAttachment/',
        METHOD: "delete"
    },
    DELETE_TEST_ORDER_PATIENT_ATTACHMENTS: {
        URL: (testOrder_id: any, attachmentId: any) => ENV.API_URL + '/order/' + attachmentId + '/deleteAttachment/',
        METHOD: "delete"
    },
    TEST_ORDER_ATTACHMENTS_LIST: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/listAttachments',
        METHOD: "get"
    },
    ADD_SAMPLE: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/addSample',
        METHOD: "post"
    },
    EDIT_SAMPLE: {
        URL: (sample_id: any) => ENV.API_URL + '/orderSample/' + sample_id + '/edit/',
        METHOD: "put"
    },
    GENERATE_TOKEN_FOR_INTAKE_FORM: {
        URL: () => ENV.API_URL + '/order/generatePatientToken',
        METHOD: "post"
    },
    TEST_ORDER_PATIENT_ATTACHMENTS_LIST: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/listAttachments',
        METHOD: "get"
    },
    CREATE_NEW_TEST_ORDER: {
        URL: ENV.API_URL + "/order/add",
        METHOD: "post"
    },
    GET_TEST_ORDER_DETAILS: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/view',
        METHOD: "get"
    },
    GET_TEST_ORDER_LIST_SAMPLE_BILLING_MODES: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/listSampleBillingModes',
        METHOD: "get"
    },

    GET_TEST_ORDER_SAMPLE_LIST: {
        URL: ENV.API_URL + '/order/sampleListLite',
        METHOD: "get"
    },

    ADD_TEST_ORDER_SAMPLES_CASH_PAYMENT: {
        URL: (testOrder_id: any) => ENV.API_URL + '/orderSample/' + testOrder_id + '/markPaymentCompleted',
        METHOD: "put"
    },

    SUBMIT_PANEL_INSURANCE: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/linkInsuranceToSamples',
        METHOD: "put"
    },
    PLACE_ORDER: {
        URL: (testOrder_id: any) => ENV.API_URL + '/order/' + testOrder_id + '/placeOrder',
        METHOD: "put"
    },
    // testOrder apis end

    // testPanel apis start

    TEST_PANEL_LIST: {
        URL: ENV.API_URL + "/panel/list",
        METHOD: "post"
    },
    TEST_PANEL_LIST_LITE: {
        URL: ENV.API_URL + "/panel/listLite",
        METHOD: "get"
    },
    TOGGLE_TEST_PANEL_STATUS: {
        URL: (testPanelId: any) => ENV.API_URL + '/panel/' + testPanelId + "/toggle",
        METHOD: "put"
    },

    GET_ICD_CODES: {
        URL: (testPanelId: any) => ENV.API_URL + '/panel/' + testPanelId + "/getIcdCode",
        METHOD: "get"
    },
    // testPanel apis end

    // samples list api start
    SAMPLES_LIST: {
        URL: ENV.API_URL + "/order/listSample",
        METHOD: "post"
    },
    // samples list api end

    // accessioning apis start
    GET_ACCESSION_SAMPLES: {
        URL: ENV.API_URL + '/order/getAccessionedData',
        METHOD: "post"
    },
    APPROVE_REJECT_SAMPLE: {
        URL: (sampleId: any) => ENV.API_URL + '/orderSample/' + sampleId + '/respondAccession',
        METHOD: "put"
    },
    ASSIGN_NEW_BARCODE: {
        URL: (sampleId: any) => ENV.API_URL + '/orderSample/' + sampleId + '/reAssignBarcode',
        METHOD: "put"
    },
    VIEW_ATTACHMENTS: {
        URL: (sampleId: any) => ENV.API_URL + '/order/' + sampleId + '/listAttachments',
        METHOD: "get"
    },
    // accessioning apis end

    // results list apis start
    RESULT_LIST: {
        URL: ENV.API_URL + "/result/list",
        METHOD: "post"
    },

    UPLOAD_RESULT_EXCEL: {
        URL: ENV.API_URL + "/result/uploadFile",
        METHOD: "post"
    },
    SESSION_VIEW: {
        URL: (sessionId: any) => ENV.API_URL + "/result/" + sessionId + '/view',
        METHOD: "get"
    },
    SESSION_LIST: {
        URL: (sessionId: any) => ENV.API_URL + "/result/" + sessionId + '/getSessionValues',
        METHOD: "post"
    },
    GENERATE_RESULT: {
        URL: (sessionId: any) => ENV.API_URL + "/result/" + sessionId + '/generateResults',
        METHOD: "get"
    },
    // results list apis end

    //patient apis start
    PATIENT_INSURANCE_LIST: {
        URL: (patientId: any) => ENV.API_URL + '/patient/' + patientId + '/insuranceListLite',
        METHOD: "get"
    },
    VIEW_PATIENT: {
        URL: (patientId: any) => ENV.API_URL + '/patient/' + patientId + '/view',
        METHOD: "get"
    },
    UPLOAD_PATIENT_CONTACT_DETAILS: {
        URL: (patientId: any) => ENV.API_URL + '/patient/' + patientId + '/addContactDetails',
        METHOD: "put"
    },
    GET_INSURANCE_COMPANY_LIST: {
        URL: ENV.API_URL + '/patient/staticData/insuranceCompany',
        METHOD: "get"
    },
    GET_INSURANCE_PLAN_LIST: {
        URL: ENV.API_URL + '/patient/staticData/insurancePlan',
        METHOD: "get"
    },
    GET_RELATIONSHIP_LIST: {
        URL: ENV.API_URL + '/patient/staticData/relationship',
        METHOD: "get"
    },
    VERIFY_PATIENT_INSURANCE: {
        URL: (patient_id: any) => ENV.API_URL + '/patient/' + patient_id + '/insuranceVerification',
        METHOD: "get"
    },
    VERIFY_PATIENT_EXISTENCE: {
        URL: ENV.API_URL + '/patient/verify',
        METHOD: "post"
    },
    ADD_PATIENT_INFORMATION: {
        URL: ENV.API_URL + '/patient/add',
        METHOD: "post"
    },
    ADD_PATIENT_INSURANCE_DETAILS: {
        URL: (patient_id: any) => ENV.API_URL + "/patient/" + patient_id + '/addInsurance',
        METHOD: "post"
    },
    EDIT_PATIENT_INSURANCE_DETAILS: {
        URL: (patient_id: any, insurance_id: any) => ENV.API_URL + "/patient/" + patient_id + '/editPatientInsurance/' + insurance_id,
        METHOD: "put"
    },
    PATIENT_LIST: {
        URL: ENV.API_URL + "/patient/list",
        METHOD: "post"
    },
    SEND_OTP_TO_PATIENT: {
        URL: (patientID: any) => ENV.API_URL + '/patient/' + patientID + '/sendOtp',
        METHOD: "post"
    },
    VERIFY_PATIENT_OTP: {
        URL: (patientID: any) => ENV.API_URL + '/patient/' + patientID + '/verifyOtp',
        METHOD: "post"
    },

    EDIT_PATIENT: {
        URL: (patientID: any) => ENV.API_URL + '/patient/' + patientID + '/edit',
        METHOD: "put"
    },
    //patient apis end

    ADD_NEW_SEND_OUT_SESSION: {
        URL: ENV.API_URL + "/sendout/add",
        METHOD: "post"
    },
    GET_SEND_OUTS_SESSION_LIST: {
        URL: ENV.API_URL + "/sendout/list",
        METHOD: "get"
    },
    GET_SEND_OUTS_SESSION_DETAILS: {
        URL: (sendOutSessionId: any) => ENV.API_URL + '/sendout/' + sendOutSessionId + '/view',
        METHOD: "get"
    }
}

export default APIConfig;
