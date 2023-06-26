import "./SideMenuComponent.scss";
import {ImageConfig} from "../../../../constants";
import {NavLink} from "react-router-dom";
import {IMenuItem} from "../../../models/menu.model";
import {CommonService} from "../../../services";

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
    // {
    //     path: CommonService._routeConfig.ClientSearch(),
    //     title: 'Chart Notes',
    //     icon: ImageConfig.ChartNotes
    // },
    {
        path: CommonService._routeConfig.SchedulingView(),
        title: 'Scheduling',
        icon: ImageConfig.EventIcon
    },
    {
        path: CommonService._routeConfig.FrequentlyAskedQuestions(),
        title: "Help",
        icon: ImageConfig.HelpIcon
    },
    {
        path: CommonService._routeConfig.PersonalDetails(),
        title: "Settings",
        icon: ImageConfig.SettingIcon
    }
]

const SideMenuComponent = (props: SideMenuComponentProps) => {

    return (
        <div className={'side-menu-component'}>
            <div className='menu-list'>
                {
                    menuList.map((menu, index) => {
                        return <NavLink key={menu.title} to={menu.path} className="menu-item"
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
