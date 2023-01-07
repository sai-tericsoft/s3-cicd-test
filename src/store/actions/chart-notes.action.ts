
export const GET_CLIENT_FAVOURITE_CODES='GET_CLIENT_FAVOURITE_CODES';
export const SET_CLIENT_FAVOURITE_CODES='SET_CLIENT_FAVOURITE_CODES';


export const getClientFavouriteCodes= () => {
    return {
        type: GET_CLIENT_FAVOURITE_CODES, payload: {

        }
    };
};

export const setClientFavouriteCode = (favouriteCodeList: any) => {
    return {
        type: SET_CLIENT_FAVOURITE_CODES, payload: {
            favouriteCodeList
        }
    };
};