import "./UserDetailsLayoutComponent.scss";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {CommonService} from "../../../shared/services";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import SubMenuListComponent from "../../../shared/components/sub-menu-list/SubMenuListComponent";
import {getUserBasicDetails} from "../../../store/actions/user.action";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig, Misc} from "../../../constants";
import SwitchComponent from "../../../shared/components/form-controls/switch/SwitchComponent";

interface UserDetailsLayoutComponentProps {

}

const UserMenuItemsMapping = {
    "Personal Details": "personal-details",
    "Available Hours & Service": "slots-details",
    "Account Details": "account-details"
}

const AdminMenuItemsMapping = {
    "Personal Details": "user-details",
    "Available Hours & Service": "user-slots-details",
    "Account Details": "user-account-details"
}
const UserDetailsLayoutComponent = (props: UserDetailsLayoutComponentProps) => {

    const dispatch = useDispatch();
    const location: any = useLocation();
    const {currentUser}: any = useSelector((state: IRootReducerState) => state.account);
    const path = location.pathname;
    const navigate = useNavigate();
    const {userId} = useParams();

    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    const USER_MENU_ITEMS = useMemo(() => {
        return [
            {
                title: "Personal Details",
                path: (userId && path.includes('admin')) ? CommonService._routeConfig.UserPersonalDetails(userId) : CommonService._routeConfig.PersonalDetails()
            },
            {
                title: "Available Hours & Service",
                path: (userId && path.includes('admin')) ? CommonService._routeConfig.UserSlotsDetails(userId, userBasicDetails?.assigned_facilities[0]) : CommonService._routeConfig.PersonalSlotsDetails(userBasicDetails?.assigned_facilities[0])
            },
            {
                title: "Account Details",
                path: (userId && path.includes('admin')) ? CommonService._routeConfig.UserAccountDetails(userId) : CommonService._routeConfig.PersonalAccountDetails()
            }
        ];
    }, [userId, path, userBasicDetails]);

    const title = (location.state && location.state.title) ? location.state.title : USER_MENU_ITEMS[0].title;

    const [isUserActive, setIsUserActive] = useState(userBasicDetails?.is_active)

    useEffect(() => {
        if (userId) {
            dispatch(getUserBasicDetails(userId));
            dispatch(setCurrentNavParams('Admin'))
        } else {
            dispatch(getUserBasicDetails(currentUser?._id));
            dispatch(setCurrentNavParams('Settings'))
        }
    }, [dispatch, currentUser, userId]);


    const toggleUserStatus = useCallback(() => {
        setIsUserActive(!userBasicDetails.is_active)
        if (userId) {
            CommonService._user.toggleDeleteUser(userId, {is_active: !userBasicDetails.is_active})
                .then((response: any) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getUserBasicDetails(userId));
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error deleting provider", "error");
            })
        }
    }, [dispatch, userId, userBasicDetails]);

    const deleteUser = useCallback(() => {
        CommonService.onConfirm({
            confirmationTitle: "REMOVE USER",
            image: ImageConfig.ConfirmationLottie,
            showLottie: true,
            confirmationSubTitle: "Are you sure you want to permanently delete this user? This action cannot be undone."
        }).then(() => {
            if (userId) {
                CommonService._user.deleteUser(userId, {})
                    .then((response: any) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        navigate(CommonService._routeConfig.UserList());
                    }).catch((error: any) => {
                    CommonService._alert.showToast(error.error || "Error deleting provider", "error");
                })
            }
        })
    }, [userId, navigate]);

    return (
        <>
            <div className={'user-details-screen'}>
                <>
                    {
                        isUserBasicDetailsLoading && <div>
                            <LoaderComponent/>
                        </div>
                    }
                    {
                        isUserBasicDetailsLoadingFailed &&
                        <StatusCardComponent title={"Failed to fetch user Details"}/>
                    }
                    {
                        (isUserBasicDetailsLoaded && userBasicDetails) && <>
                            <div className={'user-details-layout'}>
                                <div className={"user-details-left-bar"}>
                                    <div className={"user-details-title"}>
                                        {title}
                                    </div>
                                    <div className={'user-basic-detail-card'}>
                                        <div className={'user-basic-detail-card-upper-portion'}>
                                            <div className={'user-image-wrapper'}>
                                                <AvatarComponent
                                                    title={userBasicDetails?.first_name + " " + userBasicDetails?.last_name}/>
                                            </div>
                                        </div>
                                        <div className={'user-details-wrapper'}>
                                            <div className={'user-name'}>
                                                {userBasicDetails?.first_name} {userBasicDetails?.last_name}
                                            </div>
                                            <ChipComponent
                                                label={userBasicDetails?.role}
                                                className={'user-status active'}
                                            />
                                        </div>
                                    </div>
                                    <div className={"user-details-sub-menu-holder"}>
                                        <SubMenuListComponent menuItems={USER_MENU_ITEMS}
                                                              pathIndex={path.includes('admin') ? 4 : 2}
                                                              isExternalHighLight={true}
                                                              listMapping={path.includes('admin') ? AdminMenuItemsMapping : UserMenuItemsMapping}/>
                                    </div>
                                </div>
                                <div className="user-details-content-wrapper">

                                    <div className="user-details-action-buttons">
                                        {path.includes('admin') && <>
                                            <ButtonComponent variant={"outlined"}
                                                             color={"error"}
                                                             className={"mrg-right-10"}
                                                             prefixIcon={<ImageConfig.DeleteIcon/>}
                                                             onClick={deleteUser}
                                            >
                                                Delete User Permanently
                                            </ButtonComponent>
                                            <div className={'h-v-center'}>
                                                <div className={'status-heading'}>Status:</div>
                                                <SwitchComponent
                                                    name={'is_active'}
                                                    checked={isUserActive}
                                                    label={isUserActive ? "Active" : "Inactive"}
                                                    labelPlacement={'start'}
                                                    onChange={toggleUserStatus}
                                                />
                                            </div>
                                        </>
                                        }

                                    </div>
                                    <div
                                        className={path.includes('admin') ? 'user-details-wrapper' : 'user-details-wrapper mrg-top-55'}>
                                        <Outlet/>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </>
            </div>
        </>
    );

};

export default UserDetailsLayoutComponent;
