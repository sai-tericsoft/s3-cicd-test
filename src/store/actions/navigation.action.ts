export const SET_CURRENT_NAV_PARAMS = "SET_CURRENT_NAV_PARAMS";
export const SET_SIDE_MENU_VIEW = "SET_SIDE_MENU_VIEW";

export const setCurrentNavParams = (title: string, meta?: any) => {
    return {
        type: SET_CURRENT_NAV_PARAMS,
        payload: {
            title,
            meta
        }
    }
};

export const setSideMenuView = (sideMenuView: "default" | "compact") => {
    return {
        type: SET_SIDE_MENU_VIEW,
        payload: {
            sideMenuView
        }
    }
};
