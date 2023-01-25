import "./InventoryListScreen.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig, Misc} from "../../../constants";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {CommonService} from "../../../shared/services";
import {ITableColumn} from "../../../shared/models/table.model";

interface InventoryListScreenProps {

}

const InventoryListScreen = (props: InventoryListScreenProps) => {

    const dispatch = useDispatch();
    const [inventoryListFilterState, setInventoryListFilterState] = useState<any>({
        search: "",
        sort: {}
    });

    const InventoryListTableColumns = useMemo<any>(() => [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            width: 153
        },
        {
            title: 'Product Code',
            dataIndex: 'code',
            key: 'code',
            width: 118
        },
        {
            title: 'Quantity Available',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 151,
            sortable: true,
            render: (item: any) => {
                return <>
                    {item?.price === 0 ? <ChipComponent color={"error"} label={'out of stock'}/> : item.quantity}
                </>
            }
        },
        {
            title: 'Amount',
            dataIndex: 'price',
            key: 'price',
            width: 156,
            render: (item: any) => {
                return <> {Misc.CURRENCY_SYMBOL} {item?.price} </>
            }
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 98,
            render: (_: any, item: any) => {
                return <LinkComponent route={CommonService._routeConfig.InventoryProductViewDetails(item?._id)}>
                    View Details</LinkComponent>
            }
        }
    ], []);

    const handleInventorySort = useCallback((key: string, order: string) => {
        setInventoryListFilterState((oldState: any) => {
            const newState = {...oldState};
            newState["sort"] = {
                key,
                order
            }
            return newState;
        });
    }, []);

    useEffect(() => {
        dispatch(setCurrentNavParams("Inventory"));
    }, [dispatch]);

    return (
        <div className={'inventory-list-screen list-screen'}>
            <div className={'list-screen-header'}>
                <div className={'list-search-filters'}>
                    <div className="ts-row">
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <SearchComponent label={'Search Product'}
                                             value={inventoryListFilterState.search}
                                             onSearchChange={(value) => {
                                                 setInventoryListFilterState({
                                                     ...inventoryListFilterState,
                                                     search: value
                                                 })
                                             }}

                            />
                        </div>
                    </div>
                </div>
                <div className="list-options">
                    <LinkComponent route={CommonService._routeConfig.AddInventoryProduct()}>
                        <ButtonComponent id={'add_product_btn'} prefixIcon={<ImageConfig.AddIcon/>}>
                            Add Product
                        </ButtonComponent>
                    </LinkComponent>
                </div>
            </div>
            <div className="list-content-wrapper">
                <TableWrapperComponent url={APIConfig.GET_INVENTORY_LIST.URL}
                                       method={APIConfig.GET_INVENTORY_LIST.METHOD}
                                       columns={InventoryListTableColumns}
                                       extraPayload={inventoryListFilterState}
                                       onSort={handleInventorySort}
                />
            </div>
        </div>
    );

};

export default InventoryListScreen;
