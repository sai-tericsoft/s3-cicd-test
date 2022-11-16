import { ImageConfig } from "../../../../constants";
import "./HeaderComponent.scss";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";

interface HeaderComponentProps {

}

const HeaderComponent = (props: HeaderComponentProps) => {

    const { currentNavParams } = useSelector((state: IRootReducerState)=> state.navigation);
    const title = currentNavParams.title;
    return (
        <div className="header-component">
            <div className="header-title">
                {title}
            </div>
            <div className="header-options">
                <div className="header-option lock">
                    <ImageConfig.LockIcon/>
                </div>
                <div className="header-option notification">
                    <ImageConfig.NotificationsIcon/>
                </div>
                <div className="header-option profile">
                    <span className="profile-dp-icon">
                        <img src={ImageConfig.ProfileIcon} alt={"profile picture"}/>
                    </span>
                    <div className="profile-name-id">
                        <span className="profile-name">John Richardson</span>
                        <span className="profile-id">#654561</span>
                    </div>
                    <span className="profile-dropdown-icon">
                        <ImageConfig.SelectDropDownIcon/>
                    </span>
                </div>
            </div>
        </div>
    );

};

export default HeaderComponent;