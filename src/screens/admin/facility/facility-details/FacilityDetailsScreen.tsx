import "./FacilityDetailsScreen.scss";
import {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import BasicDetailsCardComponent from "../../../../shared/components/basic-details-card/BasicDetailsCardComponent";
import {IFacility} from "../../../../shared/models/facility.model";
import CardComponent from "../../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../../shared/components/data-label-value/DataLabelValueComponent";

interface FacilityDetailsScreenProps {

}

const FacilityDetailsScreen = (props: FacilityDetailsScreenProps) => {

    const {facilityId} = useParams();
    const dispatch = useDispatch();
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
        dispatch(setCurrentNavParams(facilityDetails?.name || "Facility", null, true));
    }, [facilityDetails, dispatch]);

    return (
        <div className={'service-category-details-screen'}>
            {
                isFacilityDetailsLoading && <div>Loading</div>
            }
            {
                isFacilityDetailsLoadingFailed && <div>Loading Failed</div>
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
                        Coming Soon
                    </CardComponent>
                    <CardComponent title={"Contact Information"}>
                        Coming Soon
                    </CardComponent>
                    <CardComponent title={"Opening Hours"}>
                        Coming Soon
                        {/*<div className={"facility-opening-hours"}>*/}
                        {/*    <DataLabelValueComponent label={"Mon"}>*/}
                        {/*        7:00 am - 6:00 pm*/}
                        {/*    </DataLabelValueComponent>*/}
                        {/*    <DataLabelValueComponent label={"Mon"}>*/}
                        {/*        7:00 am - 6:00 pm*/}
                        {/*    </DataLabelValueComponent>*/}
                        {/*</div>*/}
                    </CardComponent>
                    <CardComponent title={"Address Information"}>
                        Coming Soon
                    </CardComponent>
                    <CardComponent title={"Services"}>
                        Coming Soon
                    </CardComponent>
                </>
            }
        </div>
    );

};

export default FacilityDetailsScreen;