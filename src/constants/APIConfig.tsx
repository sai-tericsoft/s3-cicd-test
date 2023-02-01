import ENV from "./ENV";

interface IAPIConfig {
    [k: string]: {
        URL: string | Function | any,
        METHOD: "get" | "post" | "delete" | "put"
    }
}

const APIConfig: IAPIConfig = {
    //meta start
    CONSULTATION_DURATION_LIST: {
        URL: ENV.API_URL + "/consultation/duration",
        METHOD: "get"
    },
    GENDER_LIST: {
        URL: ENV.API_URL + "/gender",
        METHOD: "get"
    },
    LANGUAGE_LIST: {
        URL: ENV.API_URL + "/language",
        METHOD: "get"
    },
    PHONE_TYPE_LIST: {
        URL: ENV.API_URL + "/phone/type",
        METHOD: "get"
    },
    EMPLOYMENT_STATUS_LIST: {
        URL: ENV.API_URL + "/employement/status",
        METHOD: "get"
    },
    RELATIONSHIP_LIST: {
        URL: ENV.API_URL + "/relationship",
        METHOD: "get"
    },
    CPT_CODES_LIST: {
        URL: ENV.API_URL + "/cptCodes",
        METHOD: "get"
    },
    MEDICAL_HISTORY_OPTIONS_LIST: {
        URL: ENV.API_URL + "/medicalHistory/question",
        METHOD: "get"
    },
    SURGICAL_HISTORY_OPTIONS_LIST: {
        URL: ENV.API_URL + "/surgicalHistory/question",
        METHOD: "get"
    },
    MUSCULOSKELETAL_HISTORY_OPTIONS_LIST: {
        URL: ENV.API_URL + "/musculoSkeletal/question",
        METHOD: "get"
    },
    SOCIAL_MEDIA_PLATFORM_LIST: {
        URL: ENV.API_URL + "/socialMedia",
        METHOD: "get"
    },
    REFERRAL_TYPE_LIST: {
        URL: ENV.API_URL + "/referral",
        METHOD: "get"
    },
    COMMUNICATION_MODE_TYPE_LIST: {
        URL: ENV.API_URL + "/communication/type",
        METHOD: "get"
    },
    BODY_PART_LIST: {
        URL: ENV.API_URL + "/bodyParts",
        METHOD: "get"
    },
    INJURY_TYPE_LIST: {
        URL: ENV.API_URL + "/injuryTypes",
        METHOD: "get"
    },
    PROGRESS_REPORT_STATS_LIST: {
        URL: ENV.API_URL + '/progressStats',
        METHOD: 'get'
    },
    CONCUSSION_FILE_TYPES: {
        URL: ENV.API_URL + '/concussionTypes',
        METHOD: 'get'
    },
    MEDICAL_RECORD_DOCUMENT_TYPES: {
        URL: ENV.API_URL + '/documentTypes',
        METHOD: 'get'
    },

    APPOINTMENT_TYPES: {
        URL: ENV.API_URL + '/appointmentTypes',
        METHOD: 'get'
    },

    APPOINTMENT_STATUS: {
        URL: ENV.API_URL + '/appointmentStatus',
        METHOD: 'get'
    },

    PAYMENT_MODES: {
        URL: ENV.API_URL + '/paymentModes',
        METHOD: 'get'
    },
    //meta end

    // authentication start
    LOGIN: {
        URL: ENV.API_URL + "/login",
        METHOD: "post"
    },
    CHECK_LOGIN: {
        URL: ENV.API_URL + "/login",
        METHOD: "get"
    },
    LOGOUT: {
        URL: ENV.API_URL + "/login",
        METHOD: "delete"
    },
    // authentication end

    // service category start
    SERVICE_CATEGORY_LIST: {
        URL: ENV.API_URL + "/category",
        METHOD: "get"
    },
    SERVICE_CATEGORY_LIST_LITE: {
        URL: ENV.API_URL + "/category/lite",
        METHOD: "get"
    },
    SERVICE_CATEGORY_ADD: {
        URL: ENV.API_URL + "/category",
        METHOD: "post"
    },
    SERVICE_CATEGORY_DETAILS: {
        URL: (serviceCategoryId: string) => ENV.API_URL + '/category/' + serviceCategoryId,
        METHOD: "get"
    },
    SERVICE_CATEGORY_EDIT: {
        URL: (serviceCategoryId: string) => ENV.API_URL + '/category/' + serviceCategoryId,
        METHOD: "put"
    },
    // service category end

    // service start
    SERVICE_LIST: {
        URL: (serviceCategoryId: string) => ENV.API_URL + "/category/" + serviceCategoryId + "/service",
        METHOD: "get"
    },
    SERVICE_LIST_LITE: {
        URL: (serviceCategoryId: string) => ENV.API_URL + "/category/" + serviceCategoryId + "/service/lite",
        METHOD: "get"
    },
    SERVICE_DETAILS: {
        URL: (serviceId: string) => ENV.API_URL + '/service/' + serviceId,
        METHOD: "get"
    },
    SERVICE_PROVIDER_UNLINK: {
        URL: (serviceId: string, providerId: string) => ENV.API_URL + '/service/' + serviceId + "/unlink/" + providerId,
        METHOD: "delete"
    },
    SERVICE_PROVIDER_LINK: {
        URL: (serviceId: string) => ENV.API_URL + '/service/' + serviceId + "/link",
        METHOD: "post"
    },
    SERVICE_PROVIDERS_LINKED_TO_SERVICE: {
        URL: (serviceId: string) => ENV.API_URL + '/service/' + serviceId + "/providers",
        METHOD: "get"
    },
    AVAILABLE_SERVICE_PROVIDERS_TO_LINK: {
        URL: (serviceId: string) => ENV.API_URL + '/service/' + serviceId + "/availableProviders",
        METHOD: "get"
    },
    SERVICE_ADD: {
        URL: ENV.API_URL + "/service",
        METHOD: "post"
    },
    SERVICE_EDIT: {
        URL: (serviceId: string) => ENV.API_URL + '/service/' + serviceId,
        METHOD: "put"
    },
    // service end

    // facility start
    FACILITY_LIST: {
        URL: ENV.API_URL + "/facility",
        METHOD: "get"
    },
    FACILITY_DETAILS: {
        URL: (facilityId: string) => ENV.API_URL + '/facility/' + facilityId,
        METHOD: "get"
    },
    // facility end

    // client start

    CLIENT_MEDICAL_DETAILS: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medicalQuestionnaire',
        METHOD: "get"
    },

    CLIENT_LIST: {
        URL: ENV.API_URL + "/client/list",
        METHOD: "post"
    },
    CLIENT_LIST_LITE: {
        URL: ENV.API_URL + "/client/lite",
        METHOD: "get"
    },
    CLIENT_BASIC_DETAILS_ADD: {
        URL: ENV.API_URL + "/client",
        METHOD: "post"
    },
    CLIENT_BASIC_DETAILS_EDIT: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId,
        METHOD: "put"
    },
    CLIENT_BASIC_DETAILS: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId,
        METHOD: "get"
    },
    CLIENT_ACCOUNT_DETAILS: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/account',
        METHOD: "get"
    },
    CLIENT_PERSONAL_HABITS_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/personalHabits',
        METHOD: "post"
    },
    CLIENT_ALLERGIES_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/allergies',
        METHOD: "post"
    },
    CLIENT_MEDICAL_SUPPLEMENTS_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medication',
        METHOD: "post"
    },
    CLIENT_MEDICAL_HISTORY_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medicalHistory',
        METHOD: "post"
    },
    CLIENT_SURGICAL_HISTORY_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/surgicalHistory',
        METHOD: "post"
    },
    CLIENT_MEDICAL_FEMALE_ONLY_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/femaleQuestion',
        METHOD: "post"
    },
    CLIENT_MEDICAL_PROVIDER_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medicalProvider',
        METHOD: "post"
    },
    CLIENT_MUSCULOSKELETAL_HISTORY_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/musculoskeletalHistory',
        METHOD: "post"
    },
    CLIENT_ACCOUNT_PREFERENCES_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/account',
        METHOD: "post"
    },
    CLIENT_ACCOUNT_PREFERENCES_EDIT: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/account',
        METHOD: "put"
    },
    CLIENT_ACTIVITY_LOG: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/activityLog',
        METHOD: 'get'
    },
    ICD_CODE_LIST: {
        URL: ENV.API_URL + "/icdCodes",
        METHOD: 'get'
    },
    ICD_CODE_FAVOURITE_LIST: {
        URL: ENV.API_URL + "/favouriteICD",
        METHOD: 'get'
    },
    ICD_CODE_FAVOURITE_ADD: {
        URL: (codeId: string) => ENV.API_URL + '/favouriteICD/' + codeId,
        METHOD: 'post'
    },
    ICD_CODE_FAVOURITE_REMOVE: {
        URL: (codeId: string) => ENV.API_URL + '/favouriteICD/' + codeId,
        METHOD: 'delete'
    },

    // client end
    CLIENT_EIGHT_MINUTES_RULE_CHART: {
        URL: ENV.API_URL + '/ruleChart',
        METHOD: 'get'
    },

    // user start
    USER_LIST: {
        URL: ENV.API_URL + "/user",
        METHOD: "get"
    },
    USER_LIST_LITE: {
        URL: ENV.API_URL + "/user/lite",
        METHOD: "get"
    },
    USER_AVAILABLE_DATES_LIST: {
        URL: (userId: string) => ENV.API_URL + "/user/" + userId + "/availableDates",
        METHOD: "get"
    },
    USER_AVAILABLE_TIMES_LIST: {
        URL: (userId: string, date: string) => ENV.API_URL + "/user/" + userId + "/availableTimings?available_on=" + date,
        METHOD: "get"
    },
    // user end

    // user start
    APPOINTMENT_LIST: {
        URL: ENV.API_URL + '/appointment',
        METHOD: "get"
    },
    APPOINTMENT_ADD: {
        URL: ENV.API_URL + "/appointment",
        METHOD: "post"
    },
    APPOINTMENT_VIEW: {
        URL: (appointmentId: string) => ENV.API_URL + "/appointment/" + appointmentId,
        METHOD: "get"
    },
    APPOINTMENT_PAYMENT: {
        URL: (appointmentId: string) => ENV.API_URL + "/appointment/" + appointmentId + "/payment",
        METHOD: "post"
    },
    APPOINTMENT_RESCHEDULE: {
        URL: (appointmentId: string) => ENV.API_URL + "/appointment/" + appointmentId + "/reschedule",
        METHOD: "post"
    },
    APPOINTMENT_CANCEL: {
        URL: (appointmentId: string) => ENV.API_URL + "/appointment/" + appointmentId + "/cancel",
        METHOD: "post"
    },
    APPOINTMENT_NOSHOW: {
        URL: (appointmentId: string) => ENV.API_URL + "/appointment/" + appointmentId + "/noShow",
        METHOD: "post"
    },
    APPOINTMENT_CHECKIN: {
        URL: (appointmentId: string) => ENV.API_URL + "/appointment/" + appointmentId + "/checkIn",
        METHOD: "post"
    },
    APPOINTMENT_START: {
        URL: (appointmentId: string) => ENV.API_URL + "/appointment/" + appointmentId + "/start",
        METHOD: "post"
    },
    APPOINTMENT_STOP: {
        URL: (appointmentId: string) => ENV.API_URL + "/appointment/" + appointmentId + "/stop",
        METHOD: "post"
    },
    // user end

    // chart notes start
    MEDICAL_RECORD_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medicalRecord',
        METHOD: "post"
    },
    MEDICAL_RECORD_EDIT: {
        URL: (medicalId: string) => ENV.API_URL + '/medicalRecord/' + medicalId,
        METHOD: "put"
    },
    MEDICAL_RECORD_LIST_LITE: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medicalRecordLite',
        METHOD: "get"
    },
    MEDICAL_INTERVENTION_BASIC_DETAILS_UPDATE: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId,
        METHOD: "put"
    },
    GET_MEDICAL_INTERVENTION_BASIC_DETAILS: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId,
        METHOD: "get"
    },
    CLIENT_MEDICAL_INFO: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medicalRecord',
        METHOD: "get"
    },
    CLIENT_MEDICAL_DETAIL: {
        URL: (medicalId: string) => ENV.API_URL + '/medicalRecord/' + medicalId,
        METHOD: "get"
    },
    SAVE_MEDICAL_INTERVENTION_ROM_CONFIG_FOR_A_BODY_PART: {
        URL: (medicalInterventionId: string, bodyPartId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/rom/' + bodyPartId,
        METHOD: "post"
    },
    DELETE_BODY_PART_UNDER_MEDICAL_INTERVENTION_ROM_CONFIG: {
        URL: (medicalInterventionId: string, bodyPartId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/rom/' + bodyPartId,
        METHOD: "delete"
    },
    SAVE_MEDICAL_INTERVENTION_SPECIAL_TEST_FOR_A_BODY_PART: {
        URL: (medicalInterventionId: string, bodyPartId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/specialTest/' + bodyPartId,
        METHOD: "post"
    },
    DELETE_BODY_PART_UNDER_MEDICAL_INTERVENTION_SPECIAL_TEST: {
        URL: (medicalInterventionId: string, bodyPartId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/specialTest/' + bodyPartId,
        METHOD: "delete"
    },
    CLIENT_MEDICAL_ATTACHMENT: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/attachment',
        METHOD: 'get'
    },
    CLIENT_MEDICAL_RECORD: {
        URL: (clientId: string) => ENV.API_URL + '/medicalRecord/' + clientId,
        METHOD: 'get'
    },
    CLIENT_MEDICAL_INTERVENTION_LIST: {
        URL: (medicalRecordId: string) => ENV.API_URL + "/medicalRecord/" + medicalRecordId + "/record",
        METHOD: "get"
    },
    MEDICAL_RECORD_STATS: {
        URL: (medicalRecordId: string) => ENV.API_URL + "/medicalRecord/" + medicalRecordId + "/statistics",
        METHOD: "get"
    },
    ADD_DRY_NEEDLING_FILE: {
        URL: (medicalInterventionId: string) => ENV.API_URL + "/intervention/" + medicalInterventionId + "/dryNeedling",
        METHOD: "post"
    },
    EDIT_DRY_NEEDLING_FILE: {
        URL: (dryNeedlingFileId: string) => ENV.API_URL + "/dryNeedling/" + dryNeedlingFileId,
        METHOD: "put"
    },
    DRY_NEEDLING_FILE_DETAILS: {
        URL: (dryNeedlingFileId: string) => ENV.API_URL + "/dryNeedling/" + dryNeedlingFileId,
        METHOD: "get"
    },
    DRY_NEEDLING_FILE_ATTACHMENT_DELETE: {
        URL: (dryNeedlingFileId: string) => ENV.API_URL + "/dryNeedling/" + dryNeedlingFileId + "/attachment",
        METHOD: "delete"
    },
    DRY_NEEDLING_FILE_ATTACHMENT_ADD: {
        URL: (dryNeedlingFileId: string) => ENV.API_URL + "/dryNeedling/" + dryNeedlingFileId + "/attachment",
        METHOD: "post"
    },
    ADD_CONCUSSION_FILE: {
        URL: (medicalInterventionId: string) => ENV.API_URL + "/intervention/" + medicalInterventionId + "/concussion",
        METHOD: "post"
    },
    EDIT_CONCUSSION_FILE: {
        URL: (concussionFileId: string) => ENV.API_URL + "/concussion/" + concussionFileId,
        METHOD: "put"
    },
    CONCUSSION_FILE_DETAILS: {
        URL: (concussionFileId: string) => ENV.API_URL + "/concussion/" + concussionFileId,
        METHOD: "get"
    },
    CONCUSSION_FILE_ATTACHMENT_DELETE: {
        URL: (concussionFileId: string) => ENV.API_URL + "/concussion/" + concussionFileId + "/attachment",
        METHOD: "delete"
    },
    CONCUSSION_FILE_ATTACHMENT_ADD: {
        URL: (concussionFileId: string) => ENV.API_URL + "/concussion/" + concussionFileId + "/attachment",
        METHOD: "post"
    },
    CLIENT_MEDICAL_INTERVENTION_DETAILS: {
        URL: (medicalRecordId: string) => ENV.API_URL + "/intervention/" + medicalRecordId,
        METHOD: "get"
    },
    SAVE_MEDICAL_INTERVENTION_ICD_CODES: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/icdCodes',
        METHOD: "post"
    },
    SAVE_MEDICAL_INTERVENTION_EXERCISE_LOG: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/exerciseLog',
        METHOD: "put"
    },
    SAVE_MEDICAL_INTERVENTION_CPT_CODES: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/cptCodes',
        METHOD: "post"
    },
    CHECKOUT_MEDICAL_INTERVENTION: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/finaliseTreatment',
        METHOD: "post"
    },
    GET_MEDICAL_INTERVENTION_EXERCISE_LOG_DETAILS: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/exerciseLog',
        METHOD: "get"
    },
    GET_CLIENT_MEDICAL_INTERVENTION_DETAILS: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId,
        METHOD: "get"
    },

    ADD_SURGERY_RECORD: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/surgeryRecord',
        METHOD: 'post'
    },
    GET_SURGERY_RECORD: {
        URL: (surgeryRecordId: string) => ENV.API_URL + '/surgeryRecord/' + surgeryRecordId,
        METHOD: 'get'
    },
    UPDATE_SURGERY_RECORD: {
        URL: (surgeryRecordId: string) => ENV.API_URL + '/surgeryRecord/' + surgeryRecordId,
        METHOD: 'put'
    },

    ADD_SURGERY_RECORD_ATTACHMENT: {
        URL: (surgeryRecordId: string) => ENV.API_URL + '/surgeryRecord/' + surgeryRecordId + '/attachment/',
        METHOD: 'post'
    },
    REMOVE_SURGERY_RECORD_ATTACHMENT: {
        URL: (surgeryRecordId: string, attachmentId: string) => ENV.API_URL + '/surgeryRecord/' + surgeryRecordId + '/attachment/' + attachmentId,
        METHOD: 'delete'
    },


    // chart notes end
    CASE_STATUS_LIST: {
        URL: ENV.API_URL + "/caseStatus",
        METHOD: "get"
    },
    EXERCISE_LOG_ATTACHMENT_LIST: {
        URL: (interventionId: string) => ENV.API_URL + '/intervention/' + interventionId + '/exerciseLog',
        METHOD: 'get'
    },
    REMOVE_ATTACHMENT: {
        URL: (interventionId: string, id: string) => ENV.API_URL + '/intervention/' + interventionId + '/exerciseLog/attachment/' + id,
        METHOD: 'delete'
    },

    ADD_EXERCISE_LOG_ATTACHMENT: {
        URL: (interventionId: string) => ENV.API_URL + '/intervention/' + interventionId + '/exerciseLog/attachment',
        METHOD: 'post'
    },
    ADD_PROGRESS_REPORT_UNDER_MEDICAL_RECORD: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/progressReport',
        METHOD: 'post'
    },
    UPDATE_PROGRESS_REPORT_UNDER_MEDICAL_RECORD: {
        URL: (progressReportId: string) => ENV.API_URL + '/progressReport/' + progressReportId,
        METHOD: 'put'
    },
    GET_PROGRESS_REPORT_UNDER_MEDICAL_RECORD: {
        URL: (progressReportId: string) => ENV.API_URL + '/progressReport/' + progressReportId,
        METHOD: 'get'
    },
    REPEAT_LAST_INTERVENTION: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/repeatTreatment',
        METHOD: 'post'
    },
    ADD_NEW_MEDICAL_INTERVENTION: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/intervention',
        METHOD: 'post'
    },
    PROGRESS_REPORT_VIEW_DETAILS: {
        URL: (interventionId: string) => ENV.API_URL + '/progressReport/' + interventionId,
        METHOD: 'get'
    },
    ADD_MEDICAL_RECORD_DOCUMENT: {
        URL: (medicalRecordId: string) => ENV.API_URL + "/medicalRecord/" + medicalRecordId + "/document",
        METHOD: "post"
    },
    EDIT_MEDICAL_RECORD_DOCUMENT: {
        URL: (medicalRecordDocumentId: string) => ENV.API_URL + "/document/" + medicalRecordDocumentId,
        METHOD: "put"
    },
    MEDICAL_RECORD_DOCUMENT_DETAILS: {
        URL: (medicalRecordDocumentId: string) => ENV.API_URL + "/document/" + medicalRecordDocumentId,
        METHOD: "get"
    },
    MEDICAL_RECORD_DOCUMENT_ATTACHMENT_DELETE: {
        URL: (medicalRecordDocumentId: string) => ENV.API_URL + "/document/" + medicalRecordDocumentId + "/attachment",
        METHOD: "delete"
    },
    MEDICAL_RECORD_DOCUMENT_ATTACHMENT_ADD: {
        URL: (medicalRecordDocumentId: string) => ENV.API_URL + "/document/" + medicalRecordDocumentId + "/attachment",
        METHOD: "post"
    },
    MEDICAL_RECORD_VIEW_EXERCISE_LOG: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/exerciseLog',
        METHOD: 'get'
    },
    TRANSFER_MEDICAL_RECORD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/transfer',
        METHOD: 'post'
    },
    MEDICAL_RECORD_CONSOLIDATED_INTERVENTIONS_AND_ATTACHMENTS: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/record',
        METHOD: 'get'
    },
    GET_MEDICAL_RECORD_SOAP_NOTE_LIST: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/intervention',
        METHOD: 'get'
    },

    GET_CLIENT_LIST_LITE: {
        URL: ENV.API_URL + '/client/lite',
        METHOD: 'get'
    },
    GET_MEDICAL_RECORD_LIST_LITE: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medicalRecordLite',
        METHOD: 'get'
    },
    TRANSFER_SOAP_NOTE: {
        URL: (medicalInterventionId: string) => ENV.API_URL + '/intervention/' + medicalInterventionId + '/transfer',
        METHOD: 'post'
    },

    GET_MEDICAL_RECORD_INTERVENTION_LIST: {
        URL: (medicalRecordId: string) => ENV.API_URL + '/medicalRecord/' + medicalRecordId + '/intervention',
        METHOD: 'get'
    },
    IMPORT_SOAP_NOTE_API_CALL: {
        URL: (selectedInterventionId: string, medicalInterventionId: string,) => ENV.API_URL + '/intervention/' + selectedInterventionId + '/import/' + medicalInterventionId,
        METHOD: 'post'
    },
    GET_INVENTORY_LIST: {
        URL: ENV.API_URL + '/product/list',
        METHOD: 'post'
    },
    ADD_INVENTORY_PRODUCT: {
        URL: ENV.API_URL + '/product',
        METHOD: 'post'
    },
    GET_INVENTORY_PRODUCT_VIEW_DETAILS: {
        URL: (productId: string) => ENV.API_URL + '/product/' + productId,
        METHOD: 'get'
    },
    EDIT_INVENTORY_PRODUCT: {
        URL: (productId: string) => ENV.API_URL + '/product/' + productId,
        METHOD: 'put'
    }
}

export default APIConfig;
