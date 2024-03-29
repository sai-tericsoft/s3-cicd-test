import "./ServiceCategoryDetailsScreen.scss";
import React, {useCallback, useEffect, useState} from "react";
import {IServiceCategory} from "../../../../shared/models/service-category.model";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import BasicDetailsCardComponent from "../../../../shared/components/basic-details-card/BasicDetailsCardComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import DrawerComponent from "../../../../shared/components/drawer/DrawerComponent";
import ServiceCategoryEditComponent from "../service-category-edit/ServiceCategoryEditComponent";
import ServiceListComponent from "../../service/service-list/ServiceListComponent";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";

interface ServiceCategoryDetailsScreenProps {

}

const ServiceCategoryDetailsScreen = (props: ServiceCategoryDetailsScreenProps) => {

    const {serviceCategoryId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serviceCategoryDetails, setServiceCategoryDetails] = useState<IServiceCategory | undefined>(undefined);
    const [isServiceCategoryDetailsLoading, setIsServiceCategoryDetailsLoading] = useState<boolean>(false);
    const [isServiceCategoryDetailsLoaded, setIsServiceCategoryDetailsLoaded] = useState<boolean>(false);
    const [isServiceCategoryDetailsLoadingFailed, setIsServiceCategoryDetailsLoadingFailed] = useState<boolean>(false);
    const [isServiceCategoryEditFormOpened, setIsServiceCategoryEditFormOpened] = useState<boolean>(false);
    const [refreshToken, setRefreshToken] = useState<string>('');


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
        dispatch(setCurrentNavParams(serviceCategoryDetails?.name || "Service Category", null, () => {
            navigate(CommonService._routeConfig.ServiceCategoryList());
        }));
    }, [navigate, serviceCategoryDetails, dispatch]);

    const openServiceCategoryEditFormDrawer = useCallback(() => {
        setIsServiceCategoryEditFormOpened(true);
    }, []);

    const closeServiceCategoryEditFormDrawer = useCallback(() => {
        setIsServiceCategoryEditFormOpened(false);
        setRefreshToken(Math.random().toString(36).substring(7));
    }, []);

    const handleServiceCategoryEdit = useCallback((serviceCategory: IServiceCategory) => {
        setServiceCategoryDetails(serviceCategory);
        closeServiceCategoryEditFormDrawer();
    }, [closeServiceCategoryEditFormDrawer]);

    return (
        <div className={'service-category-details-screen'}>
            {
                isServiceCategoryDetailsLoading && <LoaderComponent/>
            }
            {
                isServiceCategoryDetailsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch service category details"}/>
            }
            {
                isServiceCategoryDetailsLoaded && <>
                    <div className={"service-category-details-card"}>
                        <FormControlLabelComponent label={'View Service Category Details'} size={'xl'}/>

                        <BasicDetailsCardComponent
                            title={serviceCategoryDetails?.name}
                            status={serviceCategoryDetails?.is_active}
                            avatarUrl={serviceCategoryDetails?.image?.url}
                            subTitle={serviceCategoryDetails?.description}
                            actions={<>
                                <ButtonComponent
                                    prefixIcon={<ImageConfig.EditIcon/>}
                                    variant={'outlined'}
                                    onClick={openServiceCategoryEditFormDrawer}
                                    id={"sc_edit_btn"}
                                >
                                    Edit Details
                                </ButtonComponent>
                            </>}
                        ></BasicDetailsCardComponent>
                    </div>
                    {
                        serviceCategoryId && <CardComponent className="service-category-service-list">
                            <ServiceListComponent refreshToken={refreshToken} serviceCategoryId={serviceCategoryId}/>
                        </CardComponent>
                    }
                </>
            }
            <DrawerComponent isOpen={isServiceCategoryEditFormOpened}
                             showClose={true}
                             closeOnEsc={false}
                             closeOnBackDropClick={true}
                             closeButtonId={"sc_close_btn"}
                             className={"t-side-bar-form service-category-add-form-drawer"}
                             onClose={closeServiceCategoryEditFormDrawer}>
                {
                    serviceCategoryDetails && <ServiceCategoryEditComponent
                        serviceCategory={serviceCategoryDetails}
                        onEdit={handleServiceCategoryEdit}/>
                }
            </DrawerComponent>
        </div>
    );

};

export default ServiceCategoryDetailsScreen;