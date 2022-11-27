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
import DrawerComponent from "../../../../shared/components/drawer/DrawerComponent";
import ServiceCategoryEditComponent from "../service-category-edit/ServiceCategoryEditComponent";
import ServiceListComponent from "../../service/service-list/ServiceListComponent";

interface ServiceCategoryDetailsScreenProps {

}

const ServiceCategoryDetailsScreen = (props: ServiceCategoryDetailsScreenProps) => {

    const {serviceCategoryId} = useParams();
    const dispatch = useDispatch();
    const [serviceCategoryDetails, setServiceCategoryDetails] = useState<IServiceCategory | undefined>(undefined);
    const [isServiceCategoryDetailsLoading, setIsServiceCategoryDetailsLoading] = useState<boolean>(false);
    const [isServiceCategoryDetailsLoaded, setIsServiceCategoryDetailsLoaded] = useState<boolean>(false);
    const [isServiceCategoryDetailsLoadingFailed, setIsServiceCategoryDetailsLoadingFailed] = useState<boolean>(false);
    const [isServiceCategoryEditFormOpened, setIsServiceCategoryEditFormOpened] = useState<boolean>(false);

    // Add Service States Start from

    const [isServiceCategoryAddFormOpened, setIsServiceCategoryAddFormOpened] = useState<boolean>(false)


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

    const openServiceCategoryEditFormDrawer = useCallback(() => {
        setIsServiceCategoryEditFormOpened(true);
    }, []);

    const closeServiceCategoryEditFormDrawer = useCallback(() => {
        setIsServiceCategoryEditFormOpened(false);
    }, []);

    // Add Service Drawer function starts here

    const openServiceCategoryAddFormDrawer=useCallback(()=>{
        setIsServiceCategoryAddFormOpened(true);
    },[])

    const closeServiceCategoryAddFormDrawer = useCallback(() => {
        setIsServiceCategoryAddFormOpened(false);
    }, []);
// ---------------------------------------------------------------------------------------

    const handleServiceCategoryEdit = useCallback((serviceCategory: IServiceCategory) => {
        setServiceCategoryDetails(serviceCategory);
        closeServiceCategoryEditFormDrawer();
    }, [closeServiceCategoryEditFormDrawer]);

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
                            avatarUrl={serviceCategoryDetails?.image?.url}
                            subTitle={serviceCategoryDetails?.description}
                            actions={<>
                                <ButtonComponent
                                    prefixIcon={<ImageConfig.EditIcon/>}
                                    onClick={openServiceCategoryEditFormDrawer}
                                >
                                    Edit Details
                                </ButtonComponent>
                            </>}
                        ></BasicDetailsCardComponent>
                    </div>
                    {
                        serviceCategoryId && <div className="service-category-service-list">
                            <ServiceListComponent serviceCategoryId={serviceCategoryId}/>
                        </div>
                    }
                </>
            }
            <DrawerComponent isOpen={isServiceCategoryEditFormOpened}
                             showClose={true}
                             closeOnEsc={false}
                             closeOnBackDropClick={false}
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