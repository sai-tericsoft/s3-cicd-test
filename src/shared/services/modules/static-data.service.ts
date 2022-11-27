import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getConsultationDurationList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CONSULTATION_DURATION_LIST.METHOD](APIConfig.CONSULTATION_DURATION_LIST.URL, payload);
}

const StaticDataService = {
    weekDays,
    getConsultationDurationList
}

export default StaticDataService;
