import {useNavigate, useLocation} from "react-router-dom";
import {useCallback} from "react";
import {CommonService} from "../services";

export default function useHandleNavigation() {
    const location = useLocation();
    const navigate = useNavigate();
    return useCallback((route: string, extraInfo?: string) => {
        let returnUrl = CommonService._routeConfig.Dashboard();
        const query = CommonService.parseQueryString(location.search);
        if (Object.keys(query).includes('returnUrl')) {
            returnUrl = query.returnUrl;
        }
        // navigate(route + `?returnUrl=${returnUrl}`+ extraInfo?`&${extraInfo}`:"");
        // Use a template string for the entire URL
        const url = `${route}?returnUrl=${returnUrl}${extraInfo ? `&${extraInfo}` : ''}`;
        navigate(url);
    }, [location, navigate]);
}