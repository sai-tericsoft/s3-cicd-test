import "./UserSlotsDetailsComponent.scss";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {getUserSlots} from "../../../store/actions/user.action";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";

interface UserSlotsDetailsComponentProps {

}


const UserSlotsDetailsComponent = (props: UserSlotsDetailsComponentProps) => {

    const {
        isUserBasicDetailsLoaded,
        userBasicDetails,

        userSlots,
        isUserSlotsLoading,
        isUserSlotsLoaded,
        isUserSlotsLoadingFailed,

    } = useSelector((state: IRootReducerState) => state.user);


    const location: any = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState<string>(userBasicDetails?.assigned_facilities[0] || '');
    const {facilityId} = useParams()


    useEffect(() => {
        if (path.includes('admin')) {
            dispatch(setCurrentNavParams('User List', null, () => {
                navigate(CommonService._routeConfig.UserList());
            }));
        }
    }, [dispatch, userBasicDetails, navigate, path]);

    useEffect(() => {
        if (facilityId) {
            setCurrentTab(facilityId);
        }
    }, [facilityId]);

    useEffect(() => {
        if (currentTab && userBasicDetails._id) {
            dispatch(getUserSlots(userBasicDetails._id, currentTab));
        }
    }, [dispatch, userBasicDetails._id, currentTab]);

    const handleTabChange = useCallback((e: any, value: any) => {
        setCurrentTab(value);
        dispatch(getUserSlots(userBasicDetails._id, value))
    }, [dispatch, userBasicDetails]);

    return (
        <div className={'user-slots-details-component'}>
            {/*<>*/}
            {/*    {isUserBasicDetailsLoading && (*/}
            {/*        <div>*/}
            {/*            <LoaderComponent/>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*    {isUserBasicDetailsLoadingFailed && (*/}
            {/*        <StatusCardComponent title={"Failed to fetch client Details"}/>*/}
            {/*    )}*/}
            {/*</>*/}
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
                                <TabComponent className={'client-details-tab'} label={facility.name}
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
                            {isUserSlotsLoading && (
                                <div>
                                    <LoaderComponent/>
                                </div>
                            )}
                            {isUserSlotsLoadingFailed && (
                                <StatusCardComponent title={"Failed to fetch client Details"}/>
                            )}
                            <>

                                {isUserSlotsLoaded &&
                                    <>
                                        {((userSlots && userSlots?.all_scheduled_slots?.length) || (userSlots?.day_scheduled_slots?.length)) &&
                                            <>
                                                <CardComponent title={'Available Hours and Service'}
                                                               actions={<LinkComponent
                                                                   route={path.includes('settings') ? CommonService._user.NavigateToSettingsSlotsEdit(userBasicDetails._id, currentTab) : CommonService._user.NavigateToUserSlotsEdit(userBasicDetails._id, currentTab)}>
                                                                   <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                                                    size={"small"}>
                                                                       Edit
                                                                   </ButtonComponent>
                                                               </LinkComponent>
                                                               }>

                                                    <>

                                                        {/*{userSlots.is_same_slots &&*/}
                                                        {/*    <div className='same-for-all-details-title'>Same for all days</div>}*/}
                                                        <div className='slots-timings-table-view-wrapper'>
                                                            {userSlots.is_same_slots && <>
                                                                <div className={'ts-row slot-header'}>
                                                                    <div className={'ts-col-2 mrg-top-15 mrg-left-20'}>
                                                                        Day
                                                                    </div>
                                                                    <div className={'ts-col-3 mrg-top-15 mrg-left-25'}>
                                                                        Time Slot
                                                                    </div>
                                                                    <div className={'mrg-top-15'}>
                                                                        Service
                                                                    </div>
                                                                </div>

                                                                {
                                                                    facility?.timings?.map((day: any) => {
                                                                        return (
                                                                            <>
                                                                                <div
                                                                                    className='ts-row slots-timings-row-wrapper'
                                                                                    key={`row-${day}`}>
                                                                                    <div
                                                                                        className={'ts-col-2 mrg-top-10 mrg-bottom-10 pdd-left-20'}>
                                                                                        {day.day_name}
                                                                                    </div>
                                                                                    <div className="ts-col-10">
                                                                                        {
                                                                                            userSlots?.all_scheduled_slots?.map((filteredSlot: any, index: number) => (
                                                                                                <div
                                                                                                    className='ts-row slots-timings-sub-row-wrapper'
                                                                                                    key={`slot-${day}-${index}`}>
                                                                                                    <div
                                                                                                        className='ts-col-3 mrg-left-15 mrg-top-10'>
                                                                                                        {CommonService.getHoursAndMinutesFromMinutes(filteredSlot.start_time)} - {CommonService.getHoursAndMinutesFromMinutes(filteredSlot.end_time)}
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className='ts-col-5 mrg-left-50 mrg-top-10'>
                                                                                                        {filteredSlot?.service_details?.name}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <HorizontalLineComponent
                                                                                    key={`line-${day}`}/>
                                                                            </>
                                                                        );
                                                                    })
                                                                }


                                                            </>

                                                            }
                                                            {!userSlots.is_same_slots &&
                                                                <>
                                                                    <div className={'ts-row slot-header'}>
                                                                        <div
                                                                            className={'ts-col-3 mrg-top-15 mrg-left-15'}>
                                                                            Day
                                                                        </div>
                                                                        <div className={'ts-col-3 mrg-top-15'}>
                                                                            Time Slot
                                                                        </div>
                                                                        <div className={'mrg-top-15'}>
                                                                            Service
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        userSlots?.day_scheduled_slots?.length && userSlots.day_scheduled_slots.map((slot: any, index: number) => {
                                                                            return (
                                                                                <div
                                                                                    className='ts-row slots-timings-row-wrapper'>
                                                                                    <div
                                                                                        className="ts-col-2 pdd-left-20">{slot.day_name}</div>

                                                                                    <div className="ts-col-10">
                                                                                        <>
                                                                                            {slot.slot_timings.length &&
                                                                                                slot.slot_timings.map((slot_timing: any, index: number) => {
                                                                                                    console.log('slot', slot_timing);
                                                                                                    return (<div
                                                                                                        className='ts-row slots-timings-sub-row-wrapper'>
                                                                                                        <div
                                                                                                            className='ts-col-3 mrg-left-55 '>
                                                                                                            {CommonService.getHoursAndMinutesFromMinutes(slot_timing.start_time)} - {CommonService.getHoursAndMinutesFromMinutes(slot_timing.end_time)}
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className='ts-col-5 mrg-left-55'>{slot_timing?.service_details?.name}</div>
                                                                                                    </div>)
                                                                                                })}
                                                                                        </>

                                                                                    </div>
                                                                                    {index !== userSlots.day_scheduled_slots?.length - 1 &&
                                                                                        <HorizontalLineComponent
                                                                                            className={'divider'}/>
                                                                                    }

                                                                                </div>
                                                                            )

                                                                        })

                                                                    }

                                                                </>
                                                            }

                                                        </div>
                                                    </>
                                                </CardComponent>
                                            </>
                                        }

                                        {(userSlots && !userSlots?.all_scheduled_slots?.length && !userSlots?.day_scheduled_slots?.length) &&
                                            <div className={'no-slots-wrapper'}>
                                                <CardComponent title={'Available Hours & Services'}>
                                                    <StatusCardComponent
                                                        title={'No Service have been designated for this facility.'}/>
                                                </CardComponent>
                                            </div>
                                        }

                                    </>
                                }
                            </>
                        </TabContentComponent>
                    ))}
                </TabsWrapperComponent>
            </>
            }
        </div>
    );

};

export default UserSlotsDetailsComponent;
