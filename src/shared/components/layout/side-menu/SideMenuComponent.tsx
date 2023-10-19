import "./SideMenuComponent.scss";
import {ImageConfig} from "../../../../constants";
import {NavLink, useLocation} from "react-router-dom";
import {IMenuItem} from "../../../models/menu.model";
import {CommonService} from "../../../services";
import {useEffect, useState} from "react";

interface SideMenuComponentProps {

}

const menuList: IMenuItem[] = [
    {
        path: CommonService._routeConfig.Dashboard(),
        title: 'Dashboard',
        icon: ImageConfig.DashboardIcon
    },
    {
        path: CommonService._routeConfig.ClientList(),
        title: 'Clients',
        icon: ImageConfig.ClientsIcon
    },
    {
        path: CommonService._routeConfig.Admin(),
        title: 'Admin',
        icon: ImageConfig.AdminIcon
    },
    {
        path: CommonService._routeConfig.ClientSearch(),
        title: 'Chart Notes',
        icon: ImageConfig.ChartNotes
    },
    {
        path: CommonService._routeConfig.SchedulingView(),
        title: 'Scheduling',
        icon: ImageConfig.EventIcon
    },
    {
        path: CommonService._routeConfig.BillingList(),
        title: 'Billing',
        icon: ImageConfig.BillingIcon
    },
    {
        path: CommonService._routeConfig.InventoryList(),
        title: 'Inventory',
        icon: ImageConfig.InventoryIcon
    },
    {
        path: CommonService._routeConfig.Help(),
        title: "Help",
        icon: ImageConfig.HelpIcon
    },
    {
        path: CommonService._routeConfig.Settings(),
        title: "Settings",
        icon: ImageConfig.SettingIcon
    }
]

const SideMenuComponent = (props: SideMenuComponentProps) => {

    const [currentRoute, setCurrentRoute] = useState<string>('');
    const location = useLocation();

    useEffect(() => {
        setCurrentRoute(location.pathname.split('/')[1]);
    }, [location]);

    return (
        <div className={'side-menu-component'}>
            <div className='menu-list'>
                {
                    menuList.map((menu, index) => {
                        return <NavLink key={menu.title} to={menu.path}
                                        // className="menu-item"
                                        className={() => {
                                            if(currentRoute === '' && menu.title === 'Dashboard') {
                                                return "menu-item active";
                                            }
                                            else if (menu.title.toLowerCase().split(' ').join('-') === currentRoute ) {
                                                return "menu-item active";
                                            }
                                            return "menu-item";
                                        }}
                                        id={`${menu.title.toLowerCase().split(' ').join('_')}_menu`}
                                        {...props}
                        >
                        <span className="menu-item-icon">
                            <menu.icon/>
                        </span>
                            <span className="menu-item-title">{menu.title}</span>
                        </NavLink>
                    })
                }
            </div>
        </div>
    );

};

export default SideMenuComponent;
