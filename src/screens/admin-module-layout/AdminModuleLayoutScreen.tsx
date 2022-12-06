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
        path: ""
    },
    {
        title: "Forms",
        path: ""
    },
    {
        title: "Appointments",
        path: ""
    },
    {
        title: "Discounts",
        path: ""
    },
    {
        title: "Referral Discounts",
        path: ""
    },
    {
        title: "User Management",
        path: ""
    },
    {
        title: "Access Management",
        path: ""
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