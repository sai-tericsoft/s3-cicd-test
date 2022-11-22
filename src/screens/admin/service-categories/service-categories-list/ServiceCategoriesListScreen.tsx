import "./ServiceCategoriesListScreen.scss";
import {useDispatch} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {IServiceCategory} from "../../../../shared/models/service-category.model";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import CardComponent from "../../../../shared/components/card/CardComponent";
import {NavLink} from "react-router-dom";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";

interface ServiceCategoriesListScreenProps {

}

const ServiceCategoriesListScreen = (props: ServiceCategoriesListScreenProps) => {

    const dispatch = useDispatch();
    const [serviceCategoryList, setServiceCategoryList] = useState<IServiceCategory[]>([]);
    const [isServiceCategoryListLoading, setIsServiceCategoryListLoading] = useState<boolean>(false);
    const [isServiceCategoryListLoaded, setIsServiceCategoryListLoaded] = useState<boolean>(false);
    const [isServiceCategoryListLoadingFailed, setIsServiceCategoryListLoadingFailed] = useState<boolean>(false);

    const fetchServiceCategoryList = useCallback(() => {
        setIsServiceCategoryListLoading(true);
        CommonService._serviceCategory.ServiceCategoryAPICall({})
            .then((response: IAPIResponseType<IServiceCategory[]>) => {
                setServiceCategoryList(response.data);
                setIsServiceCategoryListLoading(false);
                setIsServiceCategoryListLoaded(true);
                setIsServiceCategoryListLoadingFailed(false);
            }).catch((error: any) => {
            setIsServiceCategoryListLoading(false);
            setIsServiceCategoryListLoaded(false);
            setIsServiceCategoryListLoadingFailed(true);
        })
    }, []);


    useEffect(() => {
        dispatch(setCurrentNavParams("Admin"));
    }, [dispatch]);

    useEffect(() => {
        fetchServiceCategoryList();
    }, [fetchServiceCategoryList]);

    return (
        <div className={'service-category-list-screen'}>
            <div className="service-category-list-header">
                <div className="service-category-list-title">
                    Service Category
                </div>
                <div className="service-category-list-options">
                    <ButtonComponent
                        prefixIcon={<ImageConfig.AddIcon/>}
                    >
                        Add Service Category
                    </ButtonComponent>
                </div>
            </div>
            <div className="service-category-list-wrapper">
                {
                    isServiceCategoryListLoading && <div>Loading</div>
                }
                {
                    isServiceCategoryListLoadingFailed && <div>Loading Failed</div>
                }
                {
                    isServiceCategoryListLoaded && <>
                        {serviceCategoryList?.length === 0 && <div>List is empty</div>}
                        {
                            serviceCategoryList?.length !== 0 && <>
                                <CardComponent>
                                    <div className="service-category-list">
                                        {
                                            serviceCategoryList?.map((serviceCategory) => {
                                                return <div
                                                    className={`service-category-card ${serviceCategory.is_active ? "active" : "inactive"}`}>
                                                    <div className="service-category-poster"
                                                         style={{backgroundImage: "url('" + serviceCategory?.image_url + "')"}}
                                                    />
                                                    <div className="service-category-details">
                                                        <div className="service-category-name">
                                                            {serviceCategory?.name || "-"}
                                                        </div>
                                                        <div className="service-category-extra-details">
                                                            <div className="service-category-service-count">
                                                                {serviceCategory?.services_count || 0} Services
                                                            </div>
                                                            <div className="service-category-separator"/>
                                                            <div
                                                                className={`service-category-status `}>
                                                                {serviceCategory.is_active ? "Active" : "Inactive"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <NavLink to={CommonService._routeConfig.ComingSoonRoute()}>
                                                        <div className="service-category-view-details">
                                                            View Details
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            })
                                        }
                                    </div>
                                </CardComponent>
                            </>
                        }
                    </>
                }
            </div>
        </div>
    );

};

export default ServiceCategoriesListScreen;