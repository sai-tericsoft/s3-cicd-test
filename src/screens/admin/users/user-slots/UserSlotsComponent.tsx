import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserBasicDetails} from "../../../../store/actions/user.action";
import {useParams} from "react-router-dom";
import {IRootReducerState} from "../../../../store/reducers";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent,
} from "../../../../shared/components/tabs/TabsComponent";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";

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
        const [currentTab, setCurrentTab] = useState<any>(userBasicDetails?.assigned_facility_details[0]?._id || '');
        useEffect(() => {
            if (userId) {
                dispatch(getUserBasicDetails(userId));
            }
        }, [dispatch, userId]);

        const handleTabChange = useCallback((e: any, value: any) => {
            // searchParams.set("currentStep", value);
            // setSearchParams(searchParams);
            setCurrentTab(value);
        }, []);

        return (
            <div className="user-slots-component">
                <>
                    {isUserBasicDetailsLoading && (
                        <div>
                            <LoaderComponent/>
                        </div>
                    )}
                    {isUserBasicDetailsLoadingFailed && (
                        <StatusCardComponent title={"Failed to fetch client Details"}/>
                    )}
                </>
                {isUserBasicDetailsLoaded && <>
                    <TabsWrapperComponent>
                        <div className="tabs-wrapper">
                            <TabsComponent
                                value={currentTab}
                                allowScrollButtonsMobile={false}
                                variant={"fullWidth"}
                                onUpdate={handleTabChange}
                            >
                                {userBasicDetails.assigned_facility_details.map((facility: any, index: any) => (
                                    <TabComponent className={'client-details-tab'} label={`facility${index + 1}`}
                                                  value={facility._id}/>
                                ))}
                            </TabsComponent>
                        </div>

                        {userBasicDetails?.assigned_facility_details.map((facility: any, index: any) => (
                            <TabContentComponent
                                key={facility._id}
                                value={facility._id}
                                selectedTab={currentTab}
                            >
                                <CardComponent title={'Available Hours and Service'}>
                                    <FormControlLabelComponent label={facility.name}/>

                                    
                                </CardComponent>
                                {/*<div>{facility.name}</div>*/}
                                {/*<div>Location: {facility.location}</div>*/}
                                {/*<div>Timings:</div>*/}
                            </TabContentComponent>
                        ))}
                    </TabsWrapperComponent>
                </>
                }
            </div>
        )
            ;
    }
;

export default UserSlotsComponent;
