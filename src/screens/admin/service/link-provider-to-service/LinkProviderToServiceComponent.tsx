import "./LinkProviderToServiceComponent.scss";
import {useNavigate, useParams} from "react-router-dom";
import PageHeaderComponent from "../../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useState} from "react";
import {IService} from "../../../../shared/models/service.model";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import BasicDetailsCardComponent from "../../../../shared/components/basic-details-card/BasicDetailsCardComponent";
import {APIConfig} from "../../../../constants";
import AutoCompleteDropdownComponent
    from "../../../../shared/components/form-controls/auto-complete/AutoCompleteComponent";
import ServiceSlotsComponent from "../service-slots/ServiceSlotsComponent";

interface LinkProviderToServiceComponentProps {

}

const LinkProviderToServiceComponent = (props: LinkProviderToServiceComponentProps) => {
    const {serviceId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [serviceDetails, setServiceDetails] = useState<IService | undefined>(undefined);
    const [isServiceDetailsLoading, setIsServiceDetailsLoading] = useState<boolean>(false);
    const [isServiceDetailsLoaded, setIsServiceDetailsLoaded] = useState<boolean>(false);
    const [isServiceDetailsLoadingFailed, setIsServiceDetailsLoadingFailed] = useState<boolean>(false);
    const [selectedProviderIDForLinking, setSelectedProviderIDForLinking] = useState<any>(undefined);

    const fetchServiceDetails = useCallback((serviceId: string) => {
        setIsServiceDetailsLoading(true);
        CommonService._serviceCategory.ServiceDetailsAPICall(serviceId, {})
            .then((response: IAPIResponseType<IService>) => {
                setServiceDetails(response.data);
                setIsServiceDetailsLoading(false);
                setIsServiceDetailsLoaded(true);
                setIsServiceDetailsLoadingFailed(false);
            }).catch((error: any) => {
            setIsServiceDetailsLoading(false);
            setIsServiceDetailsLoaded(false);
            setIsServiceDetailsLoadingFailed(true);
        })
    }, []);

    useEffect(() => {
        if (serviceId) {
            fetchServiceDetails(serviceId);
        }
    }, [serviceId, fetchServiceDetails]);

    useEffect(() => {
        dispatch(setCurrentNavParams(serviceDetails?.name || "Service", null, () => {
            if (serviceId) {
                navigate(CommonService._routeConfig.ServiceDetails(serviceId));
            }
        }));
    }, [navigate, serviceDetails, dispatch, serviceId]);

    return (
        <div className={'link-provider-to-service-component'}>
            <PageHeaderComponent title={"LINK PROVIDER"}/>
            {
                isServiceDetailsLoading && <LoaderComponent/>
            }
            {
                isServiceDetailsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch service details"}/>
            }
            {
                isServiceDetailsLoaded && serviceDetails && <>
                    <div className={"service-details-card"}>
                        <BasicDetailsCardComponent
                            title={serviceDetails?.name}
                            status={serviceDetails?.is_active}
                            avatarUrl={serviceDetails?.image?.url}
                            subTitle={serviceDetails?.description}
                        ></BasicDetailsCardComponent>
                    </div>
                    <div className={'ts-row'}>
                        <div className={'ts-col-sm-12 ts-col-md-6'}>
                            <AutoCompleteDropdownComponent
                                label={"Providers"}
                                placeholder={"Search for provider by name"}
                                searchMode={"serverSide"}
                                value={selectedProviderIDForLinking}
                                url={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.URL(serviceDetails._id)}
                                method={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.METHOD}
                                dataListKey={"data"}
                                multiple={false}
                                displayWith={item => item ? (item.first_name || "") + " " + (item.last_name || "") : ""}
                                // valueExtractor={item => item ? item._id : ""}
                                onUpdate={(value) => {
                                    setSelectedProviderIDForLinking(value);
                                }}
                            />
                        </div>
                    </div>
                    <ServiceSlotsComponent userId={selectedProviderIDForLinking?._id} serviceId={serviceId}/>
                </>
            }
        </div>
    );

};

export default LinkProviderToServiceComponent;
