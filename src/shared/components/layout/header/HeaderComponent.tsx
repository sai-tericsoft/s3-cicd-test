import {ImageConfig} from "../../../../constants";
import "./HeaderComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {logout} from "../../../../store/actions/account.action";
import {CommonService} from "../../../services";
import {useNavigate} from "react-router-dom";
import {useCallback, useState} from "react";
import IconButtonComponent from "../../icon-button/IconButtonComponent";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {Logout} from "@mui/icons-material";

interface HeaderComponentProps {

}

const HeaderComponent = (props: HeaderComponentProps) => {

    const {currentNavParams, onNavigateBack} = useSelector((state: IRootReducerState) => state.navigation);
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const title = currentNavParams.title;
    const userProfilePicture = undefined;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNavigateBack = useCallback(() => {
        if (onNavigateBack) {
            onNavigateBack();
        }
    }, [onNavigateBack]);

    const [profileMenuAnchorEl, setProfileMenuAnchorE] = useState<null | HTMLElement>(null);

    const showProfileMenu = Boolean(profileMenuAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setProfileMenuAnchorE(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchorE(null);
    };

    return (
        <div className="header-component">
            <div className="header-title-nav-back">
                {
                    onNavigateBack &&
                    <IconButtonComponent onClick={handleNavigateBack}
                                         className={"header-nav-back"}
                                         id={"header-back-nav-btn"}
                    >
                        <ImageConfig.NavigateBack/>
                    </IconButtonComponent>
                }
                <div className="header-title">
                    {!!onNavigateBack ? "Back": title}
                </div>
            </div>
            <div className="header-options">
                <div className="header-option lock">
                    <IconButtonComponent>
                        <ImageConfig.LockIcon/>
                    </IconButtonComponent>
                </div>
                <div className="header-option profile"
                     id="profile-menu"
                     aria-controls={showProfileMenu ? 'profile-menu' : undefined}
                     aria-haspopup="true"
                     aria-expanded={showProfileMenu ? 'true' : undefined}
                     onClick={handleProfileMenuOpen}
                >
                    <span className="profile-dp-icon">
                        {userProfilePicture && <img src={userProfilePicture} alt={"user profile"}/>}
                        {!userProfilePicture && <ImageConfig.ProfileIcon/>}
                    </span>
                    <div className="profile-name">
                        {currentUser?.first_name} {currentUser?.last_name}
                    </div>
                    <span className="profile-dropdown-icon">
                        <ImageConfig.SelectDropDownIcon/>
                    </span>
                </div>
            </div>
            <Menu // Todo refactor to extract menu logic
                id="profile-menu"
                anchorEl={profileMenuAnchorEl}
                open={showProfileMenu}
                onClose={handleProfileMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'profile-menu',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => {
                    CommonService._alert.showToast("Logged out", "success");
                    navigate(CommonService._routeConfig.LoginRoute());
                    dispatch(logout());
                }}>
                    <ListItemIcon>
                        <Logout fontSize={"small"}/>
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );

};

export default HeaderComponent;