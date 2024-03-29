import {ApiService} from "../index";
import {APIConfig} from "../../../constants";
import RouteConfigService from "../route-config.service";

const getUserList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_LIST.METHOD](APIConfig.USER_LIST.URL, payload);
}

const getUserAdd = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_ADD.METHOD](APIConfig.USER_ADD.URL, payload);
}

const getUserListLite = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_LIST_LITE.METHOD](APIConfig.USER_LIST_LITE.URL, payload);
}

const getUserAvailableDatesList = (providerId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_AVAILABLE_DATES_LIST.METHOD](APIConfig.USER_AVAILABLE_DATES_LIST.URL(providerId) + "?service_id=" + payload.service_id + "&facility_id=" + payload.facility_id + "&duration=" + +payload?.duration);
}

const getUserAvailableTimesList = (providerId: string, payload: any) => {
    console.log(payload);
    // @ts-ignore
    return ApiService[APIConfig.USER_AVAILABLE_TIMES_LIST.METHOD](APIConfig.USER_AVAILABLE_TIMES_LIST.URL(providerId) + "?available_on=" + payload.available_on + "&service_id=" + payload.service_id + "&facility_id=" + payload.facility_id + "&duration=" + +payload.duration);
}

const getUserBasicDetails = (userId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_DETAILS.METHOD](APIConfig.USER_DETAILS.URL(userId));
}

const NavigateToUserEdit = (userId: string, step: any) => {
    return RouteConfigService.UserPersonalDetailsEdit(userId) + "?currentStep=" + step;
}

const NavigateToSettingEdit = (userId: string, step: any) => {
    return RouteConfigService.PersonalDetailsEdit(userId) + "?currentStep=" + step;
}

const NavigateToSettingsAccountDetailsEdit = (userId: string, step: any) => {
    return RouteConfigService.PersonalAccountDetailsEdit(userId) + "?currentStep=" + step;
}

const NavigateToUserAccountDetailsEdit = (userId: string, step: any) => {
    return RouteConfigService.UserAccountDetailsEdit(userId) + "?currentStep=" + step;
}

const NavigateToSettingsSlotsEdit = (userId: string, step: any) => {
    return RouteConfigService.PersonalSlotsEdit(userId) + "?currentStepId=" + step;
}

const NavigateToUserSlotsEdit = (userId: string, step: any) => {
    return RouteConfigService.UserSlotsEdit(userId) + "?currentStepId=" + step;
}

const userEdit = (userId: string, payload: any) => {
    return ApiService[APIConfig.USER_EDIT.METHOD](APIConfig.USER_EDIT.URL(userId), payload);
}

const userPasswordEdit = (payload: any) => {
    return ApiService[APIConfig.USER_PASSWORD_EDIT.METHOD](APIConfig.USER_PASSWORD_EDIT.URL, payload);
}

const addUserSlots = (userId: string, facilityId: string, payload: any) => {
    return ApiService[APIConfig.ADD_USER_SLOTS.METHOD](APIConfig.ADD_USER_SLOTS.URL(userId, facilityId), payload);
}

const addUserSlotsForService = (payload: any) => {
    return ApiService[APIConfig.ADD_USER_SLOTS_FOR_SERVICE.METHOD](APIConfig.ADD_USER_SLOTS_FOR_SERVICE.URL, payload);
}

const deleteUser = (userId: string, payload: any) => {
    return ApiService[APIConfig.DELETE_USER.METHOD](APIConfig.DELETE_USER.URL(userId), payload);
}

const toggleDeleteUser = (userId: string, payload: any) => {
    return ApiService[APIConfig.TOGGLE_USER.METHOD](APIConfig.TOGGLE_USER.URL(userId), payload);
}

const slotDetailsAPICall = (userId: string, facilityId: string, payload: any) => {
    return ApiService[APIConfig.VIEW_USER_SLOTS.METHOD](APIConfig.VIEW_USER_SLOTS.URL(userId, facilityId), payload);
}

const getUserGlobalSlots = (userId: string, payload: any) => {
    return ApiService[APIConfig.GET_USER_GLOBAL_SLOTS.METHOD](APIConfig.GET_USER_GLOBAL_SLOTS.URL(userId), payload);
}

const UserService = {
    getUserList,
    getUserListLite,
    getUserAvailableDatesList,
    getUserAvailableTimesList,
    getUserAdd,
    getUserBasicDetails,
    NavigateToUserEdit,
    userEdit,
    NavigateToSettingEdit,
    NavigateToSettingsAccountDetailsEdit,
    NavigateToUserAccountDetailsEdit,
    userPasswordEdit,
    addUserSlots,
    deleteUser,
    toggleDeleteUser,
    slotDetailsAPICall,
    NavigateToSettingsSlotsEdit,
    NavigateToUserSlotsEdit,
    getUserGlobalSlots,
    addUserSlotsForService
}

export default UserService;
