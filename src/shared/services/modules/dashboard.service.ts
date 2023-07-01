import {APIConfig} from "../../../constants";
import {ApiService} from "../index";


const dashboardMessageHistory = () => {
    // @ts-ignore
    return ApiService[APIConfig.DASHBOARD_MESSAGE_HISTORY.METHOD](APIConfig.DASHBOARD_MESSAGE_HISTORY.URL);
}
const deleteDashboardMessage =(messageId:string,payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.DASHBOARD_DELETE_MESSAGE.METHOD](APIConfig.DASHBOARD_DELETE_MESSAGE.URL(messageId),payload);
}

const editDashboardMessage =(messageId:string,payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.DASHBOARD_EDIT_MESSAGE.METHOD](APIConfig.DASHBOARD_EDIT_MESSAGE.URL(messageId),payload);
}

const todayBirthdayList = ()=>{
    // @ts-ignore
    return ApiService[APIConfig.TODAY_BIRTHDAY_LIST.METHOD](APIConfig.TODAY_BIRTHDAY_LIST.URL);
}

const sendBirthdayWishes = (clientId:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.SEND_BIRTHDAY_WISHES.METHOD](APIConfig.SEND_BIRTHDAY_WISHES.URL(clientId));
}

const DashboardService = {
    dashboardMessageHistory,
    deleteDashboardMessage,
    editDashboardMessage,
    todayBirthdayList,
    sendBirthdayWishes,
}

export default DashboardService;