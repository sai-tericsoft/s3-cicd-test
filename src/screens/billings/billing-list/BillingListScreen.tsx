import "./BillingListScreen.scss";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig, Misc} from "../../../constants";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import {IRootReducerState} from "../../../store/reducers";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import DateRangePickerComponent
    from "../../../shared/components/form-controls/date-range-picker/DateRangePickerComponent";
import moment from "moment";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import BillingStatsCardComponent from "../billing-stats-card/BillingStatsCardComponent";
import SwitchComponent from "../../../shared/components/form-controls/switch/SwitchComponent";
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import commonService from "../../../shared/services/common.service";

interface PaymentListComponentProps {

}

const PENDING_PAYMENTS_MODULE = 'PENDING_PAYMENTS_MODULE';

type PaymentsListTabType = 'pendingPayments' | 'completedPayments' | 'consolidatedPayments';
const PaymentsListTabTypes = ['pendingPayments', 'completedPayments', 'consolidatedPayments'];

const ClientListFilterStateInitialValues = {
    search: "",
    client_id: undefined,
    date_range: [null, null],
    start_date: null,
    end_date: null,
    linked_invoices: false,
}
const BillingListScreen = (props: PaymentListComponentProps) => {

    const dispatch = useDispatch();
    const [billingStatsCount, setBillingStatsCount] = useState<any>(null);
    const {clientId} = useParams();
    const location = useLocation();
    const [currentTab, setCurrentTab] = useState<PaymentsListTabType>("pendingPayments");
    const [selectedPayments, setSelectedPayments] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState<boolean>(false);
    const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = useState<boolean>(false);
    const [isPaymentsAreBeingMarkedAsPaid, setIsPaymentsAreBeingMarkedAsPaid] = useState<boolean>(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<any>(null);
    const {paymentModes} = useSelector((state: IRootReducerState) => state.staticData);
    const [isBillingStatsBeingLoaded, setIsBillingStatsBeingLoaded] = useState<boolean>(false);
    const [isBillingStatsBeingLoading, setIsBillingStatsBeingLoading] = useState<boolean>(false);
    const [isBillingStatsBeingLoadingFailed, setIsBillingStatsBeingLoadingFailed] = useState<boolean>(false);
    const [billingStats, setBillingStats] = useState<any>(undefined);

    const [isPaymentsGettingConsolidated, setIsPaymentsGettingConsolidated] = useState<boolean>(false);

    const [clientListFilterState, setClientListFilterState] = useState<any>(ClientListFilterStateInitialValues);

    const handlePaymentSelection = useCallback((payment: any, isChecked: boolean) => {
        if (isChecked) {
            setSelectedPayments([...selectedPayments, payment]);
        } else {
            setSelectedPayments(selectedPayments.filter((item: any) => item._id !== payment._id));
        }
    }, [selectedPayments]);

    const openMarkAsPaidModal = useCallback(() => {
        setShowMarkAsPaidModal(true);
    }, []);

    const closeMarkAsPaidModal = useCallback(() => {
        setShowMarkAsPaidModal(false);
    }, []);

    const removePaymentFromSelectedMarkAsPaidList = useCallback((payment: any) => {
        const updatedPayments = selectedPayments.filter((item: any) => item._id !== payment._id);
        if (updatedPayments.length === 0) {
            closeMarkAsPaidModal();
        }
        setSelectedPayments(updatedPayments);
    }, [selectedPayments, closeMarkAsPaidModal]);

    const pendingPaymentColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 50,
            fixed: 'left',
            render: (item: any) => {
                const clientIdOfSelectedPayments = selectedPayments?.length > 0 ? selectedPayments[0]?.client_id : undefined;
                const paymentFor = selectedPayments?.length > 0 ? selectedPayments[0]?.payment_for : undefined;
                const selectedPaymentId = selectedPayments?.length > 0 ? selectedPayments[0]?._id : undefined;
                let isDisabled = (clientIdOfSelectedPayments && clientIdOfSelectedPayments !== item?.client_id) || (paymentFor === "products" && selectedPaymentId !== item?._id) || (clientIdOfSelectedPayments && item?.payment_for === "products" && selectedPaymentId !== item?._id);
                isDisabled = clientListFilterState?.linked_invoices ? false : isDisabled;
                return <CheckBoxComponent
                    className={selectedPayments.includes(item) ? 'selected-row' : ''}
                    disabled={isDisabled}
                    checked={selectedPayments.some((payment: any) => payment._id === item._id)}
                    onChange={(isChecked) => {
                        handlePaymentSelection(item, isChecked)
                    }}/>
            }
        },
        {
            title: 'Invoice No.',
            key: 'invoice_number',
            dataIndex: 'invoice_number',
            // fixed: 'left',
            width: 110,
            align: 'center',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location?.pathname + '&type=invoice'}>
                    {
                        (item?.invoice_number)?.length > 10 ?
                            <ToolTipComponent
                                tooltip={item?.invoice_number}
                                showArrow={true}
                                position={"top"}
                            >
                                <div className={"ellipses-for-table-data"}>
                                    {item?.invoice_number}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {item?.invoice_number}
                            </>
                    }
                </LinkComponent>
            }
        },
        {
            title: 'Billing Date',
            key: 'billing_date',
            dataIndex: "created_at",
            width: 130,
            align: 'center',
            render: (item: any) => {
                return <>{CommonService.convertDateFormat2(item?.created_at) || '-'}</>
            }
        },
        {
            title: 'Client Name',
            key: 'client_name',
            dataIndex: 'first_name',
            width: 150,
            align: 'left',
            render: (item: any) => {
                return <>
                    {
                        (item?.client_details.first_name + ' ' + item?.client_details?.last_name).length > 20 ?
                            <ToolTipComponent
                                tooltip={(item?.client_details.first_name + ' ' + item?.client_details?.last_name)}
                                position={"top"}
                                showArrow={true}
                            >
                                <div className={"ellipses-for-table-data"}>
                                    {item?.client_details?.first_name} {item?.client_details?.last_name}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {CommonService.extractName(item?.client_details)}
                            </>
                    }
                </>
            }
        },
        {
            title: 'Phone',
            key: 'phone_number',
            dataIndex: 'phone',
            width: 140,
            align: 'center',
            render: (item: any) => {
                return <>{CommonService.formatPhoneNumber(item?.client_details?.primary_contact_info?.phone) || '-'}</>
            }
        },
        {
            title: 'Service',
            key: 'service',
            dataIndex: 'name',
            align: 'center',
            width: 170,
            render: (item: any) => {
                return <>{item?.service_details?.name || '-'}</>
            }
        },
        {
            title: 'Total Amount',
            key: 'amount',
            align: 'center',
            dataIndex: 'amount',
            width: 120,
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.total)}</>
            }
        },
        {
            title: 'Payment For',
            key: 'payment_for',
            dataIndex: 'payment_for',
            align: 'center',
            render: (item: any) => {
                let className = "";
                if (item?.payment_for === 'appointment') {
                    className = "active";
                } else if (item?.payment_for === 'no show') {
                    className = "no-show";
                } else if (item?.payment_for === 'products') {
                    className = "products";
                } else if (item?.payment_for === 'waived') {
                    className = "waived";
                } else if (item?.payment_for === 'cancellation') {
                    className = "cancellation";
                }
                return <>
                    {item?.payment_for ? <ChipComponent
                        className={`min-width-60 ${className}`}
                        label={item?.payment_for}/> : '-'}
                </>
            }

        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            width: 120,
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=invoice'}>
                    View Details
                </LinkComponent>
            }
        }
    ], [handlePaymentSelection, selectedPayments, location,clientListFilterState]);

    const clientPendingPaymentColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 50,
            fixed: 'left',
            render: (item: any) => {
                const clientIdOfSelectedPayments = selectedPayments?.length > 0 ? selectedPayments[0]?.client_id : undefined;
                const paymentFor = selectedPayments?.length > 0 ? selectedPayments[0]?.payment_for : undefined;
                const selectedPaymentId = selectedPayments?.length > 0 ? selectedPayments[0]?._id : undefined;
                let isDisabled = (clientIdOfSelectedPayments && clientIdOfSelectedPayments !== item?.client_id) || (paymentFor === "products" && selectedPaymentId !== item?._id) || (clientIdOfSelectedPayments && item?.payment_for === "products" && selectedPaymentId !== item?._id);
                isDisabled = clientListFilterState?.linked_invoices ? false : isDisabled;
                return <CheckBoxComponent
                    className={selectedPayments.includes(item) ? 'selected-row' : ''}
                    disabled={isDisabled}
                    checked={selectedPayments.some((payment: any) => payment._id === item._id)}
                    onChange={(isChecked) => {
                        handlePaymentSelection(item, isChecked)
                    }}/>
            }
        },
        {
            title: 'Appointment ID',
            key: 'appointment_id',
            dataIndex: 'appointment_id',
            fixed: 'left',
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=invoice'}>
                    {
                        (item?.appointment_details.appointment_number).length > 10 ?
                            <ToolTipComponent
                                tooltip={item?.appointment_details.appointment_number}
                                showArrow={true}
                                position={"top"}
                            >
                                <div className={"ellipses-for-table-data"}>
                                    {item?.appointment_details.appointment_number}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {item?.appointment_details.appointment_number}
                            </>
                    }
                </LinkComponent>
            }
        },
        {
            title: 'Appointment Date',
            key: 'appointment_date',
            dataIndex: "appointment_date",
            width: 200,
            align: 'center',
            render: (item: any) => {
                return <>{CommonService.convertDateFormat2(item?.appointment_details?.appointment_date)}</>
            }
        },
        {
            title: 'Service',
            key: 'service',
            dataIndex: 'name',
            align: 'center',
            width: 200,
            render: (item: any) => {
                return <>{item?.service_details?.name}</>
            }
        },
        {
            title: 'Total Amount',
            key: 'amount',
            align: 'center',
            dataIndex: 'amount',
            width: 120,
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.total)}</>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            width: 100,
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=invoice'}>
                    View Details
                </LinkComponent>
            }
        }
    ], [handlePaymentSelection, selectedPayments, location,clientListFilterState]);

    const clientCompletePaymentListColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 50,
            fixed: 'left',
            render: (item: any) => {
                const clientIdOfSelectedPayments = selectedPayments?.length > 0 ? selectedPayments[0]?.client_id : undefined;
                const paymentFor = selectedPayments?.length > 0 ? selectedPayments[0]?.payment_for : undefined;
                const selectedPaymentId = selectedPayments?.length > 0 ? selectedPayments[0]?._id : undefined;
                let isDisabled = (clientIdOfSelectedPayments && clientIdOfSelectedPayments !== item?.client_id) || (paymentFor === "products" && selectedPaymentId !== item?._id) || (clientIdOfSelectedPayments && item?.payment_for === "products" && selectedPaymentId !== item?._id);
                isDisabled = clientListFilterState?.linked_invoices ? false : isDisabled;
                return <CheckBoxComponent
                    className={selectedPayments.includes(item) ? 'selected-row' : ''}
                    disabled={isDisabled}
                    checked={selectedPayments.some((payment: any) => payment._id === item._id)}
                    onChange={(isChecked) => {
                        handlePaymentSelection(item, isChecked)
                    }}/>
            }
        },
        {
            title: 'Receipt No.',
            key: 'receipt_no',
            align: 'center',
            fixed: 'left',
            dataIndex: 'receipt_number',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=receipt'}>
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
                return <>
                    {CommonService.convertDateFormat2(item?.created_at)}
                </>
            }
        },
        {
            title: 'Total Amount',
            key: 'amount',
            align: 'center',
            dataIndex: 'amount',
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.total)}</>
            }
        },
        {
            title: 'Payment For',
            key: 'payment_for',
            dataIndex: 'payment_for',
            width: 200,
            align: 'center',
            render: (item: any) => {
                let className = "";
                if (item?.payment_for === 'appointment') {
                    className = "active";
                } else if (item?.payment_for === 'no show') {
                    className = "no-show";
                } else if (item?.payment_for === 'products') {
                    className = "products";
                } else if (item?.payment_for === 'waived') {
                    className = "waived";
                } else if (item?.payment_for === 'cancellation') {
                    className = "cancellation";
                }
                return <>
                    <ChipComponent
                        className={`min-width-60 ${className}`}
                        label={item?.payment_for}/>
                </>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            dataIndex: 'action',
            render: (item: any) => {

                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=receipt'}>
                    View Details
                </LinkComponent>
            }
        }
    ], [selectedPayments, location, handlePaymentSelection,clientListFilterState]);

    const completePaymentListColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 50,
            fixed: 'left',
            render: (item: any) => {
                const clientIdOfSelectedPayments = selectedPayments?.length > 0 ? selectedPayments[0]?.client_id : undefined;
                const paymentFor = selectedPayments?.length > 0 ? selectedPayments[0]?.payment_for : undefined;
                const selectedPaymentId = selectedPayments?.length > 0 ? selectedPayments[0]?._id : undefined;
                let isDisabled = (clientIdOfSelectedPayments && clientIdOfSelectedPayments !== item?.client_id) || (paymentFor === "products" && selectedPaymentId !== item?._id) || (clientIdOfSelectedPayments && item?.payment_for === "products" && selectedPaymentId !== item?._id);
                isDisabled = clientListFilterState?.linked_invoices ? false : isDisabled;
                return <CheckBoxComponent
                    className={selectedPayments.includes(item) ? 'selected-row' : ''}
                    disabled={isDisabled}
                    checked={selectedPayments.some((payment: any) => payment._id === item._id)}
                    onChange={(isChecked) => {
                        handlePaymentSelection(item, isChecked)
                    }}/>
            }
        },
        {
            title: 'Receipt No.',
            key: 'receipt_no',
            align: 'center',
            fixed: 'left',
            width: 136,
            dataIndex: 'receipt_number',
            render: (item: any) => {

                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=receipt'}>
                    {item?.receipt_number}
                </LinkComponent>
            }
        },
        {
            title: 'Billing Date',
            key: 'date',
            dataIndex: 'created_at',
            align: 'center',
            render: (item: any) => {
                return <>
                    {CommonService.convertDateFormat2(item?.created_at)}
                </>
            }
        },
        {
            title: 'Client Name',
            key: 'client_name',
            dataIndex: 'first_name',
            align: 'left',
            render: (item: any) => {
                return <>
                    {CommonService.extractName(item?.client_details)}
                </>
            }
        },
        {
            title: 'Phone',
            key: 'phone_number',
            dataIndex: 'phone',
            align: 'center',
            render: (item: any) => {
                return <>
                    {CommonService.formatPhoneNumber(item?.client_details?.primary_contact_info?.phone)}

                </>
            }
        },
        {
            title: 'Total Amount',
            key: 'amount',
            align: 'center',
            dataIndex: 'amount',
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.total)}</>
            }
        },
        {
            title: 'Payment For',
            key: 'payment_for',
            dataIndex: 'payment_for',
            width: 200,
            align: 'center',
            render: (item: any) => {
                let className = "";
                if (item?.payment_for === 'appointment') {
                    className = "active";
                } else if (item?.payment_for === 'no show') {
                    className = "no-show";
                } else if (item?.payment_for === 'products') {
                    className = "products";
                } else if (item?.payment_for === 'waived') {
                    className = "waived";
                } else if (item?.payment_for === 'cancellation') {
                    className = "cancellation";
                }
                return <>
                    <ChipComponent
                        className={`min-width-60 ${className}`}
                        label={item?.payment_for}/>
                </>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            width: 118,
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=receipt'}>
                    View Details
                </LinkComponent>
            }
        }
    ], [location, selectedPayments, handlePaymentSelection,clientListFilterState]);

    const consolidatedPayments: ITableColumn[] = useMemo<any>(() => [
        {
            title: 'Invoice/Receipt No.',
            key: 'billing_number',
            width: 200,
            align: 'center',
            render: (item: any) => {
                let route = '';
                if (item?.bill_type === 'invoice') {
                    route = CommonService._routeConfig.ConsolidatedBillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=consolidatedInvoice';
                } else if (item?.bill_type === 'receipt') {
                    route = CommonService._routeConfig.ConsolidatedBillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=consolidatedReceipt';
                } else {
                    route = CommonService._routeConfig.ConsolidatedBillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=completed';
                }
                return <LinkComponent
                    route={route}>
                    {item?.billing_number || '-'}
                </LinkComponent>
            }
        },
        {
            title: 'Billing Date',
            key: 'billing_date',
            align: 'center',
            render: (item: any) => {
                return <>
                    {item?.bill_type === 'invoice' ? CommonService.convertDateFormat2(item?.created_at) : CommonService.convertDateFormat2(item?.updated_at) || '-'}
                </>
            }
        },
        {
            title: 'Client Name',
            key: 'client_name',
            align: 'left',
            width: 100,
            render: (item: any) => {
                return <>
                    {CommonService.extractName(item?.client_details) || '-'}
                </>
            }
        },
        {
            title: 'Total Amount',
            key: 'amount',
            align: 'center',
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.total) || '-'}</>
            }
        },
        {
            title: 'Bill Type',
            key: 'bill_type',
            align: 'center',
            render: (item: any) => {
                return <>{CommonService.capitalizeFirstLetter(item?.bill_type) || '-'}</>
            }
        },
        {
            title: 'Payment For',
            key: 'payment_for',
            align: 'center',
            render: (item: any) => {
                let className = "payment-for-chip";
                if (item?.payment_for === 'appointment') {
                    className = "active";
                } else if (item?.payment_for === 'no show') {
                    className = "no-show";
                } else if (item?.payment_for === 'products') {
                    className = "products";
                } else if (item?.payment_for === 'waived') {
                    className = "waived";
                } else if (item?.payment_for === 'cancellation') {
                    className = "cancellation";
                }
                return <>
                    <ChipComponent
                        className={`min-width-60 ${className}`}
                        label={item?.payment_for || '-'}/>
                </>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            dataIndex: 'action',
            render: (item: any) => {
                let route = '';
                if (item?.bill_type === 'invoice') {
                    route = CommonService._routeConfig.ConsolidatedBillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=consolidatedInvoice';
                } else if (item?.bill_type === 'receipt') {
                    route = CommonService._routeConfig.ConsolidatedBillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=consolidatedReceipt';
                } else {
                    route = CommonService._routeConfig.ConsolidatedBillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=completed';
                }
                return <>
                    <LinkComponent route={route}>
                        View Details
                    </LinkComponent>
                </>
            }
        }
    ], [location.pathname]);


    const markAsPaidTableColumns: ITableColumn[] = useMemo<any>(() => [
        {
            title: 'Invoice No.',
            key: 'invoice_number',
            dataIndex: 'invoice_number',
            fixed: 'left',
        },
        {
            title: 'Appointment Date',
            key: 'date',
            dataIndex: 'date',
            width: 180,
            align: 'center',

            render: (item: any) => {
                return <>
                    {CommonService.convertDateFormat2(item?.appointment_details?.appointment_date)}</>
            }
        },
        {
            title: 'Client Name',
            key: 'client_name',
            dataIndex: 'client_name',
            width: 120,
            align: 'center',
            render: (item: any) => {
                return <>{CommonService.extractName(item?.client_details)}</>
            }
        },
        {
            title: 'Phone',
            key: 'phone',
            dataIndex: 'phone',
            width: 120,
            align: 'center',
            render: (item: any) => {
                return <>{CommonService.formatPhoneNumber(item?.client_details?.primary_contact_info?.phone)}</>
            }

        },

        {
            title: 'Amount (Inc. tax)',
            key: 'amount',
            dataIndex: 'amount',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(+item?.total)} </>
            }
        },
        {
            title: '',
            key: 'action',
            dataIndex: 'action',
            width: 65,
            // align: 'center',
            fixed: 'right',
            render: (item: any) => {
                return <IconButtonComponent onClick={() => removePaymentFromSelectedMarkAsPaidList(item)}>
                    <ImageConfig.CircleCancel/>
                </IconButtonComponent>
            }
        }
    ], [removePaymentFromSelectedMarkAsPaidList]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Billing"));
    }, [dispatch]);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("activeTab", value);
        setSelectedPayments([])
        setClientListFilterState(ClientListFilterStateInitialValues);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const step: PaymentsListTabType = searchParams.get("activeTab") as PaymentsListTabType;
        if (step && PaymentsListTabTypes.includes(step)) {
            setCurrentTab(step);
        } else {
            searchParams.set("activeTab", PaymentsListTabTypes[0]);
            setSearchParams(searchParams);
        }
    }, [dispatch, searchParams, setSearchParams]);

    const openPaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(true);
    }, []);

    const closePaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(false);
        setSelectedPaymentMode(undefined);
    }, []);

    const handlePaymentMarkingConfirmation = useCallback(() => {
        closeMarkAsPaidModal();
        openPaymentModeModal();
    }, [openPaymentModeModal, closeMarkAsPaidModal]);

    const fetchBillingStatsCount = useCallback(() => {
        const payload = {client_id: clientId};
        CommonService._billingsService.GetBillingStatsCountAPICall(payload)
            .then((response: IAPIResponseType<any>) => {
                setBillingStatsCount(response?.data);
            }).catch((error: any) => {
            setBillingStatsCount(undefined);
        })
    }, [clientId]);

    const fetchBillingStats = useCallback(() => {
        setIsBillingStatsBeingLoading(true);
        let billingDetails: any = undefined;

        const payload = {
            start_date: clientListFilterState.start_date,
            end_date: clientListFilterState.end_date,
        };
        CommonService._billingsService.GetBillingStatsAPICall(clientId, payload)
            .then((response: IAPIResponseType<any>) => {
                if (response?.data) {
                    billingDetails = response.data;
                }
                setBillingStats(billingDetails);
                setIsBillingStatsBeingLoading(false);
                setIsBillingStatsBeingLoaded(true);
                setIsBillingStatsBeingLoadingFailed(false);
            }).catch((error: any) => {
            setIsBillingStatsBeingLoading(false);
            setIsBillingStatsBeingLoaded(false);
            setIsBillingStatsBeingLoadingFailed(true);
            setBillingStats(billingDetails);
        })
    }, [clientListFilterState, clientId]);

    console.log('selectedPayments', selectedPayments);

    const markPaymentsAsPaid = useCallback(() => {
        const payload = {
            invoice_ids: selectedPayments.map((payment: any) => payment?._id),
            payment_mode: selectedPaymentMode,
            client_id: selectedPayments[0]?.client_id,
            download_consolidated_bill: false,
            linked_invoice: clientListFilterState?.linked_invoices,
            _id: selectedPayments[0]?._id
        };
        setIsPaymentsAreBeingMarkedAsPaid(true);

        let apiCall: any = undefined;
        if (selectedPayments[0]?.payment_for === 'products') {
            apiCall = CommonService._billingsService.ProductMarkAsPaid(payload);
        } else {
            apiCall = CommonService._billingsService.MarkPaymentsAsPaidAPICall(payload);
        }
        apiCall.then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response?.message || "Payments marked as paid successfully", "success");
                closePaymentModeModal();
                setSelectedPayments([]);
                setSelectedPaymentMode('');
                setIsPaymentsAreBeingMarkedAsPaid(false);
                CommonService._communications.TableWrapperRefreshSubject.next({
                    moduleName: PENDING_PAYMENTS_MODULE
                });
                fetchBillingStatsCount();
                if (clientId) {
                    fetchBillingStats();
                }
            }
        )
            .catch((error: any) => {
                CommonService._alert.showToast(error?.error || error?.errors || "Failed to mark payments marked as paid", "error");
                setIsPaymentsAreBeingMarkedAsPaid(false);
            });
    }, [selectedPayments, fetchBillingStatsCount, clientListFilterState?.linked_invoices, fetchBillingStats, clientId, closePaymentModeModal, selectedPaymentMode]);

    useEffect(() => {
        fetchBillingStatsCount();
    }, [fetchBillingStatsCount]);

    useEffect(() => {
        if (clientId) {
            fetchBillingStats();
        }
    }, [fetchBillingStats, clientId]);

    const handleCreateConsolidatedPayment = useCallback((selectedPayments: any) => {
        const payload = {
            "client_id": selectedPayments[0]?.client_id,
            "bill_type": currentTab === 'pendingPayments' ? 'invoice' : 'receipt',
            "bill_ids": selectedPayments.map((payment: any) => payment?._id)
        }
        setIsPaymentsGettingConsolidated(true);
        commonService._billingsService.CreateConsolidatedPaymentAPICall(payload)
            .then((response: IAPIResponseType<any>) => {
                    handleTabChange(null, 'consolidatedPayments');
                    setIsPaymentsGettingConsolidated(false);
                    commonService._alert.showToast(response?.message || "Payments consolidated successfully", "success");
                }
            )
            .catch((error: any) => {
                setIsPaymentsGettingConsolidated(false);
                commonService._alert.showToast(error?.error || error?.errors || "Failed to consolidate payments", "error");
            });
    }, [currentTab, handleTabChange]);

    const handleConsolidatePayments = useCallback(() => {
        commonService.openConfirmationDialog({
            confirmationTitle: `CONSOLIDATE ${currentTab === 'pendingPayments' ? 'INVOICES' : 'RECEIPTS'}`,
            confirmationSubTitle: "Are you sure you want to consolidate the\n" +
                "selected payments?",
            image: `${ImageConfig.confirmImage}`,
            direction: "up",
            yes: {
                text: "Yes",
                color: "primary"
            },
            no: {
                text: "No",
                color: "primary"
            }
        }).then((response: any) => {
            handleCreateConsolidatedPayment(selectedPayments)
        }).catch((error: any) => {
        })
    }, [selectedPayments, handleCreateConsolidatedPayment, currentTab]);


    return (
        <div className={'payment-list-component list-screen'}>
            {/*<iframe src={"https://kinergycustomertest.teric.services/"}*/}
            {/*        width={"100%"}*/}
            {/*        height={"700"}*/}
            {/*        frameBorder={0}*/}
            {/*/>*/}
            <div className={'list-screen-header'}>
                <div className={'list-search-filters'}>
                    <div className="ts-row">
                        <div className="ts-col-md-12 ts-col-lg-6 d-flex ts-justify-content-start">
                            {!clientId && <div className={'ts-col'}>
                                <SearchComponent
                                    label={"Search"}
                                    placeholder={"Search using Client Name"}
                                    value={clientListFilterState.search}
                                    onSearchChange={(value) => {
                                        setClientListFilterState({...clientListFilterState, search: value})
                                    }}
                                />&nbsp;&nbsp;
                            </div>

                            }
                            <div className={'ts-col'}>
                                <DateRangePickerComponent
                                    label={"Select Date Range"}
                                    value={clientListFilterState.date_range}
                                    onDateChange={(value: any) => {
                                        setClientListFilterState((oldState: any) => {
                                            const newState = {...oldState};
                                            if (value) {
                                                newState['start_date'] = moment(value[0])?.format('YYYY-MM-DD');
                                                newState['end_date'] = moment(value[1])?.format('YYYY-MM-DD');
                                                // newState['date_range'] = value;
                                            } else {
                                                delete newState['date_range'];
                                                delete newState['start_date'];
                                                delete newState['end_date'];
                                            }
                                            return newState;
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="ts-col-lg-1"/>
                        <div className="ts-col-lg-5 d-flex ts-justify-content-end btn-wrapper">
                            {
                                (currentTab === 'completedPayments' || currentTab === 'pendingPayments') &&
                                <>
                                    <ButtonComponent variant={'outlined'}
                                                     className={'mrg-right-10'}
                                                     disabled={selectedPayments.length < 2}
                                                     isLoading={isPaymentsGettingConsolidated}
                                                     onClick={handleConsolidatePayments}
                                                     prefixIcon={<ReceiptOutlinedIcon/>}>
                                        Consolidate
                                    </ButtonComponent>&nbsp;&nbsp;
                                </>
                            }
                            {currentTab === 'pendingPayments' &&
                                <>
                                    <ButtonComponent variant={'outlined'}
                                                     className={'mrg-right-10'}
                                                     disabled={selectedPayments.length === 0 || isPaymentsGettingConsolidated}
                                                     onClick={openMarkAsPaidModal}
                                                     prefixIcon={<ImageConfig.CircleCheck/>}>
                                        Mark as paid
                                    </ButtonComponent>&nbsp;&nbsp;
                                </>
                            }
                            {!clientId && <LinkComponent route={CommonService._routeConfig.AddNewReceipt()}>
                                <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>
                                    New Receipt
                                </ButtonComponent>
                            </LinkComponent>}
                        </div>

                    </div>
                </div>
            </div>

            <div className={'consolidation-switch-wrapper'}>
                <div className={'consolidation-switch'}>
                    <SwitchComponent
                        label={''}
                        disabled={selectedPayments?.length === 0 || currentTab === 'consolidatedPayments' || selectedPayments[0]?.payment_for === "products"}
                        checked={clientListFilterState.linked_invoices}
                        onChange={(value) => {
                            if (!value) {
                                setClientListFilterState(
                                    {
                                        ...clientListFilterState,
                                        linked_invoices: value,
                                        client_id: undefined
                                    }
                                );
                            } else {
                                setClientListFilterState({
                                    ...clientListFilterState,
                                    linked_invoices: value,
                                    client_id: selectedPayments[0]?.client_id
                                })
                            }
                        }
                        }
                    />
                </div>
                <div
                    className={`consolidation-switch-label-component ${(selectedPayments?.length === 0 || currentTab === 'consolidatedPayments' || selectedPayments[0]?.payment_for === "products") && " disabled"}`}>
                    Display all payments linked with the selected client
                </div>
            </div>
            {clientId &&
                <div>
                    {
                        isBillingStatsBeingLoading && <LoaderComponent/>
                    }
                    {
                        isBillingStatsBeingLoadingFailed &&
                        <StatusCardComponent title={"Failed to fetch service details"}/>
                    }
                    {
                        isBillingStatsBeingLoaded && <>
                            <div className="ts-row">
                                <div className="ts-col-lg-3 ts-col-md-6 ts-col-sm-6 ">
                                    <BillingStatsCardComponent
                                        title={"Total Amount"}
                                        amount={billingStats.total_payments}
                                        icon={<ImageConfig.TotalAmount/>}
                                    />
                                </div>

                                <div className="ts-col-lg-3 ts-col-md-6 ts-col-sm-6">
                                    <BillingStatsCardComponent
                                        title={"Pending Payments"}
                                        amount={billingStats.pending_payments}
                                        icon={<ImageConfig.PendingPayments/>}
                                    />
                                </div>
                                <div className="ts-col-lg-3 ts-col-md-6 ts-col-sm-6">
                                    <BillingStatsCardComponent
                                        title={"Completed Payments"}
                                        amount={billingStats.completed_payments}
                                        icon={<ImageConfig.CompletedPayments/>}
                                    />
                                </div>
                                <div className="ts-col-lg-3 ts-col-md-6 ts-col-sm-6">
                                    <BillingStatsCardComponent
                                        title={"Discount Amount"}
                                        amount={billingStats.discounts}
                                        icon={<ImageConfig.PendingAmount/>}
                                    />
                                </div>
                            </div>
                        </>
                    }
                </div>
            }
            <TabsWrapperComponent>
                <TabsComponent value={currentTab}
                               allowScrollButtonsMobile={false}
                               variant={"fullWidth"}
                               onUpdate={handleTabChange}>
                    <TabComponent
                        className={'payment-details-tab'}
                        label={`Pending Payments (${(billingStatsCount?.count !== undefined) ? billingStatsCount?.count : '-'})`}
                        value={'pendingPayments'}/>
                    <TabComponent className={'payment-details-tab'} label={'Completed Payments'}
                                  value={'completedPayments'}/>
                    <TabComponent className={'payment-details-tab'} label={'Consolidated Payments'}
                                  value={'consolidatedPayments'}/>
                </TabsComponent>
                <TabContentComponent value={'pendingPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent url={APIConfig.PENDING_PAYMENT_LIST.URL}
                                           extraPayload={
                                               clientListFilterState
                                           }
                                           noDataText={'Currently there is no pending payments.'}
                                           method={APIConfig.PENDING_PAYMENT_LIST.METHOD}
                                           columns={clientId ? clientPendingPaymentColumn : pendingPaymentColumn}
                                           moduleName={PENDING_PAYMENTS_MODULE}
                    />
                </TabContentComponent>
                <TabContentComponent value={'completedPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent url={APIConfig.COMPLETE_PAYMENT_LIST.URL}
                                           noDataText={'Currently there is no completed payments.'}
                                           method={APIConfig.COMPLETE_PAYMENT_LIST.METHOD}
                                           extraPayload={clientListFilterState}
                                           columns={clientId ? clientCompletePaymentListColumn : completePaymentListColumn}
                    />
                </TabContentComponent>
                <TabContentComponent value={'consolidatedPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent
                        url={APIConfig.CONSOLIDATED_PAYMENT_LIST.URL}
                        extraPayload={
                            clientListFilterState
                        }
                        noDataText={'Currently there is no consolidated payments.'}
                        method={APIConfig.CONSOLIDATED_PAYMENT_LIST.METHOD}
                        columns={consolidatedPayments}
                    />
                </TabContentComponent>
            </TabsWrapperComponent>
            {/*Outstanding Balance Modal start*/}
            <ModalComponent isOpen={showMarkAsPaidModal}
                            className={'mark-as-paid-outstanding-balance-modal'}
                            title={'Outstanding Balance'}
                            modalFooter={<div className="mrg-top-20">
                                <ButtonComponent variant={'outlined'}
                                                 className={'mrg-right-15'}
                                                 onClick={closeMarkAsPaidModal}
                                >
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent variant={'contained'}
                                                 color={'primary'}
                                                 disabled={selectedPayments.length === 0}
                                                 onClick={handlePaymentMarkingConfirmation}
                                >
                                    Confirm
                                </ButtonComponent>
                            </div>
                            }
            >
                {/*<CardComponent title={'Client Details'} className={'client-details-card'}>*/}
                {/*    <div className="ts-row">*/}
                {/*        <div className="ts-col-lg-6">*/}
                {/*            <DataLabelValueComponent*/}
                {/*                direction={"row"}*/}
                {/*                label={<>*/}
                {/*                    <ImageConfig.PersonIcon/>*/}
                {/*                    <span className={'client-details-label'}>Client Name</span>*/}
                {/*                </>}>*/}
                {/*                {CommonService.extractName(selectedPayments[0]?.client_details)}*/}
                {/*            </DataLabelValueComponent>*/}
                {/*        </div>*/}
                {/*        <div className="ts-col-lg-6">*/}
                {/*            <DataLabelValueComponent*/}
                {/*                direction={"row"}*/}
                {/*                label={<>*/}
                {/*                    <ImageConfig.CallIcon/>*/}
                {/*                    <span className={'client-details-label'}>Phone Number</span>*/}
                {/*                </>}>*/}
                {/*                {selectedPayments[0]?.client_details?.primary_contact_info?.phone}*/}
                {/*            </DataLabelValueComponent>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</CardComponent>*/}
                <TableComponent
                    columns={markAsPaidTableColumns}
                    data={selectedPayments}
                />
                <div className={"mark-as-paid-total-outstanding-balance"}>
                    <DataLabelValueComponent
                        direction={"row"}
                        label={"Total Amount (Inc.Tax)"}>
                        <span>
                            {Misc.CURRENCY_SYMBOL} {CommonService.convertToDecimals(selectedPayments.reduce((acc: any, payment: any) => acc + (payment?.total), 0))}
                        </span>
                    </DataLabelValueComponent>
                </div>
            </ModalComponent>
            {/*Outstanding Balance Modal end*/}
            {/*Payment mode selection Modal start*/}
            <ModalComponent isOpen={isPaymentModeModalOpen}
                            className={'payment-mode-modal'}
                            modalFooter={<>
                                <ButtonComponent variant={'outlined'}
                                                 className={'mrg-right-10'}
                                                 onClick={closePaymentModeModal}
                                >
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent variant={'contained'}
                                                 color={'primary'}
                                                 disabled={selectedPayments.length === 0 || !selectedPaymentMode || isPaymentsAreBeingMarkedAsPaid}
                                                 isLoading={isPaymentsAreBeingMarkedAsPaid}
                                                 onClick={markPaymentsAsPaid}
                                >
                                    Confirm Payment
                                </ButtonComponent>
                            </>
                            }
            >
                <ImageConfig.ConfirmIcon/>
                <FormControlLabelComponent label={"Select Mode of Payment"}/>
                <SelectComponent
                    options={paymentModes || []}
                    fullWidth={true}
                    required={true}
                    label={"Mode of Payment"}
                    value={selectedPaymentMode}
                    onUpdate={(value: any) => {
                        setSelectedPaymentMode(value);
                    }
                    }
                />
            </ModalComponent>
            {/*Payment mode selection Modal end*/}
        </div>
    );

};

export default BillingListScreen;
