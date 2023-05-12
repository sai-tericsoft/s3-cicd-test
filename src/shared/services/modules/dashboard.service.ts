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

const DashboardService = {
    dashboardMessageHistory,
    deleteDashboardMessage,
    editDashboardMessage
}

export default DashboardService;