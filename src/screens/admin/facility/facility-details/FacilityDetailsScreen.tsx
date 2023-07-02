import "./FacilityDetailsScreen.scss";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import BasicDetailsCardComponent from "../../../../shared/components/basic-details-card/BasicDetailsCardComponent";
import {IFacility} from "../../../../shared/models/facility.model";
import CardComponent from "../../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../../shared/components/data-label-value/DataLabelValueComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";

interface FacilityDetailsScreenProps {

}

const FacilityDetailsScreen = (props: FacilityDetailsScreenProps) => {

    const {facilityId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [facilityDetails, setFacilityDetails] = useState<IFacility | undefined | any>(undefined);
    const [isFacilityDetailsLoading, setIsFacilityDetailsLoading] = useState<boolean>(false);
    const [isFacilityDetailsLoaded, setIsFacilityDetailsLoaded] = useState<boolean>(false);
    const [isFacilityDetailsLoadingFailed, setIsFacilityDetailsLoadingFailed] = useState<boolean>(false);


    const fetchFacilityDetails = useCallback((facilityId: string) => {
        setIsFacilityDetailsLoading(true);
        CommonService._facility.FacilityDetailsAPICall(facilityId, {})
            .then((response: IAPIResponseType<IFacility>) => {
                console.log(response.data);
                setFacilityDetails(response.data);
                setIsFacilityDetailsLoading(false);
                setIsFacilityDetailsLoaded(true);
                setIsFacilityDetailsLoadingFailed(false);
            }).catch((error: any) => {
            setIsFacilityDetailsLoading(false);
            setIsFacilityDetailsLoaded(false);
            setIsFacilityDetailsLoadingFailed(true);
        })
    }, []);

    useEffect(() => {
        if (facilityId) {
            fetchFacilityDetails(facilityId);
        }
    }, [facilityId, fetchFacilityDetails]);

    useEffect(() => {
        dispatch(setCurrentNavParams(facilityDetails?.name || "Facility", null, () => {
            navigate(CommonService._routeConfig.FacilityList());
        }));
    }, [facilityDetails, navigate, dispatch]);

    return (
        <div className={'service-category-details-screen'}>
            {
                isFacilityDetailsLoading && <LoaderComponent/>
            }
            {
                isFacilityDetailsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch facility details"}/>
            }
            {
                isFacilityDetailsLoaded && <>
                    <div className={"facility-details-card mrg-bottom-20"}>
                        <BasicDetailsCardComponent
                            title={facilityDetails?.name}
                            status={facilityDetails?.is_active}
                            avatarUrl={facilityDetails?.image?.url}
                            subTitle={facilityDetails?.location_details?.title} // TODO
                        ></BasicDetailsCardComponent>
                    </div>
                    <CardComponent title={"Facility Details"}>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={"Facility Name"}>
                                    {facilityDetails?.name || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={"Facility Location"}>
                                    {facilityDetails?.location_details?.title || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent title={"Contact Information"}>
                        <div className={'ts-row'}>
                            <div className={" ts-col-6"}>
                                <FormControlLabelComponent size={"sm"} label={'Primary Phone:'}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-6'}>
                                        <DataLabelValueComponent label={'Phone Type'}>
                                            {facilityDetails?.primary_contact_info?.phone_type_details.title || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-lg-6'}>
                                        <DataLabelValueComponent label={'Phone Number'}>
                                            {CommonService.formatPhoneNumber(facilityDetails?.primary_contact_info?.phone || "N/A")}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </div>
                            <div className="ts-col-6">
                                <FormControlLabelComponent size={"sm"} label={'Primary Email:'}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-12'}>
                                        <DataLabelValueComponent label={'Email'}>
                                            {facilityDetails?.primary_email || 'N/A'}
                                        </DataLabelValueComponent>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className={'ts-row'}>
                            {/*<HorizontalLineComponent/>*/}
                            <div className={'ts-col-6'}>
                                <FormControlLabelComponent size={"sm"} label={'Alternate Phone:'}/>

                                {facilityDetails.secondary_contact_info.map((phone_number: any, index: number) => {
                                    return (<div key={index}>

                                            <div className={'ts-row'}>
                                                <div className={'ts-col-6'}>
                                                    <DataLabelValueComponent label={'Phone Type'}>
                                                        <div>{phone_number?.phone_type_details?.title || "N/A"}</div>
                                                    </DataLabelValueComponent>
                                                </div>
                                                <div className={'ts-col-6'}>
                                                    <DataLabelValueComponent label={'Phone Number'}>
                                                        {CommonService.formatPhoneNumber(phone_number?.phone || 'N/A')}
                                                    </DataLabelValueComponent>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })
                                }
                            </div>
                            <div className={'ts-col-6'}>
                                <FormControlLabelComponent size={"sm"} label={'Alternate Email:'}/>
                                <div className="ts-row">
                                    {facilityDetails.secondary_emails?.map((email: any, index: number) => {
                                        return (<div className={'ts-col-lg-3'} key={index}>
                                                <DataLabelValueComponent label={'Email '}>
                                                    <div>{email || 'N/A'}</div>
                                                </DataLabelValueComponent>
                                            </div>
                                        )
                                    })
                                    }
                                </div>

                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent title={"Address Information"}>
                        <div className={'facility-details-information'}>
                            <DataLabelValueComponent label={'Address'}>
                                {facilityDetails?.address?.address_line}, {facilityDetails?.address?.city},
                                {facilityDetails?.address?.country},{facilityDetails.address?.zip_code}
                            </DataLabelValueComponent>
                        </div>
                    </CardComponent>
                    <CardComponent title={'Operating Hours'} className={'operating-hours-wrapper'}>
                        <div className={'facility-opening-hours-table-wrapper'}>
                            <div className={'column-left'}>
                                <div className={'weeks-days-table-header'}>
                                    <div className={'week-days-timing-wrapper'}>
                                        <div className={'week-days-heading'}>Day of the Week</div>
                                        <div className={'timing-heading'}>Timings</div>
                                    </div>
                                </div>
                                <div className={'weeks-days-table-container'}>
                                    <DataLabelValueComponent direction={'row'} label={"Monday"}>
                                        {facilityDetails.timings[0]?.timings?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[0]?.timings?.start_time) + " - "}{facilityDetails.timings[0]?.timings?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[0]?.timings?.end_time)}
                                        {!(facilityDetails.timings[0]?.timings?.start_time) &&
                                        <span className={'facility-opening-hours-closed-text'}>Closed</span>}
                                    </DataLabelValueComponent>
                                    <HorizontalLineComponent/>

                                    <DataLabelValueComponent direction={'row'} label={"Tuesday"}>
                                        {facilityDetails.timings[1]?.timings?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[1]?.timings?.start_time) + " - "}{facilityDetails.timings[1]?.timings?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[1]?.timings?.end_time)}
                                        {!(facilityDetails.timings[1]?.timings?.start_time) &&
                                        <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                                    </DataLabelValueComponent>
                                    <HorizontalLineComponent/>

                                    <DataLabelValueComponent direction={'row'} label={"Wednesday"}>
                                        {facilityDetails.timings[2]?.timings?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[2]?.timings?.start_time) + " - "}{facilityDetails.timings[2]?.timings?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[2]?.timings?.end_time)}
                                        {!(facilityDetails.timings[2]?.timings?.start_time) &&
                                        <span className={'facility-opening-hours-closed-text'}>Closed</span>}
                                    </DataLabelValueComponent>
                                    <HorizontalLineComponent/>

                                    <DataLabelValueComponent direction={'row'} label={"Thursday"}>
                                        {facilityDetails.timings[3]?.timings?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[3]?.timings?.start_time) + " - "}{facilityDetails.timings[3]?.timings?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[3]?.timings?.end_time)}
                                        {!(facilityDetails.timings[3]?.timings?.start_time) &&
                                        <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                                    </DataLabelValueComponent>
                                </div>
                            </div>
                            <div className={'column-right'}>
                                <div className={'weeks-days-table-header'}>
                                    <div className={'week-days-timing-wrapper'}>
                                        <div className={'week-days-heading'}>Day of the Week</div>
                                        <div className={'timing-heading'}>Timings</div>
                                    </div>
                                </div>
                                <div className={'weeks-days-table-container'}>
                                    <DataLabelValueComponent direction={'row'} label={"Friday"}>
                                        {facilityDetails.timings[4]?.timings?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[4]?.timings?.start_time) + " - "}{facilityDetails.timings[4]?.timings?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[4]?.timings?.end_time)}
                                        {!(facilityDetails.timings[4]?.timings?.start_time) &&
                                        <span className={'facility-opening-hours-closed-text'}>Closed</span>}
                                    </DataLabelValueComponent>
                                    <HorizontalLineComponent/>
                                    <DataLabelValueComponent direction={'row'} label={"Saturday"}>
                                        {facilityDetails.timings[5]?.timings?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[5]?.timings?.start_time) + " - "}{facilityDetails.timings[5]?.timings?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[5]?.timings?.end_time)}
                                        {!(facilityDetails.timings[5]?.timings?.start_time) &&
                                        <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                                    </DataLabelValueComponent>
                                    <HorizontalLineComponent/>
                                    <DataLabelValueComponent direction={'row'} label={"Sunday"}>
                                        {facilityDetails.timings[6]?.timings?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[6]?.timings?.start_time) + " - "}{facilityDetails.timings[6]?.timings?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings[6]?.timings?.end_time)}
                                        {!(facilityDetails.timings[6]?.timings?.start_time) &&
                                        <span className={'facility-opening-hours-closed-text'}>Closed</span>}
                                    </DataLabelValueComponent>
                                    {/*<HorizontalLineComponent/>*/}
                                </div>
                            </div>
                        </div>
                    </CardComponent>

                    {/*<CardComponent title={"Services"}>*/}
                    {/*    <div className={"therapy-and-performance-training-wrapper"}>*/}
                    {/*    <DataLabelValueComponent label={'Therapy Services'}>*/}
                    {/*       <span className={'chip-component'}> <ChipComponent label={'aabba'} color={"success"}/></span>*/}
                    {/*        <ChipComponent label={'Chabbbba'} color={"success"}/>*/}

                    {/*        /!*<div>*!/*/}
                    {/*        /!*    {facilityDetails?.services?.therapy_servicessss?.map((therapy_service: any) => {*!/*/}
                    {/*        /!*        return <div>*!/*/}
                    {/*        /!*            <ChipComponent label={therapy_service}/>*!/*/}
                    {/*        /!*        </div>*!/*/}
                    {/*        /!*    })}*!/*/}
                    {/*        /!*</div>*!/*/}
                    {/*    </DataLabelValueComponent>*/}
                    {/*    <HorizontalLineComponent/>*/}
                    {/*        <DataLabelValueComponent label={'Performance Training'}>*/}
                    {/*        {facilityDetails.services?.okay?.map((ok: any) => {*/}
                    {/*            return <span className={'chip-component'}><ChipComponent label={ok} color={"success"}/></span>*/}
                    {/*        })}*/}
                    {/*    </DataLabelValueComponent>*/}
                    {/*    </div>*/}
                    {/*</CardComponent>*/}
                </>
            }
        </div>
    );

};

export default FacilityDetailsScreen;
