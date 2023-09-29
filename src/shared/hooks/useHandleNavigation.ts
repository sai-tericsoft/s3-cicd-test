import {useNavigate, useLocation} from "react-router-dom";
import {useCallback} from "react";
import {CommonService} from "../services";

export default function useHandleNavigation() {
    const location = useLocation();
    const navigate = useNavigate();
    return useCallback((route: string) => {
        let returnUrl = CommonService._routeConfig.Dashboard();
        const query = CommonService.parseQueryString(location.search);
        if (Object.keys(query).includes('returnUrl')) {
            returnUrl = query.returnUrl;
        }
        navigate(route + `?returnUrl=${returnUrl}`);
    }, [location, navigate]);
}