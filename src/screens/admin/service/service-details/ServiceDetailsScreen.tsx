import "./ServiceDetailsScreen.scss";
import {useCallback, useEffect, useState} from "react";
import {IService} from "../../../../shared/models/service-category.model";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import BasicDetailsCardComponent from "../../../../shared/components/basic-details-card/BasicDetailsCardComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import LinkComponent from "../../../../shared/components/link/LinkComponent";

interface ServiceDetailsScreenProps {

}

const ServiceDetailsScreen = (props: ServiceDetailsScreenProps) => {

    const {serviceId} = useParams();
    const dispatch = useDispatch();
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
        dispatch(setCurrentNavParams(serviceDetails?.name || "Service", null, true));
    }, [serviceDetails, dispatch]);

    return (
        <div className={'service-category-details-screen'}>
            {
                isServiceDetailsLoading && <div>Loading</div>
            }
            {
                isServiceDetailsLoadingFailed && <div>Loading Failed</div>
            }
            {
                isServiceDetailsLoaded && <>
                    <div className={"service-category-details-card"}>
                        <BasicDetailsCardComponent
                            legend={serviceDetails?.category?.name}
                            title={serviceDetails?.name}
                            status={serviceDetails?.is_active}
                            avatarUrl={serviceDetails?.image?.url}
                            subTitle={serviceDetails?.description}
                            actions={<>
                                {(serviceDetails?.category_id && serviceId)&&
                                    <LinkComponent
                                        route={CommonService._routeConfig.ServiceEdit(serviceDetails?.category_id, serviceId)}>
                                        <ButtonComponent
                                            prefixIcon={<ImageConfig.EditIcon/>}
                                        >
                                            Edit Details
                                        </ButtonComponent>
                                    </LinkComponent>
                                }
                            </>}
                        ></BasicDetailsCardComponent>
                    </div>
                </>
            }
        </div>
    );

};

export default ServiceDetailsScreen;