import "./UserDetailsLayoutComponent.scss";
import {Outlet, useLocation, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {CommonService} from "../../../shared/services";
import {IRootReducerState} from "../../../store/reducers";
import React, {useEffect, useState} from "react";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import SubMenuListComponent from "../../../shared/components/sub-menu-list/SubMenuListComponent";
import {getUserBasicDetails} from "../../../store/actions/user.action";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";

interface UserDetailsLayoutComponentProps {

}

const UserDetailsLayoutComponent = (props: UserDetailsLayoutComponentProps) => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const location: any = useLocation();
    const {currentUser}: any = useSelector((state: IRootReducerState) => state.account);
    const [userId, setUserId] = useState<string>("")

    const USER_MENU_ITEMS = [
        {
            title: "Personal Details",
            path: userId ? CommonService._routeConfig.UserPersonalDetails() + '?userId=' + userId : CommonService._routeConfig.PersonalDetails()
        },
        {
            title: "Available Hours & Service",
            path: ""
        },
        {
            title: "Account Details",
            path: ""
        }
    ];

    const title = (location.state && location.state.title) ? location.state.title : USER_MENU_ITEMS[0].title;

    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        const userId: any = searchParams.get("userId");
        if (userId) {
            setUserId(userId);
            dispatch(getUserBasicDetails(userId));
            dispatch(setCurrentNavParams('Admin'))
        } else {
            dispatch(getUserBasicDetails(currentUser?._id));
            dispatch(setCurrentNavParams('Settings'))
            // setUserId(currentUser._id);
        }
    }, [searchParams, dispatch, currentUser]);

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
                                        <SubMenuListComponent menuItems={USER_MENU_ITEMS}/>
                                    </div>
                                </div>
                                <div className="user-details-content-wrapper">
                                    <Outlet/>
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