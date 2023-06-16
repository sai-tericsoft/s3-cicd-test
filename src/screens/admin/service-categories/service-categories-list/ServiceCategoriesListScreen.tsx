import "./ServiceCategoriesListScreen.scss";
import {useDispatch} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {IServiceCategory} from "../../../../shared/models/service-category.model";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import CardComponent from "../../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import ServiceCategoryCardComponent
    from "../../../../shared/components/service-category-card/ServiceCategoryCardComponent";
import DrawerComponent from "../../../../shared/components/drawer/DrawerComponent";
import ServiceCategoryAddComponent from "../service-category-add/ServiceCategoryAddComponent";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";

interface ServiceCategoriesListScreenProps {

}

const ServiceCategoriesListScreen = (props: ServiceCategoriesListScreenProps) => {

    const dispatch = useDispatch();
    const [serviceCategoryList, setServiceCategoryList] = useState<IServiceCategory[]>([]);
    const [isServiceCategoryListLoading, setIsServiceCategoryListLoading] = useState<boolean>(false);
    const [isServiceCategoryListLoaded, setIsServiceCategoryListLoaded] = useState<boolean>(false);
    const [isServiceCategoryListLoadingFailed, setIsServiceCategoryListLoadingFailed] = useState<boolean>(false);
    const [isServiceCategoryAddFormOpened, setIsServiceCategoryAddFormOpened] = useState<boolean>(false);

    const fetchServiceCategoryList = useCallback(() => {
        setIsServiceCategoryListLoading(true);
        CommonService._serviceCategory.ServiceCategoryListAPICall({})
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
        fetchServiceCategoryList();
    }, [fetchServiceCategoryList]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Admin"));
    }, [dispatch]);

    const openServiceCategoryAddFormDrawer = useCallback(() => {
        setIsServiceCategoryAddFormOpened(true);
    }, []);

    const closeServiceCategoryAddFormDrawer = useCallback(() => {
        setIsServiceCategoryAddFormOpened(false);
    }, []);

    const handleServiceCategoryAdd = useCallback((serviceCategory: IServiceCategory) => {
        closeServiceCategoryAddFormDrawer();
        console.log(serviceCategory);
        setServiceCategoryList((oldState) => {
            return [serviceCategory, ...oldState];
        })
    }, [closeServiceCategoryAddFormDrawer]);

    return (
        <div className={'service-category-list-screen'}>
            <div className="service-category-list-header">
                <div className="service-category-list-filters">

                </div>
                <div className="service-category-list-options">
                    <ButtonComponent
                        prefixIcon={<ImageConfig.AddIcon/>}
                        onClick={openServiceCategoryAddFormDrawer}
                        id={"sc_add_btn"}
                    >
                        Add Service Category
                    </ButtonComponent>
                </div>
            </div>
            <div className="service-category-list-wrapper">
                <CardComponent className={isServiceCategoryListLoading ? ' card-loading' : ''}>
                    {
                        isServiceCategoryListLoading && <LoaderComponent type={"spinner"}/>
                    }
                    {
                        isServiceCategoryListLoadingFailed &&
                        <StatusCardComponent title={"Failed to fetch service category list"}/>
                    }
                    {
                        isServiceCategoryListLoaded && <>
                            {serviceCategoryList?.length === 0 &&
                                <StatusCardComponent title={"Service category list is empty"}/>}
                            {
                                serviceCategoryList?.length !== 0 && <>
                                    <div className="service-category-list">
                                        <div className="ts-row">
                                            {
                                                serviceCategoryList?.map((serviceCategory) => {
                                                    return <div className="ts-col-lg-3">
                                                        <ServiceCategoryCardComponent serviceCategory={serviceCategory}
                                                                                      key={serviceCategory._id}/>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }

                </CardComponent>

            </div>
            <DrawerComponent isOpen={isServiceCategoryAddFormOpened}
                             showClose={true}
                             closeOnEsc={false}
                             closeOnBackDropClick={true}
                             closeButtonId={"sc_close_btn"}
                             className={"t-side-bar-form service-category-add-form-drawer"}
                             onClose={closeServiceCategoryAddFormDrawer}>
                <ServiceCategoryAddComponent onAdd={handleServiceCategoryAdd}/>
            </DrawerComponent>
        </div>
    );

};

export default ServiceCategoriesListScreen;
