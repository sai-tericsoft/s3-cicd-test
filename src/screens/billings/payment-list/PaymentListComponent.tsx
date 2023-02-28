import "./PaymentListComponent.scss";
import {useCallback, useEffect, useReducer, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import {useSearchParams} from "react-router-dom";
import {ITableColumn} from "../../../shared/models/table.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig, Misc} from "../../../constants";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

interface PaymentListComponentProps {

}

const completePaymentListColumn: ITableColumn[] = [
    {
        title: 'Receipt No.',
        key: 'receipt_no',
        align: 'center',
        fixed: 'left',
        dataIndex: 'receipt_number',
        render: (item: any) => {
            return <LinkComponent route={CommonService._routeConfig.ComingSoonRoute()}>
                {item?.receipt_number}
            </LinkComponent>
        }
    },
    {
        title: 'Date',
        key: 'date',
        dataIndex: 'created_at',
        align: 'center',
        render: (item: any) => {
            return <>{CommonService.convertDateFormat2(item?.created_at)}</>
        }
    },
    {
        title: 'Client Name',
        key: 'client_name',
        dataIndex: 'first_name',
        align: 'center',
        render: (item: any) => {
            return <>
                {item?.client_details?.first_name} {item?.client_details?.last_name}
            </>
        }

    },
    {
        title: 'Phone Number',
        key: 'phone_number',
        dataIndex: 'phone',
        align: 'center',
        render: (item: any) => {
            return <>
                {item?.client_details?.primary_contact_info?.phone}
            </>
        }

    },
    {
        title: 'Total Amount',
        key: 'amount',
        align: 'center',
        dataIndex: 'amount',
        render:(item:any)=>{
            return <>{Misc.CURRENCY_SYMBOL}{item?.amount}</>
        }
    },
    {
        title: 'Payment For',
        key: 'payment_for',
        dataIndex: 'payment_for',
        align:'center',
        render: (item: any) => {
            return <>
                {
                    item?.payment_for === 'appointment' &&
                    <ChipComponent className={'active'} label={item?.payment_for}/>
                }
                {
                    item?.payment_for === 'no show' && <ChipComponent className={'no-show'} label={item?.payment_for}/>
                }
                {
                    item?.payment_for === 'products' &&
                    <ChipComponent className={'products'} label={item?.payment_for}/>
                }
                {
                    item?.payment_for === 'waived' && <ChipComponent className={'waived'} label={item?.payment_for}/>
                }
                {
                    item?.payment_for === 'cancellation' &&
                    <ChipComponent className={'cancellation'} label={item?.payment_for}/>
                }
            </>
        }
    },
    {
        title: '',
        key: 'action',
        fixed: 'right',
        dataIndex: 'action',
        render: (item: any) => {
            return <LinkComponent route={CommonService._routeConfig.ComingSoonRoute()}>
                View Details
            </LinkComponent>
        }
    }

]


const PaymentListComponent = (props: PaymentListComponentProps) => {

    const dispatch = useDispatch();

    const [currentTab, setCurrentTab] = useState<any>("pendingPayments");
    const [searchParams, setSearchParams] = useSearchParams();
    // const [selectedClient,setSelectedClient]=useState<any[]>([]);
    const [clientListFilterState, setClientListFilterState] = useState<any>({
        search: "",
    });

    const pendingPaymentColumn: ITableColumn[] = [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 50,
            fixed: 'left',
            render: (item:any) => {
                // return <CheckBoxComponent label={''} checked={selectedClient.includes(item)}
                //                           onChange={(isChecked) => {
                //                               if (isChecked) {
                //                                   setIsMarkAsPaidDisabled(false)
                //                                   setSelectedClient([...selectedClient, item]);
                //                               }
                //                               else {
                //                                   setIsMarkAsPaidDisabled(true)
                //                                   setSelectedClient(selectedClient.filter((code) => code !== item));
                //                               }
                //                           }}>
                return <CheckBoxComponent/>

            }
        },
        {
            title: 'Appointment ID',
            key: 'appointment_id',
            dataIndex: 'appointment_id',
            fixed: 'left',
            width: 193,
            align: 'center',
            render: (item: any) => {
                return (
                    <LinkComponent route={CommonService._routeConfig.ComingSoonRoute()}>
                        {item?.appointment_id}
                    </LinkComponent>
                )
            }
        },
        {
            title: 'Appointment Date',
            key: 'appointment_date',
            dataIndex: "appointment_date",
            align: 'center',
            render: (item: any) => {
                return <>
                    {CommonService.convertDateFormat2(item?.appointment_details?.appointment_date)}</>
            }
        },
        {
            title: 'Client Name',
            key: 'client_name',
            dataIndex: 'first_name',
            align: 'center',
            render: (item: any) => {
                return <>
                    {item?.client_details?.first_name} {item?.client_details?.last_name}
                </>
            }

        },
        {
            title: 'Phone Number',
            key: 'phone_number',
            dataIndex: 'phone',
            align: 'center',
            render: (item: any) => {
                return <>
                    {item?.client_details?.primary_contact_info?.phone}
                </>
            }

        },
        {
            title: 'Service',
            key: 'service',
            dataIndex: 'name',
            width: 225,
            align: 'center',
            render: (item: any) => {
                return <>
                    {item?.service_details?.name}
                </>
            }
        },
        {
            title: 'Total Amount',
            key: 'amount',
            align: 'center',
            dataIndex: 'amount',
            render:(item:any)=>{
                return <>{Misc.CURRENCY_SYMBOL}{item?.amount} </>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.ComingSoonRoute()}>
                    View Details
                </LinkComponent>
            }
        }
    ];


    useEffect(() => {
        dispatch(setCurrentNavParams("Billing"));
    }, [dispatch]);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("currentStep", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    return (
        <div className={'payment-list-component list-screen'}>
            <div className={'list-screen-header'}>
                <div className={'list-search-filters'}>
                    <div className="ts-row">
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <SearchComponent
                                label={"Search for clients"}
                                value={clientListFilterState.search}
                                onSearchChange={(value) => {
                                    setClientListFilterState({...clientListFilterState, search: value})
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="list-options">
                    { currentTab==='pendingPayments' &&
                        <ButtonComponent variant={'outlined'}  className={'mrg-right-10'} prefixIcon={<ImageConfig.CircleCheck/>}>
                        Mark as paid
                    </ButtonComponent>
                    }
                    <ButtonComponent  prefixIcon={<ImageConfig.AddIcon/>}>
                       New Invoice
                    </ButtonComponent>
                </div>
            </div>
            <TabsWrapperComponent>
                <TabsComponent value={currentTab}
                               allowScrollButtonsMobile={false}
                               variant={"fullWidth"}
                               onUpdate={handleTabChange}>
                    <TabComponent label={'Pending Payments'} value={'pendingPayments'}/>
                    <TabComponent label={'Completed Payments'} value={'completedPayments'}/>
                </TabsComponent>
                <TabContentComponent value={'pendingPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent url={APIConfig.PENDING_PAYMENT_LIST.URL}
                                           extraPayload={clientListFilterState}
                                           method={APIConfig.PENDING_PAYMENT_LIST.METHOD}
                                           columns={pendingPaymentColumn}/>
                </TabContentComponent>
                <TabContentComponent value={'completedPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent url={APIConfig.COMPLETE_PAYMENT_LIST.URL}
                                           method={APIConfig.COMPLETE_PAYMENT_LIST.METHOD}
                                           extraPayload={clientListFilterState}
                                           columns={completePaymentListColumn}/>
                </TabContentComponent>


            </TabsWrapperComponent>
        </div>
    );

};

export default PaymentListComponent;