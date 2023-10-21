import "./SubMenuListComponent.scss";
import {ISubMenuItem} from "../../models/menu.model";
import {NavLink, useLocation} from "react-router-dom";
import {CommonService} from "../../services";
import {useCallback, useEffect, useState} from "react";

interface SubMenuListComponentProps {
    menuItems: ISubMenuItem[];
    pathIndex?: number;
    isExternalHighLight?: boolean;
    listMapping?: any;
}

const SubMenuListComponent = (props: SubMenuListComponentProps) => {

    const {menuItems, isExternalHighLight, pathIndex, listMapping, ...otherProps} = props;
    const [currentRoute, setCurrentRoute] = useState<string>('');
    const location = useLocation();

    // console.log("menuItems",menuItems,isExternalHighLight,pathIndex,listMapping)

    useEffect(() => {
        if (isExternalHighLight && pathIndex) {
            setCurrentRoute(location.pathname.split('/')[pathIndex]);
        }
    }, [location,isExternalHighLight,pathIndex]);

    const isItemActive = useCallback((item: ISubMenuItem, currentRoute: string) => {
        // console.log("item",item,currentRoute)
        return (listMapping[item.title] === currentRoute) ? 'sub-menu-item active' : 'sub-menu-item';
    }, [listMapping]);

    return (
        <div className={'sub-menu-list-component'}>
            <div className="sub-menu-wrapper">
                <div className="sub-menu">
                    {
                        menuItems.map((item) => {
                            if (item.path) {
                                return <NavLink id={`${item.title.toLowerCase().split(' ').join('_')}_menu`}
                                                to={{
                                                    pathname: item.path,
                                                }}
                                                key={item.title}
                                    // className="sub-menu-item"
                                                className={isExternalHighLight ? isItemActive(item, currentRoute) : 'sub-menu-item'}
                                                state={{title: item.title}}
                                                {...otherProps}
                                >
                                    {item.title}
                                </NavLink>
                            } else {
                                return <div
                                    id={`${item.title.toLowerCase().split(' ').join('_')}_menu`}
                                    onClick={() => {
                                        CommonService._alert.showToast('Coming Soon');
                                    }
                                    }
                                    key={item.title}
                                    className="sub-menu-item"
                                >
                                    {item.title}
                                </div>
                            }
                        })
                    }
                </div>
            </div>
        </div>
    );

};

export default SubMenuListComponent;
