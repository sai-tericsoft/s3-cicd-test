import "./DiscountListComponent.scss";
import SearchComponent from "../../../../shared/components/search/SearchComponent";
import DateRangePickerComponent
    from "../../../../shared/components/form-controls/date-range-picker/DateRangePickerComponent";
import moment from "moment/moment";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import React, {useMemo, useState} from "react";
import SelectComponent from "../../../../shared/components/form-controls/select/SelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {ITableColumn} from "../../../../shared/models/table.model";
import {IFacility} from "../../../../shared/models/facility.model";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import TableComponent from "../../../../shared/components/table/TableComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";

interface DiscountListComponentProps {

}

const DiscountListComponent = (props: DiscountListComponentProps) => {

    const [discountListFilterState, setDiscountListFilterState] = useState<any>({
        search: "",
        is_active: undefined,
    });
    const {statusList} = useSelector((store: IRootReducerState) => store.staticData);

    const columns :ITableColumn[] = useMemo(() => [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            fixed: "left",
        },
        {
            title: "Coupon Code",
            dataIndex: "coupon_code",
            key: "coupon_code",
            align: "center",
            width: 200,
        },
        {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
            align: "center",
            width: 150,
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date",
            align: "center",
            width: 150,
        },
        {
            title:"Status",
            dataIndex:"status",
            key:"status",
            align: "center",
            width: 150,
            render: (item: any) => {
                return <ChipComponent label={item.is_active ? "Active" : "Inactive"}
                                      className={item?.is_active ? "active" : "inactive"}
                />
            }
        },
        {
            title:"",
            dataIndex:"action",
            key:"action",
            fixed: "right",
            align: "center",
            render: (item: any) => {
                return <LinkComponent>View Details</LinkComponent>
            }
        }
        ],[]);

    const couponData:any=[
        {
            title:"New Year",
            coupon_code:"NY2021",
            start_date:"01/01/2021",
            end_date:"01/31/2021",
            is_active:true,
        },
        {
            title:"Father's Day",
            coupon_code:"FD2021",
            start_date:"06/01/2021",
            end_date:"06/30/2021",
           is_active:false
        },
        {
            title:"Mother's Day",
            coupon_code:"MD2021",
            start_date:"05/01/2021",
            end_date:"05/31/2021",
            is_active:true,
        }
    ]


    return (
        <div className={'discount-list-component list-screen'}>
            <div className={'list-screen-header'}>
                <div className={'list-search-filters'}>
                    <div className="ts-row">
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <SearchComponent
                                label={"Search Coupon"}
                                value={discountListFilterState.search}
                                onSearchChange={(value) => {
                                    setDiscountListFilterState({...discountListFilterState, search: value})
                                }}
                            />
                        </div>
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <SelectComponent
                                label={"Status"}
                                size={"small"}
                                fullWidth={true}
                                options={statusList}
                                value={discountListFilterState.is_active}
                                keyExtractor={(item) => item.code}
                                onUpdate={(value) => {
                                    delete discountListFilterState.is_active;
                                    setDiscountListFilterState({...discountListFilterState, ...(value !== '' ? {is_active: value} : {})})
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="list-options">
                    <ButtonComponent id={'add_client_btn'} prefixIcon={<ImageConfig.AddIcon/>}
                                     >
                        Add Coupon
                    </ButtonComponent>
                </div>
            </div>
       <TableComponent columns={columns} data={couponData}/>
        </div>
    );

};

export default DiscountListComponent;