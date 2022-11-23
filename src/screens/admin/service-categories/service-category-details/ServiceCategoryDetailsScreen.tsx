import "./ServiceCategoryDetailsScreen.scss";
import {useCallback, useEffect, useState} from "react";
import {IServiceCategory} from "../../../../shared/models/service-category.model";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import BasicDetailsCardComponent from "../../../../shared/components/basic-details-card/BasicDetailsCardComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";

interface ServiceCategoryDetailsScreenProps {

}

const ServiceCategoryDetailsScreen = (props: ServiceCategoryDetailsScreenProps) => {

    const {serviceCategoryId} = useParams();
    const dispatch = useDispatch();
    const [serviceCategoryDetails, setServiceCategoryDetails] = useState<IServiceCategory | undefined>(undefined);
    const [isServiceCategoryDetailsLoading, setIsServiceCategoryDetailsLoading] = useState<boolean>(false);
    const [isServiceCategoryDetailsLoaded, setIsServiceCategoryDetailsLoaded] = useState<boolean>(false);
    const [isServiceCategoryDetailsLoadingFailed, setIsServiceCategoryDetailsLoadingFailed] = useState<boolean>(false);

    const fetchServiceCategoryDetails = useCallback((serviceCategoryId: string) => {
        setIsServiceCategoryDetailsLoading(true);
        CommonService._serviceCategory.ServiceCategoryDetailsAPICall(serviceCategoryId, {})
            .then((response: IAPIResponseType<IServiceCategory>) => {
                setServiceCategoryDetails(response.data);
                setIsServiceCategoryDetailsLoading(false);
                setIsServiceCategoryDetailsLoaded(true);
                setIsServiceCategoryDetailsLoadingFailed(false);
            }).catch((error: any) => {
            setIsServiceCategoryDetailsLoading(false);
            setIsServiceCategoryDetailsLoaded(false);
            setIsServiceCategoryDetailsLoadingFailed(true);
        })
    }, []);

    useEffect(() => {
        if (serviceCategoryId) {
            fetchServiceCategoryDetails(serviceCategoryId);
        }
    }, [serviceCategoryId, fetchServiceCategoryDetails]);

    useEffect(() => {
        dispatch(setCurrentNavParams(serviceCategoryDetails?.name || "Service Category", null, true));
    }, [serviceCategoryDetails, dispatch]);

    return (
        <div className={'service-category-details-screen'}>
            {
                isServiceCategoryDetailsLoading && <div>Loading</div>
            }
            {
                isServiceCategoryDetailsLoadingFailed && <div>Loading Failed</div>
            }
            {
                isServiceCategoryDetailsLoaded && <>
                    <div className={"service-category-details-card"}>
                        <BasicDetailsCardComponent
                            title={serviceCategoryDetails?.name}
                            status={serviceCategoryDetails?.is_active}
                            avatarUrl={serviceCategoryDetails?.image_url}
                            subTitle={serviceCategoryDetails?.description}
                            actions={<>
                                <ButtonComponent
                                    prefixIcon={<ImageConfig.EditIcon/>}
                                >
                                    Edit Details
                                </ButtonComponent>
                            </>}
                        ></BasicDetailsCardComponent>
                    </div>
                </>
            }
        </div>
    );

};

export default ServiceCategoryDetailsScreen;