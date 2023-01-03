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
    // client end

    // user start
    USER_LIST: {
        URL: ENV.API_URL + "/user",
        METHOD: "get"
    },
    USER_LIST_LITE: {
        URL: ENV.API_URL + "/user/lite",
        METHOD: "get"
    },
    // user end

    // chart notes start
    MEDICAL_RECORD_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/medicalRecord',
        METHOD: "post"
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
        URL:(clientId:string)=> ENV.API_URL + '/client/'+ clientId +'/medicalRecord',
        METHOD: "get"
    },
    SAVE_MEDICAL_INTERVENTION_ROM_CONFIG_FOR_A_BODY_PART: {
        URL:(medicalInterventionId:string, bodyPartId:string)=> ENV.API_URL + '/intervention/'+ medicalInterventionId +'/rom/'+ bodyPartId,
        METHOD: "post"
    },
    DELETE_BODY_PART_UNDER_MEDICAL_INTERVENTION_ROM_CONFIG: {
        URL:(medicalInterventionId:string, bodyPartId:string)=> ENV.API_URL + '/intervention/'+ medicalInterventionId +'/rom/'+ bodyPartId,
        METHOD: "delete"
    },
    SAVE_MEDICAL_INTERVENTION_SPECIAL_TEST_FOR_A_BODY_PART: {
        URL:(medicalInterventionId:string, bodyPartId:string)=> ENV.API_URL + '/intervention/'+ medicalInterventionId +'/specialTest/'+ bodyPartId,
        METHOD: "post"
    },
    DELETE_BODY_PART_UNDER_MEDICAL_INTERVENTION_SPECIAL_TEST: {
        URL:(medicalInterventionId:string, bodyPartId:string)=> ENV.API_URL + '/intervention/'+ medicalInterventionId +'/specialTest/'+ bodyPartId,
        METHOD: "delete"
    },
     CLIENT_MEDICAL_ATTACHMENT: {
        URL:  ENV.API_URL +'',
        METHOD: 'get'
    },
    CLIENT_MEDICAL_RECORD: {
        URL:(clientId:string)=>ENV.API_URL +'/medicalRecord/' + clientId,
        METHOD: 'get'
    },
    CLIENT_MEDICAL_INTERVENTION_LIST: {
        URL:(medicalRecordId:string)=> ENV.API_URL + "/medicalRecord/"+ medicalRecordId +"/intervention",
        METHOD: "get"
    },
    SAVE_MEDICAL_INTERVENTION_EXERCISE_LOG: {
        URL:(medicalInterventionId:string)=> ENV.API_URL + '/intervention/'+ medicalInterventionId +'/exerciseLog',
        METHOD: "put"
    },
    // chart notes end
    EXERCISE_LOG_ATTACHMENT_LIST :{
        URL:(interventionId:string)=> ENV.API_URL + '/intervention/'+ interventionId +'/exerciseLog',
        METHOD :'get'
    },
    REMOVE_ATTACHMENT: {
        URL: (interventionId: string, id: string) => ENV.API_URL + '/intervention/' + interventionId + '/exerciseLog/attachment/' + id,
        METHOD: 'delete'
    },
    ADD_EXERCISE_LOG_ATTACHMENT : {
        URL:(interventionId:string)=>ENV.API_URL + '/intervention/'+interventionId+'/exerciseLog/attachment',
        METHOD:'post'
    }
}

export default APIConfig;
