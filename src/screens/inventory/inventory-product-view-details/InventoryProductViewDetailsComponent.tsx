import "./InventoryProductViewDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect} from "react";
import {getInventoryProductDetails} from "../../../store/actions/inventory.action";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig, Misc} from "../../../constants";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import LinkComponent from "../../../shared/components/link/LinkComponent";

interface InventoryProductViewDetailsComponentProps {

}

const InventoryProductViewDetailsComponent = (props: InventoryProductViewDetailsComponentProps) => {

    const {productId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        isInventoryProductDetailsLoading,
        isInventoryProductLoaded,
        isInventoryProductLoadingFailed,
        inventoryProductDetails
    } = useSelector((state: IRootReducerState) => state.inventory);

    useEffect(() => {
        if (productId) {
            dispatch(getInventoryProductDetails(productId));
        }
    }, [productId, dispatch]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Product Details", null, () => {
            navigate(CommonService._routeConfig.InventoryList());
        }));
    }, [navigate, dispatch]);

    return (
        <div className={'inventory-product-view-details-component'}>
            {
                isInventoryProductDetailsLoading && <LoaderComponent/>
            }
            {
                isInventoryProductLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch product details"}/>
            }
            {isInventoryProductLoaded && <>
                <PageHeaderComponent title={'Product Details'}/>
                <CardComponent color={'primary'}>
                    <div className={'image-button-wrapper'}>
                        <div className={'image-details-wrapper'}>
                            <div className={'image-wrapper'}>
                                <AvatarComponent url={inventoryProductDetails?.image?.url} size={'xl'}/>
                            </div>
                            <div className={'product-details-wrapper'}>
                                <DataLabelValueComponent label={'Quantity Available: '} direction={'row'}>
                                    {inventoryProductDetails?.quantity}
                                </DataLabelValueComponent>
                                <FormControlLabelComponent size={'xl'} label={inventoryProductDetails?.name}/>
                                <div className={'description'}>
                                    {inventoryProductDetails?.description}
                                </div>
                            </div>
                        </div>
                        <div className={'button-wrapper'}>
                            <LinkComponent
                                route={CommonService._routeConfig.EditInventoryProduct(inventoryProductDetails?._id)}>
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}>Edit Details</ButtonComponent>
                            </LinkComponent>
                        </div>
                    </div>

                </CardComponent>
                <CardComponent title={'Product Details'}>
                    <div className={'ts-row'}>
                        <div className={'ts-col-4'}>
                            <DataLabelValueComponent label={'Product Code'}>
                                {inventoryProductDetails?.code}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-4'}>
                            <DataLabelValueComponent label={'Price*'}>
                                <span> {Misc.CURRENCY_SYMBOL}</span> {inventoryProductDetails?.price}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-4'}>
                            <DataLabelValueComponent label={'Sold Quantity'}>
                                {inventoryProductDetails?.sold_quantity}
                            </DataLabelValueComponent>
                        </div>
                    </div>
                </CardComponent>
            </>
                }
                </div>
                );

            };

            export default InventoryProductViewDetailsComponent;
