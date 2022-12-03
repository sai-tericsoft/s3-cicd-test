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
    //client-activity-log
    CLIENT_ACTIVITY_LOG: {
        URL: (clientId: string) => ENV.API_URL + '/client/' + clientId + '/activityLog',
        METHOD: 'get'
    }
}

export default APIConfig;
