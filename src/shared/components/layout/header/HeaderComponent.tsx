import {ImageConfig} from "../../../../constants";
import "./HeaderComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {Logout} from "@mui/icons-material";
import {logout} from "../../../../store/actions/account.action";
import {CommonService} from "../../../services";
import ButtonComponent from "../../button/ButtonComponent";
import {useNavigate} from "react-router-dom";
import {useCallback} from "react";

interface HeaderComponentProps {

}

const HeaderComponent = (props: HeaderComponentProps) => {

    const {currentNavParams, canNavigateBack} = useSelector((state: IRootReducerState) => state.navigation);
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const title = currentNavParams.title;
    const userProfilePicture = undefined;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNavigateBack = useCallback(() => {
        navigate(-1);
    }, []);

    return (
        <div className="header-component">
            <div className="header-title-nav-back">
                {
                    canNavigateBack &&
                    <ButtonComponent isIconButton={true}
                                     onClick={handleNavigateBack}
                                     className={"header-nav-back"}>
                        <ImageConfig.NavigateBack/>
                    </ButtonComponent>
                }
                <div className="header-title">
                    {title}
                </div>
            </div>
            <div className="header-options">
                <div className="header-option lock">
                    <ButtonComponent isIconButton>
                        <ImageConfig.LockIcon/>
                    </ButtonComponent>
                </div>
                <div className="header-option logout">
                    <ButtonComponent isIconButton
                                     onClick={() => {
                                         CommonService._alert.showToast("Logged out", "success");
                                         navigate(CommonService._routeConfig.LoginRoute());
                                         dispatch(logout());
                                     }}>
                        <Logout/>
                    </ButtonComponent>
                </div>
                <div className="header-option profile">
                    <span className="profile-dp-icon">
                        {userProfilePicture && <img src={userProfilePicture} alt={"user profile"}/>}
                        {!userProfilePicture && <ImageConfig.ProfileIcon/>}
                    </span>
                    <div className="profile-name">
                        {currentUser?.first_name} {currentUser?.last_name}
                    </div>
                    {/*<span className="profile-dropdown-icon">*/}
                    {/*    <ImageConfig.SelectDropDownIcon/>*/}
                    {/*</span>*/}
                </div>
            </div>
        </div>
    );

};

export default HeaderComponent;