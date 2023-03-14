import "./SubMenuListComponent.scss";
import {ISubMenuItem} from "../../models/menu.model";
import {NavLink} from "react-router-dom";
import {CommonService} from "../../services";

interface SubMenuListComponentProps {
    menuItems: ISubMenuItem[]
}

const SubMenuListComponent = (props: SubMenuListComponentProps) => {

    const {menuItems, ...otherProps} = props;
    console.log('menuItems', menuItems);

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
                                                className="sub-menu-item"
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
                                    className="sub-menu-item">
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