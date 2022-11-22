import "./AdminModuleLayoutScreen.scss";
import {Link, NavLink, Outlet} from "react-router-dom";
import {COMING_SOON_ROUTE, SERVICE_CATEGORY_LIST} from "../../constants/RoutesConfig";

interface AdminModuleLayoutScreenProps {

}

const ADMIN_MENU_ITEMS = [
    {
        title: "Service Category",
        link: SERVICE_CATEGORY_LIST
    },
    {
        title: "Facility Management",
        link: COMING_SOON_ROUTE
    }
]

const AdminModuleLayoutScreen = (props: AdminModuleLayoutScreenProps) => {

    return (
        <div className={'admin-module-layout'}>
            <div className="admin-module-menu-wrapper">
                <div className="admin-module-menu">
                    {
                        ADMIN_MENU_ITEMS.map((item) => {
                            return <NavLink to={item.link} className="admin-module-menu-item">
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