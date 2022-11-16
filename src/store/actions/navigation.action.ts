export const SET_CURRENT_NAV_PARAMS = "SET_CURRENT_NAV_PARAMS";

export const setCurrentNavParams = (title: string, meta?: any) => {
    return {
        type: SET_CURRENT_NAV_PARAMS,
        payload: {
            title,
            meta
        }
    }
};
