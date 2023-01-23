import "./InventoryListComponent.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import {useCallback, useEffect, useState} from "react";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";

interface InventoryListComponentProps {

}

const inventoryListColumns = [
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
        width:118
    },
    {
        title: 'Quantity Available',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 151,
        sortable: true,
    },
    {
        title: 'Amount',
        dataIndex: 'price',
        key: 'price',
        width: 156,
        render: (_: any, item: any) => {
            return <div>
                <> {item?.price > 0 && item?.price}</>
                <>{item?.price === 0 && <ChipComponent className={'out_of_stock'} label={'out of stock'}/>}</>
            </div>
        }
    },
    {
        title: '',
        dataIndex: 'action',
        key: 'action',
        width:98,
        render: (_: any, item: any) => {
            return <LinkComponent route={''}>View Details</LinkComponent>
        }
    }
]

const InventoryListComponent = (props: InventoryListComponentProps) => {

    const dispatch = useDispatch();
    const [inventoryListFilterState, setInventoryListFilterState] = useState<any>({
        search: "",
        sort: {}
    });

    const handleInventorySort = useCallback((key: string, order: string) => {
        setInventoryListFilterState((oldState: any) => {
            const newState = {...oldState};
            newState["sort"][key] = order;
            return newState;
        });
    }, []);

    useEffect(() => {
        dispatch(setCurrentNavParams("Inventory"));
    }, [dispatch]);
    return (
        <div className={'inventory-list-component'}>
            <div className={'list-screen-header'}>
            <div className="ts-col-md-6 ts-col-lg-3">
                <SearchComponent label={'Search Product'}
                                 value={inventoryListFilterState.search}
                                 onSearchChange={(value) => {
                                     setInventoryListFilterState({...inventoryListFilterState, search: value})
                                 }}

                />
            </div>
                <div>
                    <ButtonComponent id={'add_product_btn'} prefixIcon={<ImageConfig.AddIcon/>} >
                        Add Product
                    </ButtonComponent>
                </div>
            </div>
            <TableWrapperComponent url={APIConfig.GET_INVENTORY_LIST.URL} method={APIConfig.GET_INVENTORY_LIST.METHOD}
                                   columns={inventoryListColumns}
                                   extraPayload={inventoryListFilterState}
                                   onSort={handleInventorySort}
            />
        </div>
    );

};

export default InventoryListComponent;