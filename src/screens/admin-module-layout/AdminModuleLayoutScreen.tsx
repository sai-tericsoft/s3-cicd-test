import "./AdminModuleLayoutScreen.scss";
import {NavLink, Outlet} from "react-router-dom";
import {CommonService} from "../../shared/services";

interface AdminModuleLayoutScreenProps {

}

const ADMIN_MENU_ITEMS = [
    {
        title: "Facility Management",
        link: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Service Category",
        link: CommonService._routeConfig.ServiceCategoryList()
    },
    {
        title: "System Settings",
        link: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Forms",
        link: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Appointments",
        link: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Discounts",
        link: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Referral Discounts",
        link: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "User Management",
        link: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Access Management",
        link: CommonService._routeConfig.ComingSoonRoute()
    }
]

const AdminModuleLayoutScreen = (props: AdminModuleLayoutScreenProps) => {

    return (
        <div className={'admin-module-layout'}>
            <div className="admin-module-menu-wrapper">
                <div className="admin-module-menu">
                    {
                        ADMIN_MENU_ITEMS.map((item) => {
                            return <NavLink to={item.link}
                                            key={item.title}
                                            className="admin-module-menu-item"
                                            id={"admin_sc_" + item.title.toLowerCase().split(' ').join('_') + '_link'}
                            >
                                {item.title}
                            </NavLink>
                        })
                    }
                </div>
            </div>
            <div className="admin-module-content-wrapper">
                <Outlet/>
            </div>
        </div>
    );

};

export default AdminModuleLayoutScreen;