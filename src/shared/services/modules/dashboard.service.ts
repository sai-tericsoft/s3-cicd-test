import {APIConfig} from "../../../constants";
import {ApiService} from "../index";


const dashboardMessageHistory = () => {
    // @ts-ignore
    return ApiService[APIConfig.DASHBOARD_MESSAGE_HISTORY.METHOD](APIConfig.DASHBOARD_MESSAGE_HISTORY.URL);
}

const DashboardService = {
    dashboardMessageHistory
}

export default DashboardService;