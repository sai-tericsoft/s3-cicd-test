import "./AdminModuleLayoutScreen.scss";
import {Outlet} from "react-router-dom";
import {CommonService} from "../../shared/services";
import SubMenuListComponent from "../../shared/components/sub-menu-list/SubMenuListComponent";

interface AdminModuleLayoutScreenProps {

}

const ADMIN_MENU_ITEMS = [
    {
        title: "Facility Management",
        path: CommonService._routeConfig.FacilityList()
    },
    {
        title: "Service Category",
        path: CommonService._routeConfig.ServiceCategoryList()
    },
    {
        title: "System Settings",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Forms",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Appointments",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Discounts",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Referral Discounts",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "User Management",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Access Management",
        path: CommonService._routeConfig.ComingSoonRoute()
    }
]

const AdminModuleLayoutScreen = (props: AdminModuleLayoutScreenProps) => {

    return (
        <div className={'admin-module-layout'}>
            <SubMenuListComponent menuItems={ADMIN_MENU_ITEMS}/>
            <div className="admin-module-content-wrapper">
                <Outlet/>
            </div>
        </div>
    );

};

export default AdminModuleLayoutScreen;