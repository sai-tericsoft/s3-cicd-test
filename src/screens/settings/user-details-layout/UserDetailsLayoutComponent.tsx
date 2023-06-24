import "./UserDetailsLayoutComponent.scss";
import {Outlet, useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {CommonService} from "../../../shared/services";
import {IRootReducerState} from "../../../store/reducers";
import React, {useEffect} from "react";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import SubMenuListComponent from "../../../shared/components/sub-menu-list/SubMenuListComponent";
import {getUserBasicDetails} from "../../../store/actions/user.action";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";

interface UserDetailsLayoutComponentProps {

}

const UserDetailsLayoutComponent = (props: UserDetailsLayoutComponentProps) => {
    const {userId} = useParams();
    const dispatch = useDispatch();
    const location: any = useLocation();
    const {currentUser}: any = useSelector((state: IRootReducerState) => state.account);

    const CLIENT_MENU_ITEMS = [
        {
            title: "Personal Details",
            path: currentUser.role === 'admin' ? CommonService._routeConfig.UserPersonalDetails() : CommonService._routeConfig.UserPersonalDetails()
        },
        // {
        //     title: "Chart Notes",
        //     path: userId ? CommonService._routeConfig.MedicalRecordList(userId) + '?referrer=' + location.pathname : ""
        // },
        // {
        //     title: "Documents",
        //     path: userId ? CommonService._routeConfig.ClientDocuments(userId) : ""
        // },
        // {
        //     title: "Insurance",
        //     path: ""
        // },
        // {
        //     title: "Appointments",
        //     path: userId ? CommonService._routeConfig.ClientAppointments(userId) : ""
        // },
        // {
        //     title: "Billing",
        //     path: userId ? CommonService._routeConfig.ClientBillingDetails(userId) : ""
        // }
    ];

    const title = (location.state && location.state.title) ? location.state.title : CLIENT_MENU_ITEMS[0].title;
    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (userId) {
            dispatch(getUserBasicDetails(userId));
        } else {
            dispatch(getUserBasicDetails(currentUser._id));
        }
    }, [userId, dispatch,currentUser]);


    return (
        <>
            <div className={'user-details-screen'}>
                <>
                    {
                        userId && <>
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
                                            <div className={"user-details-basic-card-holder"}>
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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"user-details-sub-menu-holder"}>
                                                <SubMenuListComponent menuItems={CLIENT_MENU_ITEMS}/>
                                            </div>
                                        </div>
                                        <div className="user-details-content-wrapper">
                                            <Outlet/>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }
                </>
            </div>
        </>
    );

};

export default UserDetailsLayoutComponent;