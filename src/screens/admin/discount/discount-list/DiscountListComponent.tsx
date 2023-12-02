import "./DiscountListComponent.scss";
import SearchComponent from "../../../../shared/components/search/SearchComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {APIConfig, ImageConfig} from "../../../../constants";
import React, {useMemo, useState} from "react";
import SelectComponent from "../../../../shared/components/form-controls/select/SelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {ITableColumn} from "../../../../shared/models/table.model";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {CommonService} from "../../../../shared/services";
import ToolTipComponent from "../../../../shared/components/tool-tip/ToolTipComponent";

interface DiscountListComponentProps {

}

const DiscountListComponent = (props: DiscountListComponentProps) => {

        const [discountListFilterState, setDiscountListFilterState] = useState<any>({
            search: "",
            is_active: undefined,
            page: 1
        });
        const {statusList} = useSelector((store: IRootReducerState) => store.staticData);

        const columns: ITableColumn[] = useMemo(() => [
            {
                title: "Title",
                dataIndex: "title",
                key: "title",
                fixed: "left",
                width: 180,
                render: (item: any) => {
                    return <>
                        {
                            (item?.title?.length) > 15 ?
                                <ToolTipComponent
                                    tooltip={item?.title}
                                    position={"top"}
                                    showArrow={true}
                                >
                                   <> {item?.title?.substring(0, 15) + '...'}</>
                                </ToolTipComponent> :
                                <>
                                    {item?.title}
                                </>
                        }
                    </>
                }
            },
            {
                title: "Coupon Code",
                dataIndex: "code",
                key: "code",
                align: "center",
                width: 150,
            },
            {
                title: "Start Date",
                dataIndex: "start_date",
                key: "start_date",
                align: "center",
                width: 150,
                render: (item: any) => {
                    return <>{CommonService.convertDateFormat2(item?.start_date)}</>
                }
            },
            {
                title: "End Date",
                dataIndex: "end_date",
                key: "end_date",
                align: "center",
                width: 150,
                render: (item: any) => {
                    return <>{CommonService.convertDateFormat2(item?.end_date)}</>
                }
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                align: "center",
                width: 150,
                render: (item: any) => {
                    return <ChipComponent label={item.is_active ? "Active" : "Inactive"}
                                          className={item?.is_active ? "active" : "inactive"}
                    />
                }
            },
            {
                title: "",
                dataIndex: "action",
                key: "action",
                fixed: "right",
                align: "right",
                render: (item: any) => {
                    return <LinkComponent route={CommonService._routeConfig.CouponViewDetails(item?._id)}>View
                        Details</LinkComponent>
                }
            }
        ], []);

        return (
            <div className={'discount-list-component list-screen'}>
                <div className={'list-screen-header'}>
                    <div className={'list-search-filters'}>
                        <div className="ts-row">
                            <div className="ts-col-md-6 ts-col-lg-5">
                                <SearchComponent
                                    label={"Search"}
                                    placeholder={"Search using Title or Coupon Code"}
                                    value={discountListFilterState.search}
                                    onSearchChange={(value) => {
                                        setDiscountListFilterState((prevState: any) => {
                                            return {
                                                ...prevState,
                                                search: value,
                                                page: 1 // Reset the page number to 1
                                            };
                                        });
                                    }}
                                />
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <SelectComponent
                                    label={"Status"}
                                    size={"small"}
                                    fullWidth={true}
                                    isClear={false}
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
                        <LinkComponent route={CommonService._routeConfig.CouponAdd()}>
                            <ButtonComponent id={'add_client_btn'} prefixIcon={<ImageConfig.AddIcon/>}>
                                Add Coupon
                            </ButtonComponent>
                        </LinkComponent>
                    </div>
                </div>

                <div className={'coupon-list'}>
                    <TableWrapperComponent url={APIConfig.GET_COUPON_LIST.URL}
                                           method={APIConfig.GET_COUPON_LIST.METHOD}
                                           noDataText={'No results found'}
                                           extraPayload={discountListFilterState}
                                           columns={columns}/>
                </div>
            </div>
        );

    }
;

export default DiscountListComponent;