import "./ServiceDetailsScreen.scss";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import BasicDetailsCardComponent from "../../../../shared/components/basic-details-card/BasicDetailsCardComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import ServiceConsultationDetailsComponent from "../service-consultation-details/ServiceConsultationDetailsComponent";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import {IService} from "../../../../shared/models/service.model";
import ServiceProviderListComponent from "../service-provider-list/ServiceProviderListComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";

interface ServiceDetailsScreenProps {

}

const ServiceDetailsScreen = (props: ServiceDetailsScreenProps) => {

    const {serviceId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serviceDetails, setServiceDetails] = useState<IService | undefined>(undefined);
    const [isServiceDetailsLoading, setIsServiceDetailsLoading] = useState<boolean>(false);
    const [isServiceDetailsLoaded, setIsServiceDetailsLoaded] = useState<boolean>(false);
    const [isServiceDetailsLoadingFailed, setIsServiceDetailsLoadingFailed] = useState<boolean>(false);

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
            if (serviceDetails?.category_id) {
                navigate(CommonService._routeConfig.ServiceCategoryDetails(serviceDetails?.category_id));
            }
        }));
    }, [navigate, serviceDetails, dispatch]);

    const handleEdit = useCallback((categoryId: any) => {
        if (serviceId && categoryId) {
            navigate(CommonService._routeConfig.ServiceEdit(categoryId, serviceId));
        }
    }, [navigate, serviceId]);

    return (
        <div className={'service-details-screen'}>
            {
                isServiceDetailsLoading && <LoaderComponent/>
            }
            {
                isServiceDetailsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch service details"}/>
            }
            {
                isServiceDetailsLoaded && <>
                    <FormControlLabelComponent label={' View Service Details'} size={'xl'}/>
                    <div className={"service-details-card"}>
                        <BasicDetailsCardComponent
                            legend={serviceDetails?.category?.name}
                            title={serviceDetails?.name}
                            status={serviceDetails?.is_active}
                            avatarUrl={serviceDetails?.image?.url}
                            subTitle={serviceDetails?.description}
                            actions={<>
                                {(serviceDetails?.category_id && serviceId) &&
                                    <ButtonComponent
                                        prefixIcon={<ImageConfig.EditIcon/>}
                                        onClick={() => handleEdit(serviceDetails?.category_id)}
                                        variant={"outlined"}
                                        id={"sv_edit_btn"}
                                    >
                                        Edit Details
                                    </ButtonComponent>

                                }
                            </>}
                        ></BasicDetailsCardComponent>
                    </div>
                    <div className="service-consultation-details">
                        {
                            serviceDetails && <ServiceConsultationDetailsComponent
                                serviceDetails={serviceDetails}/>
                        }
                    </div>
                    <div className="service-providers-details">
                        {
                            (serviceDetails && serviceId) && <ServiceProviderListComponent
                                serviceId={serviceId}
                                serviceDetails={serviceDetails}/>
                        }
                    </div>
                </>
            }

        </div>
    );

};

export default ServiceDetailsScreen;
