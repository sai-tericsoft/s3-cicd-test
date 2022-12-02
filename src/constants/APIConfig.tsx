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
    CLIENT_LIST: {
        URL: ENV.API_URL + "/client/list",
        METHOD: "post"
    },
    CLIENT_BASIC_DETAILS_ADD: {
        URL: ENV.API_URL + "/client",
        METHOD: "post"
    },
    CLIENT_DETAILS: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId,
        METHOD: "get"
    },
    CLIENT_PERSONAL_HABITS_ADD: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/personalHabits',
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
    //
}

export default APIConfig;
