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
        dispatch(setCurrentNavParams(facilityDetails?.name || "Facility", null, ()=>{
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
                            // @ts-ignore
                            subTitle={facilityDetails?.location?.title} // TODO
                        ></BasicDetailsCardComponent>
                    </div>
                    <CardComponent title={"Facility Details"}>
                        <div className={'facility-details-information'}>
                            <DataLabelValueComponent label={"Facility Name"}>
                                {facilityDetails?.name}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'facility-details-information'}>
                            <DataLabelValueComponent label={"Facility Location"}>
                                {facilityDetails?.location?.title}
                            </DataLabelValueComponent>
                        </div>
                    </CardComponent>
                    <CardComponent title={"Contact Information"}>

                        <FormControlLabelComponent label={'Phone 1:'}/>
                        <div className={'facility-details-information'}>
                            <DataLabelValueComponent label={'Phone Type(Primary)'}>
                                {facilityDetails?.primary_contact_info?.phone_type.title}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'facility-details-information'}>
                            <DataLabelValueComponent label={'Phone Number'}>
                                {facilityDetails?.primary_contact_info?.phone}
                            </DataLabelValueComponent>
                        </div>
                        <HorizontalLineComponent/>

                        {facilityDetails.secondary_contact_info.map((phone_number: any, index: number) => {
                            return (<div key={index}>
                                    <FormControlLabelComponent label={'Phone ' + (index + 2) + ":"}/>
                                    <div className={'facility-details-information'}>
                                        <DataLabelValueComponent label={'Phone Type'}>
                                            <div>{phone_number?.phone_type?.title}</div>
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'facility-details-information'}>
                                        <DataLabelValueComponent label={'Phone Number'}>
                                            {phone_number?.phone}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            )
                        })
                        }
                        <div className={'facility-details-information'}>
                            <DataLabelValueComponent label={'Email 1:'}>
                                {facilityDetails?.primary_email}
                            </DataLabelValueComponent>
                        </div>
                        <HorizontalLineComponent/>
                        {facilityDetails.secondary_emails?.map((email: any, index: number) => {
                            return (<div className={'facility-details-information'} key={index}>
                                    <DataLabelValueComponent label={'Email ' + (index + 2 + ":")}>
                                        <div>{email}</div>
                                    </DataLabelValueComponent>
                                </div>
                            )
                        })
                        }
                    </CardComponent>
                    <CardComponent title={"Opening Hours"}>
                        <div className={"facility-opening-hours"}>
                            <DataLabelValueComponent label={"Mon"}>
                                {facilityDetails.timings?.mon?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.mon?.start_time) + " - "}{facilityDetails.timings?.mon?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.mon?.end_time)}
                                {!(facilityDetails.timings?.mon?.start_time) &&
                                    <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                            </DataLabelValueComponent>
                            <DataLabelValueComponent label={"Tue"}>
                                {facilityDetails.timings?.tue?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.tue?.start_time) + " - "}{facilityDetails.timings?.tue?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.tue?.end_time)}
                                {!(facilityDetails.timings?.tue?.start_time) &&
                                    <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                            </DataLabelValueComponent>
                            <DataLabelValueComponent label={"Wed"}>
                                {facilityDetails.timings?.wed?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.wed?.start_time) + " - "}{facilityDetails.timings?.wed?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.wed?.end_time)}
                                {!(facilityDetails.timings?.wed?.start_time) &&
                                    <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                            </DataLabelValueComponent>
                            <DataLabelValueComponent label={"Thu"}>
                                {facilityDetails.timings?.thu?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.thu?.start_time) + " - "}{facilityDetails.timings?.thu?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.thu?.end_time)}
                                {!(facilityDetails.timings?.thu?.start_time) &&
                                    <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                            </DataLabelValueComponent>
                            <DataLabelValueComponent label={"Fri"}>
                                {facilityDetails.timings?.fri?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.fri?.start_time) + " - "}{facilityDetails.timings?.fri?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.fri?.end_time)}
                                {!(facilityDetails.timings?.fri?.start_time) &&
                                    <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                            </DataLabelValueComponent>
                            <DataLabelValueComponent label={"Sat"}>
                                {facilityDetails.timings?.sat?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.sat?.start_time) + " - "}{facilityDetails.timings?.sat?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.sat?.end_time)}
                                {!(facilityDetails.timings?.sat?.start_time) &&
                                    <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                            </DataLabelValueComponent>
                            <DataLabelValueComponent label={"Sun"}>
                                {facilityDetails.timings?.sun?.start_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.sun?.start_time) + " - "}{facilityDetails.timings?.sun?.end_time && CommonService.getHoursAndMinutesFromMinutes(facilityDetails.timings.sun?.end_time)}
                                {!(facilityDetails.timings?.sun?.start_time) &&
                                    <span className={'facility-opening-hours-closed-text'}>Closed</span>}

                            </DataLabelValueComponent>
                        </div>
                    </CardComponent>
                    <CardComponent title={"Address Information"}>
                        <div className={'facility-details-information'}>
                            <DataLabelValueComponent label={'Address'}>
                                {facilityDetails?.address?.address_line},{facilityDetails?.address?.city}<br/>
                                {facilityDetails.address?.zip_code},{facilityDetails?.address?.country}
                            </DataLabelValueComponent>
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