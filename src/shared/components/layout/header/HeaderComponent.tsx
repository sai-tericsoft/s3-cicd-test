import {ImageConfig, Misc} from "../../../../constants";
import "./HeaderComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {logout, setSystemLocked} from "../../../../store/actions/account.action";
import {CommonService} from "../../../services";
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import IconButtonComponent from "../../icon-button/IconButtonComponent";
import {ListItemIcon, ListItemText} from "@mui/material";
import {Logout} from "@mui/icons-material";
import MenuDropdownComponent from "../../menu-dropdown/MenuDropdownComponent";
import ButtonComponent from "../../button/ButtonComponent";
import {Field, FieldProps, Form, Formik} from "formik";
import FormikPasswordInputComponent from "../../form-controls/formik-password-input/FormikPasswordInputComponent";
import ModalComponent from "../../modal/ModalComponent";
import moment from "moment/moment";
import {IAPIResponseType} from "../../../models/api.model";
import {ILoginResponse} from "../../../models/account.model";
import * as Yup from "yup";


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

    const handleSystemLock = useCallback(() => {
        dispatch(setSystemLocked(true,'manual'));
    },[dispatch]);

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
                    {!!onNavigateBack ? "Back" : title}
                </div>
            </div>
            <div className="header-options">
                <div className="header-option lock">
                    <IconButtonComponent>
                        <ImageConfig.LockIcon onClick={handleSystemLock}/>
                    </IconButtonComponent>
                </div>
                <MenuDropdownComponent menuBase={<>
                    <div className="header-option profile">
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
                </>} menuOptions={
                    [
                        <div className={"menu-item"} onClick={() => {
                            CommonService._alert.showToast("Logged out", "success");
                            navigate(CommonService._routeConfig.LoginRoute());
                            dispatch(logout());
                        }}>
                            <ListItemIcon>
                                <Logout fontSize={"small"}/>
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </div>
                    ]
                }/>
            </div>
        </div>
    );

};

export default HeaderComponent;
