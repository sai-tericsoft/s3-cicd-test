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
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import moment from "moment";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import BillingStatsCardComponent from "../billing-stats-card/BillingStatsCardComponent";
import SwitchComponent from "../../../shared/components/form-controls/switch/SwitchComponent";
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import commonService from "../../../shared/services/common.service";
import DateRangePickerComponentV2
    from "../../../shared/components/form-controls/date-range-pickerV2/DateRangePickerComponentV2";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import {ListItemButton} from "@mui/material";
import EditBillingAddressComponent from "../edit-billing-address/EditBillingAddressComponent";
import AddBillingAddressComponent from "../add-billing-address/AddBillingAddressComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";

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
    sort: {},
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
    const [isClientBillingAddressDrawerOpened, setIsClientBillingAddressDrawerOpened] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<"selectAddress" | "editAddress" | "addAddress">("selectAddress");
    const [getBillingList, setGetBillingList] = useState<any>([]);
    const [tempSelectedAddress, setTempSelectedAddress] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        clientId && dispatch(setCurrentNavParams("Client Details", null, () => {
            navigate(CommonService._routeConfig.ClientList());
        }));
    }, [clientId, dispatch, navigate]);


    const [isPaymentsGettingConsolidated, setIsPaymentsGettingConsolidated] = useState<boolean>(false);

    const [clientListFilterState, setClientListFilterState] = useState<any>(ClientListFilterStateInitialValues);

    const handlePaymentSelection = useCallback((payment: any, isChecked: boolean) => {
        if (isChecked) {
            setSelectedPayments([...selectedPayments, payment]);
        } else {
            const tempSelectedPayments = selectedPayments.filter((item: any) => item._id !== payment._id);
            setSelectedPayments(tempSelectedPayments);
            if (tempSelectedPayments.length === 0 && !clientId) {
                setClientListFilterState((oldstate: any) => ({
                    ...oldstate,
                    linked_invoices: false,
                    client_id: undefined
                }));
            }
        }
    }, [selectedPayments, clientId]);


    useEffect(() => {
        if (clientId) {
            setClientListFilterState((oldstate: any) => {
                return {...oldstate, client_id: clientId}
            })
        }
    }, [clientId])

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
                    className={selectedPayments.find((payment: any) => payment._id === item._id) ? 'selected-row' : ''}
                    disabled={isDisabled}
                    checked={!!selectedPayments.find((payment: any) => payment._id === item._id)}
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
                        commonService.generateClientNameFromClientDetails(item?.client_details).length > 20 ?
                            <ToolTipComponent
                                tooltip={commonService.generateClientNameFromClientDetails(item?.client_details)}
                                position={"top"}
                                showArrow={true}
                            >
                                <div
                                    className={item?.client_details?.is_alias_name_set ? "ellipses-for-table-data alias-name" : "ellipses-for-table-data alias-name"}>
                                    {commonService.generateClientNameFromClientDetails(item?.client_details)}
                                </div>
                            </ToolTipComponent> :
                            <span className={item?.client_details?.is_alias_name_set ? 'alias-name' : ''}>
                                {CommonService.extractName(item?.client_details)}
                            </span>
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
    ], [handlePaymentSelection, selectedPayments, location, clientListFilterState]);

    const clientPendingPaymentColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 60,
            fixed: 'left',
            render: (item: any) => {
                const clientIdOfSelectedPayments = selectedPayments?.length > 0 ? selectedPayments[0]?.client_id : undefined;
                const paymentFor = selectedPayments?.length > 0 ? selectedPayments[0]?.payment_for : undefined;
                const selectedPaymentId = selectedPayments?.length > 0 ? selectedPayments[0]?._id : undefined;
                let isDisabled = (clientIdOfSelectedPayments && clientIdOfSelectedPayments !== item?.client_id) || (paymentFor === "products" && selectedPaymentId !== item?._id) || (clientIdOfSelectedPayments && item?.payment_for === "products" && selectedPaymentId !== item?._id);
                isDisabled = clientListFilterState?.linked_invoices ? false : isDisabled;
                return <CheckBoxComponent
                    className={selectedPayments.find((payment: any) => payment._id === item._id) ? 'selected-row' : ''}
                    disabled={isDisabled}
                    checked={!!selectedPayments.find((payment: any) => payment._id === item._id)}
                    onChange={(isChecked) => {
                        handlePaymentSelection(item, isChecked)
                    }}/>
            }
        },
        {
            title: 'Invoice No.',
            key: 'appointment_id',
            dataIndex: 'appointment_id',
            fixed: 'left',
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=invoice'}>
                    {
                        (item?.appointment_details?.appointment_number)?.length > 10 ?
                            <ToolTipComponent
                                tooltip={item?.appointment_details?.appointment_number}
                                showArrow={true}
                                position={"top"}
                            >
                                <div className={"ellipses-for-table-data"}>
                                    {item?.appointment_details?.appointment_number}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {item?.appointment_details?.appointment_number}
                            </>
                    }
                </LinkComponent>
            }
        },
        {
            title: 'Billing Date',
            key: 'billing_date',
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
            width: 130,
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.total)}</>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            width: 120,
            align: 'right',
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location?.pathname + '&type=invoice'}>
                    View Details
                </LinkComponent>
            }
        }
    ], [handlePaymentSelection, selectedPayments, location, clientListFilterState]);

    const clientCompletePaymentListColumn: ITableColumn[] = useMemo<any>(() => [
        // {
        //     title: '',
        //     key: 'select',
        //     dataIndex: 'select',
        //     width: 50,
        //     fixed: 'left',
        //     render: (item: any) => {
        //         const clientIdOfSelectedPayments = selectedPayments?.length > 0 ? selectedPayments[0]?.client_id : undefined;
        //         const paymentFor = selectedPayments?.length > 0 ? selectedPayments[0]?.payment_for : undefined;
        //         const selectedPaymentId = selectedPayments?.length > 0 ? selectedPayments[0]?._id : undefined;
        //         let isDisabled = (clientIdOfSelectedPayments && clientIdOfSelectedPayments !== item?.client_id) || (paymentFor === "products" && selectedPaymentId !== item?._id) || (clientIdOfSelectedPayments && item?.payment_for === "products" && selectedPaymentId !== item?._id);
        //         isDisabled = clientListFilterState?.linked_invoices ? false : isDisabled;
        //         return <CheckBoxComponent
        //             className={selectedPayments.find((payment: any) => payment._id === item._id) ? 'selected-row' : ''}
        //             disabled={isDisabled}
        //             checked={!!selectedPayments.find((payment: any) => payment._id === item._id)}
        //             onChange={(isChecked) => {
        //                 handlePaymentSelection(item, isChecked)
        //             }}/>
        //     }
        // },
        {
            title: 'Receipt No.',
            key: 'receipt_no',
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
            width: 180,
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
            align: 'right',
            dataIndex: 'action',
            width: 119,
            render: (item: any) => {

                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=receipt'}>
                    View Details
                </LinkComponent>
            }
        }
    ], [location]);

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
                    className={selectedPayments.find((payment: any) => payment._id === item._id) ? 'selected-row' : ''}
                    disabled={isDisabled}
                    checked={!!selectedPayments.find((payment: any) => payment._id === item._id)}
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
                return <span className={item?.client_details?.is_alias_name_set ? 'alias-name' : ''}>
                    {CommonService.extractName(item?.client_details)}
                </span>
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
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.BillingDetails(item?._id) + '?referrer=' + location.pathname + '&type=receipt'}>
                    View Details
                </LinkComponent>
            }
        }
    ], [location, selectedPayments, handlePaymentSelection, clientListFilterState]);

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
                return <span className={item?.client_details?.is_alias_name_set ? 'alias-name' : ''}>
                    {CommonService.extractName(item?.client_details) || '-'}
                </span>
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
            dataIndex: 'bill_type',
            sortable: true,
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
                return <span
                    className={item?.client_details?.is_alias_name_set ? 'alias-name' : ''}>{CommonService.extractName(item?.client_details)}</span>
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
                    <ImageConfig.CrossOutlinedIcon/>
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
        setClientListFilterState({...ClientListFilterStateInitialValues, client_id: clientId});
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams, clientId]);

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
            start_date: clientListFilterState?.start_date,
            end_date: clientListFilterState?.end_date,
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

    const openBillingAddressFormDrawer = useCallback(() => {
        setIsClientBillingAddressDrawerOpened(true);
    }, []);

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

    const handleBack = useCallback(() => {
        setIsPaymentModeModalOpen(false);
        setShowMarkAsPaidModal(true);
    }, []);

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

    const getClientBillingAddressList = useCallback(() => {
        clientId && CommonService._billingsService.GetBillingAddressList(clientId)
            .then((response: any) => {
                setGetBillingList(response?.data);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || "Failed to fetch client billing address", "error");
            });
    }, [clientId]);

    const BillingAddressStep = useCallback(() => {
        // setIsClientBillingAddressDrawerOpened(false);
        setCurrentStep('selectAddress');
        getClientBillingAddressList();
    }, [getClientBillingAddressList]);

    const handleEditBillingAddress = useCallback((values: any) => {
        // setBillingDetails((prevBillingDetails: any) => {
        //     return {
        //         ...prevBillingDetails,
        //         //  billing_address: {
        //         //     ...prevBillingDetails.billing_address,
        //         //     ...values
        //         // }
        //     }
        // });
        BillingAddressStep();
    }, [BillingAddressStep]);

    useEffect(() => {
        getClientBillingAddressList()
    }, [getClientBillingAddressList]);

    const closeBillingAddressDrawer = useCallback(() => {
        setIsClientBillingAddressDrawerOpened(false);
        getClientBillingAddressList();
    }, [getClientBillingAddressList]);

    const handleSort = useCallback((key: string, order: string) => {
        setClientListFilterState((oldState: any) => {
            const newState = {...oldState};
            newState["sort"] = {
                key,
                order
            }
            return newState;
        });
    }, []);

    const handleEdit = useCallback((address: any) => {
        setCurrentStep('editAddress');
        setTempSelectedAddress(address);
    }, []);

    const onBillingAddressFormSubmit = useCallback((billingAddressId: string) => {
        CommonService._client.UpdateClientBillingAddress(billingAddressId, {is_default: true})
            .then((response: any) => {
                getClientBillingAddressList();
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                BillingAddressStep();
            })
            .catch((error: any) => {
                console.log(error);
            });
    }, [BillingAddressStep, getClientBillingAddressList]);

    const handleDeleteBillingAddress = useCallback((billingAddress: any) => {
        CommonService.onConfirm({
            image: ImageConfig.ConfirmationLottie,
            showLottie: true,
            confirmationTitle: 'DELETE ADDRESS',
            confirmationSubTitle: <div className={'text-center mrg-bottom-20'}>Are you sure you want to permanently
                delete <br/> this address?</div>,

        }).then(() => {
            CommonService._billingsService.DeleteBillingAddress(billingAddress?._id, billingAddress)
                .then((response: any) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    closeBillingAddressDrawer();
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error in deleting", "error");
            });
        })

    }, [closeBillingAddressDrawer]);
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
                                <DateRangePickerComponentV2
                                    value={clientListFilterState.date_range}
                                    onDateChange={(value: any) => {
                                        console.log(value);
                                        setClientListFilterState((oldState: any) => {
                                            const newState = {...oldState};
                                            if (value) {
                                                newState['start_date'] = moment(value[0])?.format('YYYY-MM-DD');
                                                newState['end_date'] = moment(value[1])?.format('YYYY-MM-DD');
                                                console.log(newState);
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
                                (currentTab === 'completedPayments' || currentTab === 'pendingPayments') && !clientId &&
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
                            {
                                clientId &&
                                <ButtonComponent className={'mrg-right-10'} prefixIcon={<ImageConfig.BillingListIcon/>}
                                                 onClick={openBillingAddressFormDrawer}>
                                    Billing Address
                                </ButtonComponent>
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
                            {!clientId &&
                                <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                                 onClick={() => navigate(CommonService._routeConfig.AddNewReceipt())}>
                                    New Receipt
                                </ButtonComponent>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                !clientId &&
                <div className={'consolidation-switch-wrapper'}>
                    <div className={'consolidation-switch'}>
                        <SwitchComponent
                            label={''}
                            disabled={selectedPayments?.length === 0 || currentTab === 'consolidatedPayments' || selectedPayments[0]?.payment_for === "products"}
                            checked={selectedPayments?.length > 0 && clientListFilterState.linked_invoices}
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
            }
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
                                <div className="ts-col-lg-3 ts-col-md-6 ts-col-sm-6 billing-stats-card">
                                    <BillingStatsCardComponent
                                        title={"Total Amount"}
                                        amount={billingStats?.total_payments}
                                        icon={<ImageConfig.TotalAmount/>}
                                    />
                                </div>

                                <div className="ts-col-lg-3 ts-col-md-6 ts-col-sm-6 billing-stats-card">
                                    <BillingStatsCardComponent
                                        title={"Pending Payments"}
                                        amount={billingStats?.pending_payments}
                                        icon={<ImageConfig.PendingPayments/>}
                                    />
                                </div>
                                <div className="ts-col-lg-3 ts-col-md-6 ts-col-sm-6 billing-stats-card">
                                    <BillingStatsCardComponent
                                        title={"Completed Payments"}
                                        amount={billingStats?.completed_payments}
                                        icon={<ImageConfig.CompletedPayments/>}
                                    />
                                </div>
                                <div className="ts-col-lg-3 ts-col-md-6 ts-col-sm-6 billing-stats-card">
                                    <BillingStatsCardComponent
                                        title={"Discount Amount"}
                                        amount={billingStats?.discounts}
                                        icon={<ImageConfig.PendingAmount/>}
                                    />
                                </div>
                            </div>
                        </>
                    }
                </div>
            }
            <TabsWrapperComponent className={clientId ? "client-billing" : "admin-billing"}>
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
                    {
                        !clientId &&
                        <TabComponent className={'payment-details-tab'} label={'Consolidated Payments'}
                                      value={'consolidatedPayments'}/>
                    }
                </TabsComponent>
                <TabContentComponent value={'pendingPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent url={APIConfig.PENDING_PAYMENT_LIST.URL}
                                           extraPayload={
                                               clientListFilterState
                                           }
                                           noDataText={(<div className={'no-client-text-wrapper'}>
                                               <div>{clientListFilterState.search ?
                                                   <img src={ImageConfig.Search} alt="client-search"/> : ''}</div>
                                               <div
                                                   className={'no-client-heading mrg-bottom-15'}>{clientListFilterState?.search ? 'Sorry, no results found!' : ''}</div>
                                               <div className={'no-client-description'}>
                                                   {clientListFilterState?.search ? 'There is no payment available by the client name you have searched.' : 'Currently there is no pending payment'}
                                               </div>
                                           </div>)}
                                           method={APIConfig.PENDING_PAYMENT_LIST.METHOD}
                                           columns={clientId ? clientPendingPaymentColumn : pendingPaymentColumn}
                                           moduleName={PENDING_PAYMENTS_MODULE}
                    />
                </TabContentComponent>
                <TabContentComponent value={'completedPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent url={APIConfig.COMPLETE_PAYMENT_LIST.URL}
                                           noDataText={(<div className={'no-client-text-wrapper'}>
                                               <div>{clientListFilterState.search ?
                                                   <img src={ImageConfig.Search} alt="client-search"/> : ''}</div>
                                               <div
                                                   className={'no-client-heading mrg-bottom-15'}>{clientListFilterState.search ? 'Sorry, no results found!' : ''}</div>
                                               <div className={'no-client-description'}>
                                                   {clientListFilterState.search ? 'There is no payment available by the client name you have searched.' : 'Currently there is no completed payment'}
                                               </div>
                                           </div>)}
                                           method={APIConfig.COMPLETE_PAYMENT_LIST.METHOD}
                                           extraPayload={clientListFilterState}
                                           columns={clientId ? clientCompletePaymentListColumn : completePaymentListColumn}
                    />
                </TabContentComponent>
                {
                    !clientId &&
                    <TabContentComponent value={'consolidatedPayments'} selectedTab={currentTab}>
                        <TableWrapperComponent
                            url={APIConfig.CONSOLIDATED_PAYMENT_LIST.URL}
                            extraPayload={
                                clientListFilterState
                            }
                            noDataText={(<div className={'no-client-text-wrapper'}>
                                <div>{clientListFilterState.search ?
                                    <img src={ImageConfig.Search} alt="client-search"/> : ''}</div>
                                <div
                                    className={'no-client-heading mrg-bottom-15'}>{clientListFilterState.search ? 'Sorry, no results found!' : ''}</div>
                                <div className={'no-client-description'}>
                                    {clientListFilterState.search ? 'There is no payment available by the client name you have searched.' : 'Currently there is no consolidated payments.'}
                                </div>
                            </div>)}
                            method={APIConfig.CONSOLIDATED_PAYMENT_LIST.METHOD}
                            onSort={handleSort}
                            columns={consolidatedPayments}
                        />
                    </TabContentComponent>
                }
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
                        label={"Total Amount (Inc.tax)"}>
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
                                                 size={'medium'}
                                                 className={'mrg-right-10'}
                                                 onClick={closePaymentModeModal}
                                >
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent variant={'contained'}
                                                 color={'primary'}
                                                 size={'medium'}
                                                 disabled={selectedPayments.length === 0 || !selectedPaymentMode || isPaymentsAreBeingMarkedAsPaid}
                                                 isLoading={isPaymentsAreBeingMarkedAsPaid}
                                                 onClick={markPaymentsAsPaid}
                                >
                                    Confirm Payment
                                </ButtonComponent>
                            </>
                            }
            >
                <div className={'modal-content-wrapper back-button'}>
                    <IconButtonComponent onClick={handleBack}>
                        <ImageConfig.NavigateBack/>
                    </IconButtonComponent>
                    <span className={'back-text'}>Back</span>
                </div>
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

            <DrawerComponent isOpen={isClientBillingAddressDrawerOpened}
                             onClose={closeBillingAddressDrawer}
                             showClose={true}>
                {
                    currentStep === 'selectAddress' && <>
                        <FormControlLabelComponent label={"Select Billing Address"}/>
                        <div className={'select-billing-address'}>
                            {getBillingList?.length > 0 && getBillingList?.map((item: any, index: number) => {
                                return <div className={'select-address-card'}>
                                    <div className={'select-address-card-header'}>
                                        <div className={'btn-heading-wrapper'}>
                                            <div
                                                className={'card-heading'}>{item?.name}</div>
                                            <div className={'mrg-left-10'}>
                                                {item?.is_default && <ChipComponent className={'draft'} label={'Default'}/>}
                                            </div>
                                        </div>
                                        <div className={'btn-wrapper'}>
                                            <MenuDropdownComponent className={'billing-details-drop-down-menu'} menuBase={
                                                <IconButtonComponent>
                                                    <ImageConfig.MoreVerticalIcon/>
                                                </IconButtonComponent>
                                            } menuOptions={[
                                                <ListItemButton onClick={() => handleEdit(item)}>
                                                    Edit
                                                </ListItemButton>,
                                                <ListItemButton onClick={() => handleDeleteBillingAddress(item)}>
                                                    Delete
                                                </ListItemButton>,
                                                <ListItemButton onClick={() => onBillingAddressFormSubmit(item?._id)}>
                                                    Make as Default
                                                </ListItemButton>,
                                            ]}/>

                                        </div>
                                    </div>
                                    <div className={'mrg-15'}>
                                        {item?.address_line}, {item?.city}, {item?.state}, {item?.country} {item?.zip_code}
                                    </div>
                                </div>
                            })
                            }
                            <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                             onClick={() => setCurrentStep("addAddress")} variant={"text"}>Add New
                                Address</ButtonComponent>
                        </div>

                    </>
                }
                {(currentStep === "editAddress" && clientId) &&
                    <EditBillingAddressComponent billing_address={tempSelectedAddress}
                                                 clientId={clientId}
                                                 onCancel={BillingAddressStep}
                                                 afterSave={getClientBillingAddressList}
                                                 onSave={handleEditBillingAddress}/>
                }


                {
                    currentStep === "addAddress" &&
                    <AddBillingAddressComponent clientId={clientId}
                                                onCancel={BillingAddressStep}
                                                onSave={handleEditBillingAddress}
                                                afterSave={getClientBillingAddressList}

                    />
                }
            </DrawerComponent>
        </div>
    );

};

export default BillingListScreen;
