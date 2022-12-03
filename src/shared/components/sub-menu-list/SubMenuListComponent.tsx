import "./SubMenuListComponent.scss";
import {ISubMenuItem} from "../../models/menu.model";
import {NavLink} from "react-router-dom";

interface SubMenuListComponentProps {
    menuItems: ISubMenuItem[]
}

const SubMenuListComponent = (props: SubMenuListComponentProps) => {

    const { menuItems } = props;

    return (
        <div className={'sub-menu-list-component'}>
            <div className="sub-menu-wrapper">
                <div className="sub-menu">
                    {
                        menuItems.map((item) => {
                            return <NavLink to={item.path}
                                            key={item.title}
                                            className="sub-menu-item">
                                {item.title}
                            </NavLink>
                        })
                    }
                </div>
            </div>
        </div>
    );

};

export default SubMenuListComponent;