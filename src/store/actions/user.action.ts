import {IUser} from "../../shared/models/user.model";

export const GET_ALL_PROVIDERS_LIST = 'GET_ALL_PROVIDERS_LIST';
export const SET_ALL_PROVIDERS_LIST = 'SET_ALL_PROVIDERS_LIST';

export const GET_USER_BASIC_DETAILS = 'GET_USER_BASIC_DETAILS';
export const SET_USER_BASIC_DETAILS = 'SET_USER_BASIC_DETAILS';

export const GET_USER_SLOTS = "GET_USER_SLOTS";
export const SET_USER_SLOTS = "SET_USER_SLOTS";

export const GET_USER_GLOBAL_SLOTS = "GET_USER_GLOBAL_SLOTS";
export const SET_USER_GLOBAL_SLOTS = "SET_USER_GLOBAL_SLOTS";

export const getAllProvidersList = () => {
    return {type: GET_ALL_PROVIDERS_LIST};
};

export const setAllProvidersList = (allProvidersList: IUser[]) => {
    return {
        type: SET_ALL_PROVIDERS_LIST, payload: {
            allProvidersList
        }
    };
};

export const getUserBasicDetails = (userId: string) => {
    return {
        type: GET_USER_BASIC_DETAILS, payload: {
            userId
        }
    };
};

export const setUserBasicDetails = (userBasicDetails: any) => {
    console.log(userBasicDetails);
    return {
        type: SET_USER_BASIC_DETAILS, payload: {
            userBasicDetails
        }
    };
};

export const getUserSlots = (userId: string, facilityId: string) => {
    console.log(userId);
    console.log(facilityId);

    return {
        type: GET_USER_SLOTS, payload: {
            userId,
            facilityId
        }
    };
};

export const setUserSlots = (userSlots: any) => {
    return {
        type: SET_USER_SLOTS, payload: {
            userSlots
        }
    };
};

export const getUserGlobalSlots = (userId: string) => {
    return {
        type: GET_USER_GLOBAL_SLOTS, payload: {
            userId
        }
    };
}

export const setUserGlobalSlots = (userGlobalSlots: any) => {
    return {
        type: SET_USER_GLOBAL_SLOTS, payload: {
            userGlobalSlots
        }
    };
}
