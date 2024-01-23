import "./InventoryProductViewDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {getInventoryProductDetails} from "../../../store/actions/inventory.action";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";

interface InventoryProductViewDetailsComponentProps {

}

type InventoryStockTabType = "stockIncoming" | "stockOutgoing";

const InventoryStockTypes: any = ['stockIncoming', 'stockOutgoing'];

const InventoryProductViewDetailsComponent = (props: InventoryProductViewDetailsComponentProps) => {

    const {productId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentTab, setCurrentTab] = useState<InventoryStockTabType>("stockIncoming");
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

    const InventoryStockIncomingListColumns = [
        {
            title: "Stock Quantity",
            key: "stock_quantity",
            dataIndex: "quantity",
            width: 80,
        },
        {
            title: "Updated By",
            key: "updated_by",
            dataIndex: "updated_by",
            width: 50,
            render: (item: any) => {
                return <span>{item?.updated_by_details?.first_name} {item?.updated_by_details?.last_name}</span>
            }
        },
        {
            title: "Updated On",
            key: "updated_on",
            dataIndex: "updated_at",
            width: 50,
            render: (item: any) => {
                return <>{CommonService.transformTimeStamp2(item?.updated_at)}</>
            }
        },
    ];

    const InventoryStockOutgoingListColumns = [
        {
            title: "Client ID",
            key: "client_id",
            dataIndex: "client_id",
            width: 160,
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.ClientProfileDetails(item?.client_details?._id)+'?referrer=' + location.pathname + '?activeTab=stockOutgoing'}>{item?.client_details?.client_id}</LinkComponent>
            }

        },
        {
            title: "Client Name",
            key: "client_name",
            dataIndex: "client_name",
            width: 150,
            render: (item: any) => {
                return <span>{item?.client_details?.first_name} {item?.client_details?.last_name}</span>
            }
        },
        {
            title: "Stock Quantity",
            key: "stock_quantity",
            dataIndex: "quantity",
            width: 80,
        },
        {
            title: "Sold By",
            key: "sold_by",
            dataIndex: "sold_by",
            width: 50,
            render: (item: any) => {
                return <span>{item?.sold_by_details?.first_name} {item?.sold_by_details?.last_name}</span>
            }
        },
        {
            title: "Sold On",
            key: "sold_on",
            dataIndex: "sold_on",
            width: 50,
            render: (item: any) => {
                return <>{CommonService.transformTimeStamp2(item?.sold_on)}</>
            }
        }
    ];

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("activeTab", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const step: InventoryStockTabType = searchParams.get("activeTab") as InventoryStockTabType;
        if (step && InventoryStockTypes.includes(step)) {
            setCurrentTab(step);
        } else {
            searchParams.set("activeTab", InventoryStockTypes[0]);
            setSearchParams(searchParams);
        }
    }, [dispatch, searchParams, setSearchParams]);


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
                <PageHeaderComponent title={'Product Details'} className={'product-details-heading'}/>
                <CardComponent color={'primary'}>
                    <div className={'image-button-wrapper'}>
                        <div className={'image-details-wrapper'}>
                            <div className={'image-wrapper'}>
                                <AvatarComponent url={inventoryProductDetails?.image?.url} size={'xl'}/>
                            </div>
                            <div className={'product-details-wrapper'}>
                                <FormControlLabelComponent id="product_title" size={'xl'}
                                                           label={inventoryProductDetails?.name}
                                                           className={'inventory-product-details'}/>
                                <div id={"product_desc"} className={'description'}>
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
                    <div className={'ts-row'}>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent id={"prod_code"} label={'Product Code'}>
                                {inventoryProductDetails?.code}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent id={"qty_available"} label={'Quantity Available'}
                                                     className={'quantity-available'}>
                                {inventoryProductDetails?.quantity}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent id={"retail_price"} label={'Retail Price (Incl. tax)*'}>
                                {inventoryProductDetails?.retail_price}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent id={"sale_price"} label={'Sale Price (Incl. tax)*'}>
                                {CommonService.convertToDecimals(inventoryProductDetails?.sale_price)}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent id={"sold_quantity"} label={'Sold Quantity'}>
                                {inventoryProductDetails?.sold_quantity}
                            </DataLabelValueComponent>
                        </div>

                    </div>
                </CardComponent>
                <TabsWrapperComponent>
                    <TabsComponent value={currentTab} onUpdate={handleTabChange} variant={"fullWidth"}>
                        <TabComponent label={'Stock Incoming'} value={'stockIncoming'}/>
                        <TabComponent label={'Stock Outgoing'} value={'stockOutgoing'}/>
                    </TabsComponent>
                    <TabContentComponent value={'stockIncoming'} selectedTab={currentTab}>
                        <TableWrapperComponent
                            url={APIConfig.GET_PRODUCT_STOCK_INCOMING_LIST.URL(productId)}
                            method={APIConfig.GET_PRODUCT_STOCK_INCOMING_LIST.METHOD}
                            columns={InventoryStockIncomingListColumns}
                            isPaginated={true}
                            moduleName={"inventory"}
                        />
                    </TabContentComponent>
                    <TabContentComponent value={'stockOutgoing'} selectedTab={currentTab}>
                        <TableWrapperComponent
                            url={APIConfig.GET_PRODUCT_STOCK_OUTGOING_LIST.URL(productId)}
                            method={APIConfig.GET_PRODUCT_STOCK_OUTGOING_LIST.METHOD}
                            columns={InventoryStockOutgoingListColumns}
                            isPaginated={true}
                            moduleName={"inventory"}/>
                    </TabContentComponent>
                </TabsWrapperComponent>

            </>

            }
        </div>
    );

};

export default InventoryProductViewDetailsComponent;
