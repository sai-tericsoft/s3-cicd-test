import "./InventoryProductViewDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect} from "react";
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

    const handleEdit = useCallback((productId: string) => {
        if (productId) {
            navigate(CommonService._routeConfig.EditInventoryProduct(productId));
        }
    }, [navigate]);

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
                <FormControlLabelComponent label={"View Product Details"} size={'xl'}/>
                <CardComponent color={'primary'}>
                    <div className={'image-button-wrapper'}>
                        <div className={'image-details-wrapper'}>
                            <div className={'image-wrapper'}>
                                <AvatarComponent url={inventoryProductDetails?.image?.url} size={'xl'}/>
                            </div>
                            <div className={'product-details-wrapper'}>
                                <DataLabelValueComponent id={"qty_available"} label={'Quantity Available: '}
                                                         className={'quantity-available'} direction={'row'}>
                                    {inventoryProductDetails?.quantity}
                                </DataLabelValueComponent>
                                <FormControlLabelComponent id="product_title" size={'xl'}
                                                           label={inventoryProductDetails?.name}
                                                           className={'inventory-product-details'}/>
                                <div id={"product_desc"} className={'description'}>
                                    {inventoryProductDetails?.description}
                                </div>
                            </div>
                        </div>
                        <div className={'button-wrapper'}>
                            <ButtonComponent onClick={() => handleEdit(inventoryProductDetails?._id)}
                                             variant={'outlined'}
                                             prefixIcon={<ImageConfig.EditIcon/>}>Edit Details</ButtonComponent>
                        </div>
                    </div>

                </CardComponent>
                <CardComponent title={'Product Details'}>
                    <div className={'ts-row'}>
                        <div className={'ts-col-4'}>
                            <DataLabelValueComponent id={"product_code"} label={'Product Code'}>
                                {inventoryProductDetails?.code}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-4'}>
                            <DataLabelValueComponent id={"product_price"} label={'Retail Price'}>
                                <span> {Misc.CURRENCY_SYMBOL}</span> {CommonService.convertToDecimals(inventoryProductDetails?.price)}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-4'}>
                            <DataLabelValueComponent id={"sold_qty"} label={'Sold Quantity'}>
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
