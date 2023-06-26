import "./UserSlotsComponent.scss";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserBasicDetails} from "../../../../store/actions/user.action";
import {useParams} from "react-router-dom";
import {IRootReducerState} from "../../../../store/reducers";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../../shared/components/tabs/TabsComponent";

interface UserSlotsComponentProps {

}

const UserSlotsComponent = (props: UserSlotsComponentProps) => {
    const dispatch = useDispatch();
    const {userId} = useParams();
    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (userId) {
            dispatch(getUserBasicDetails(userId))
        }
    }, [dispatch])

    const handleTabChange = useCallback(() => {

    }, [])

    return (
        <div className={'user-slots-component'}>
            <>
                {
                    isUserBasicDetailsLoading && <div>
                        <LoaderComponent/>
                    </div>
                }
                {
                    isUserBasicDetailsLoadingFailed &&
                    <StatusCardComponent title={"Failed to fetch client Details"}/>
                }
            </>
            {isUserBasicDetailsLoaded &&
            <>
                <TabsWrapperComponent>
                    {userBasicDetails.assigned_facility_details && userBasicDetails?.assigned_facility_details?.map((facilities: any, index: number) => {
                        return <>
                            <div className={'tabs-wrapper'}>
                                <TabsComponent
                                    value={facilities._id}
                                    allowScrollButtonsMobile={false}
                                    variant={"fullWidth"}
                                    onUpdate={handleTabChange}
                                >
                                    <TabComponent className={'client-details-tab'} label={`facility ${index + 1}`}
                                                  value={facilities.name}/>
                                </TabsComponent>
                            </div>
                            <TabContentComponent value={facilities.name} selectedTab={facilities._id}>
                                <div>{facilities.name}</div>
                            </TabContentComponent>
                        </>
                    })

                    }
                </TabsWrapperComponent>
            </>
            }
        </div>
    );

};

export default UserSlotsComponent;