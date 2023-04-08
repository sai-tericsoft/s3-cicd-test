import "./AdminModuleLayoutScreen.scss";
import {Outlet, useLocation} from "react-router-dom";
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
        path: CommonService._routeConfig.SystemSettings()
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
        path: CommonService._routeConfig.DiscountList()
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

    const location: any = useLocation();
    const title = (location.state && location.state.title) ? location.state.title : ADMIN_MENU_ITEMS[0].title;

    return (
            <div className={'admin-module-layout'}>
                <div className={"admin-module-layout-left-bar"}>
                    <div className="admin-module-layout-title">
                        {title}
                    </div>
                    <SubMenuListComponent menuItems={ADMIN_MENU_ITEMS}/>
                </div>
                <div className="admin-module-content-wrapper">
                    <Outlet/>
                </div>
            </div>
    );

};

export default AdminModuleLayoutScreen;
