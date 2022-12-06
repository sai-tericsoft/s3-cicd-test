import "./SubMenuListComponent.scss";
import {ISubMenuItem} from "../../models/menu.model";
import {NavLink} from "react-router-dom";
import {CommonService} from "../../services";

interface SubMenuListComponentProps {
    menuItems: ISubMenuItem[]
}

const SubMenuListComponent = (props: SubMenuListComponentProps) => {

    const {menuItems} = props;

    return (
        <div className={'sub-menu-list-component'}>
            <div className="sub-menu-wrapper">
                <div className="sub-menu">
                    {
                        menuItems.map((item) => {
                            if (item.path) {
                                return <NavLink to={item.path}
                                                key={item.title}
                                                className="sub-menu-item">
                                    {item.title}
                                </NavLink>
                            } else {
                                return <div onClick={() => {
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