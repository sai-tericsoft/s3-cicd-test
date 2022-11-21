import ENV from "./ENV";

const APIConfig = {
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

    // GET_LOCATION_PHYSICIAN_LIST: {
    //     URL: (location_id: any) => ENV.API_URL + '/location/' + location_id + '/getPhysiciansList',
    //     METHOD: "get"
    // },
}

export default APIConfig;
