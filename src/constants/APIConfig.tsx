import ENV from "./ENV";

interface IAPIConfig {
    [k: string]: {
        URL: string,
        METHOD: "get" | "post" | "delete" | "put"
    }
}

const APIConfig: IAPIConfig = {
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
    // service category end

    // GET_LOCATION_PHYSICIAN_LIST: {
    //     URL: (location_id: any) => ENV.API_URL + '/location/' + location_id + '/getPhysiciansList',
    //     METHOD: "get"
    // },
}

export default APIConfig;
