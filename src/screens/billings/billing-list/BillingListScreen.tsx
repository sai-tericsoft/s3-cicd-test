import "./BillingListScreen.scss";
import {useCallback, useEffect, useMemo, useState} from "react";
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
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import {IRootReducerState} from "../../../store/reducers";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {useSearchParams} from "react-router-dom";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import DatePickerComponent from "../../../shared/components/form-controls/date-picker/DatePickerComponent";

interface PaymentListComponentProps {

}

const PENDING_PAYMENTS_MODULE = 'PENDING_PAYMENTS_MODULE';

type PaymentsListTabType = 'pendingPayments' | 'completedPayments';
const PaymentsListTabTypes = ['pendingPayments', 'completedPayments'];
const BillingListScreen = (props: PaymentListComponentProps) => {

    const dispatch = useDispatch();
    const [billingStats, setBillingStats] = useState<any>(null);

    const [currentTab, setCurrentTab] = useState<PaymentsListTabType>("pendingPayments");
    const [selectedPayments, setSelectedPayments] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState<boolean>(false);
    const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = useState<boolean>(false);
    const [isPaymentsAreBeingMarkedAsPaid, setIsPaymentsAreBeingMarkedAsPaid] = useState<boolean>(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<any>(null);
    const clientId = searchParams.get("clientId");

    const {
        paymentModes
    } = useSelector((state: IRootReducerState) => state.staticData);

    const [clientListFilterState, setClientListFilterState] = useState<any>({
        search: "",
    });

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
                return <CheckBoxComponent
                    className={selectedPayments.includes(item) ? 'selected-row' : ''}
                    disabled={clientIdOfSelectedPayments && clientIdOfSelectedPayments !== item?.client_id}
                    checked={selectedPayments.includes(item)}
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
                return <LinkComponent route={CommonService._routeConfig.BillingDetails(item?._id, 'invoice')}>
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
                                {item?.client_details?.first_name} {item?.client_details?.last_name}
                            </>
                    }
                </>
            }
        },
        {
            title: 'Phone Number',
            key: 'phone_number',
            dataIndex: 'phone',
            width: 200,
            align: 'center',
            render: (item: any) => {
                return <>{item?.client_details?.primary_contact_info?.phone}</>
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
                return <>{Misc.CURRENCY_SYMBOL} {item?.total}</>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            width: 100,
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.BillingDetails(item?._id, 'invoice')}>
                    View Details
                </LinkComponent>
            }
        }
    ], [handlePaymentSelection, selectedPayments]);

    const completePaymentListColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: 'Receipt No.',
            key: 'receipt_no',
            align: 'center',
            fixed: 'left',
            dataIndex: 'receipt_number',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.BillingDetails(item?._id, 'receipt')}>
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
            title: 'Phone Number',
            key:  'phone_number',
            dataIndex: 'phone',
            align: 'center',
            render: (item: any) => {
                return <>
                    {!clientId && item?.client_details?.primary_contact_info?.phone}
                </>
            }
        },
        {
            title: 'Total Amount',
            key: 'amount',
            align: 'center',
            dataIndex: 'amount',
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL} {item?.amount}</>
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
                    <ChipComponent className={className} label={item?.payment_for}/>
                </>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.BillingDetails(item?._id, 'receipt')}>
                    View Details
                </LinkComponent>
            }
        }
    ], []);

    const clientPendingPaymentColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 50,
            fixed: 'left',
            render: (item: any) => {
                const clientIdOfSelectedPayments = selectedPayments?.length > 0 ? selectedPayments[0]?.client_id : undefined;
                return <CheckBoxComponent
                    disabled={clientIdOfSelectedPayments && clientIdOfSelectedPayments !== item?.client_id}
                    checked={selectedPayments.includes(item)}
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
            width: 193,
            align: 'center',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.BillingDetails(item?._id, 'invoice')}>
                    {item?.appointment_id}
                </LinkComponent>
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
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL} {item?.total}</>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.BillingDetails(item?._id, 'invoice')}>
                    View Details
                </LinkComponent>
            }
        }
    ], [handlePaymentSelection, selectedPayments]);

    const clientCompletePaymentListColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: 'Receipt No.',
            key: 'receipt_no',
            align: 'center',
            fixed: 'left',
            dataIndex: 'receipt_number',
            render: (item: any) => {
                return <LinkComponent route={CommonService._routeConfig.BillingDetails(item?._id, 'receipt')}>
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
            title: 'Total Amount',
            key: 'amount',
            align: 'center',
            dataIndex: 'amount',
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL} {item?.amount}</>
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
                return <LinkComponent route={CommonService._routeConfig.BillingDetails(item?._id, 'receipt')}>
                    View Details
                </LinkComponent>
            }
        }
    ], []);

    const markAsPaidTableColumns: ITableColumn[] = useMemo<any>(() => [
        {
            title: 'Appointment Date',
            key: 'date',
            dataIndex: 'date',
            width: 180,
            align: 'center',
            fixed: 'left',
            render: (item: any) => {
                return <>
                    {CommonService.convertDateFormat2(item?.appointment_details?.appointment_date)}</>
            }
        },
        {
            title: 'Appointment ID',
            key: 'appointment_id',
            dataIndex: 'appointment_id',
            width: 250,
            align: 'center',
        },
        {
            title: 'Amount (Inc. Tax)',
            key: 'amount',
            dataIndex: 'amount',
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL} {item?.total} </>
            }
        },
        {
            title: '',
            key: 'action',
            dataIndex: 'action',
            width: 150,
            align: 'center',
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

    const fetchBillingStats = useCallback(() => {
        CommonService._billingsService.GetBillingStatsAPICall()
            .then((response: IAPIResponseType<any>) => {
                setBillingStats(response?.data);
            }).catch((error: any) => {
            setBillingStats(undefined);
        })
    }, []);

    const markPaymentsAsPaid = useCallback(() => {
        const payload = {
            invoice_ids: selectedPayments.map((payment: any) => payment?._id),
            payment_mode: selectedPaymentMode
        };
        setIsPaymentsAreBeingMarkedAsPaid(true);
        CommonService._billingsService.MarkPaymentsAsPaidAPICall(payload)
            .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response?.message || "Payments marked as paid successfully", "success");
                    closePaymentModeModal();
                    setSelectedPayments([]);
                    setSelectedPaymentMode('');
                    setIsPaymentsAreBeingMarkedAsPaid(false);
                    CommonService._communications.TableWrapperRefreshSubject.next({
                        moduleName: PENDING_PAYMENTS_MODULE
                    });
                    fetchBillingStats();
                }
            )
            .catch((error: any) => {
                CommonService._alert.showToast(error?.error || error?.errors || "Failed to mark payments marked as paid", "error");
                setIsPaymentsAreBeingMarkedAsPaid(false);
            });
    }, [selectedPayments, fetchBillingStats, closePaymentModeModal, selectedPaymentMode]);

    useEffect(() => {
        fetchBillingStats();
    }, [fetchBillingStats]);

    return (
        <div className={'payment-list-component list-screen'}>
            <div className={'list-screen-header'}>
                <div className={'list-search-filters'}>
                    <div className="ts-row">
                        {!clientId && <div className="ts-col-md-6 ts-col-lg-3">
                            <SearchComponent
                                label={"Search for clients"}
                                value={clientListFilterState.search}
                                onSearchChange={(value) => {
                                    setClientListFilterState({...clientListFilterState, search: value})
                                }}
                            />
                        </div>
                        <div className="ts-col-lg-6"/>
                        <div className="ts-col-lg-3 d-flex ts-justify-content-end">
                            {currentTab === 'pendingPayments' &&
                                <>
                                    <ButtonComponent variant={'outlined'}
                                                     className={'mrg-right-10'}
                                                     disabled={selectedPayments.length === 0}
                                                     onClick={openMarkAsPaidModal}
                                                     prefixIcon={<ImageConfig.CircleCheck/>}>
                                        Mark as paid
                                    </ButtonComponent>&nbsp;&nbsp;
                                </>
                            }
                            <LinkComponent route={CommonService._routeConfig.AddNewReceipt()}>
                                <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>
                                    New Receipt
                                </ButtonComponent>
                            </LinkComponent>
                        </div>

                    </div>
                </div>
                        </div>}
                        {
                            clientId && currentTab === 'completedPayments' && <div className="ts-col-md-6 ts-col-lg-3">
                                <SelectComponent options={['Status']} label={'Status'} fullWidth={true}/>
                            </div>
                        }
                        {
                            clientId && <div className="ts-col-md-6 ts-col-lg-3">
                                <DatePickerComponent name={"date"}/>
                            </div>
                        }
                    </div>
                </div>
                <div className="list-options">
                    {currentTab === 'pendingPayments' &&
                        <>
                            <ButtonComponent variant={'outlined'}
                                             className={'mrg-right-10'}
                                             disabled={selectedPayments.length === 0}
                                             onClick={openMarkAsPaidModal}
                                             prefixIcon={<ImageConfig.CircleCheck/>}>
                                Mark as paid
                            </ButtonComponent>&nbsp;&nbsp;
                        </>
                    }
                    {
                        !clientId && <LinkComponent route={CommonService._routeConfig.AddNewReceipt()}>
                            <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>
                                New Receipt
                            </ButtonComponent>
                        </LinkComponent>
                    }
                </div>
            </div>
            <TabsWrapperComponent>
                <TabsComponent value={currentTab}
                               allowScrollButtonsMobile={false}
                               variant={"fullWidth"}
                               onUpdate={handleTabChange}>
                    <TabComponent
                        className={'payment-details-tab'}
                        label={`Pending Payments(${(billingStats?.count !== undefined) ? billingStats?.count : '-'})`}
                        value={'pendingPayments'}/>
                    <TabComponent className={'payment-details-tab'} label={'Completed Payments'} value={'completedPayments'}/>
                </TabsComponent>

                <TabContentComponent value={'pendingPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent
                        url={clientId ? APIConfig.CLIENT_PENDING_PAYMENT_LIST.URL(clientId) : APIConfig.PENDING_PAYMENT_LIST.URL}
                        extraPayload={clientListFilterState}
                        method={APIConfig.PENDING_PAYMENT_LIST.METHOD}
                        columns={clientId ? clientPendingPaymentColumn : pendingPaymentColumn}
                        moduleName={PENDING_PAYMENTS_MODULE}
                    />
                </TabContentComponent>
                <TabContentComponent value={'completedPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent
                        url={clientId ? (APIConfig.CLIENT_COMPLETE_PAYMENT_LIST.URL) : (APIConfig.COMPLETE_PAYMENT_LIST.URL)}
                        method={APIConfig.COMPLETE_PAYMENT_LIST.METHOD}
                        extraPayload={clientListFilterState}
                        columns={clientId ?clientCompletePaymentListColumn:completePaymentListColumn}/>
                </TabContentComponent>
            </TabsWrapperComponent>
            {/*Outstanding Balance Modal start*/}
            <ModalComponent isOpen={showMarkAsPaidModal}
                            className={'mark-as-paid-outstanding-balance-modal'}
                            title={'Outstanding Balance'}
                            modalFooter={<div className="mrg-top-20">
                                <ButtonComponent variant={'outlined'}
                                                 className={'mrg-right-10'}
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
                <CardComponent title={'Client Details'} className={'client-details-card'}>
                    <div className="ts-row">
                        <div className="ts-col-lg-6">
                            <DataLabelValueComponent
                                direction={"row"}
                                label={<>
                                    <ImageConfig.PersonIcon/>
                                    <span className={'client-details-label'}>Client Name</span>
                                </>}>
                                {CommonService.extractName(selectedPayments[0]?.client_details)}
                            </DataLabelValueComponent>
                        </div>
                        <div className="ts-col-lg-6">
                            <DataLabelValueComponent
                                direction={"row"}
                                label={<>
                                    <ImageConfig.CallIcon/>
                                    <span className={'client-details-label'}>Phone Number</span>
                                </>}>
                                {selectedPayments[0]?.client_details?.primary_contact_info?.phone}
                            </DataLabelValueComponent>
                        </div>
                    </div>
                </CardComponent>
                <TableComponent
                    columns={markAsPaidTableColumns}
                    data={selectedPayments}
                />
                <div className={"mark-as-paid-total-outstanding-balance"}>
                    <DataLabelValueComponent
                        direction={"row"}
                        label={"Total Amount (Inc.Tax)"}>
                        <span className="mrg-left-5">
                            {Misc.CURRENCY_SYMBOL} {selectedPayments.reduce((acc: any, payment: any) => acc + parseInt(payment?.total), 0)}
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
                <FormControlLabelComponent label={"Select Mode Of Payment"}/>
                <SelectComponent
                    options={paymentModes || []}
                    fullWidth={true}
                    required={true}
                    label={"Mode Of Payment"}
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
