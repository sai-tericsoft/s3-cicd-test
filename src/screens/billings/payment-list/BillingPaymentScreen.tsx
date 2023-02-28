import "./BillingPaymentScreen.scss";
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

interface PaymentListComponentProps {

}

const PENDING_PAYMENTS_MODULE = 'PENDING_PAYMENTS_MODULE';
const BillingPaymentScreen = (props: PaymentListComponentProps) => {

    const dispatch = useDispatch();

    const [currentTab, setCurrentTab] = useState<any>("pendingPayments");
    const [selectedPayments, setSelectedPayments] = useState<any[]>([]);
    const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState<boolean>(false);
    const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = useState<boolean>(false);
    const [isPaymentsAreBeingMarkedAsPaid, setIsPaymentsAreBeingMarkedAsPaid] = useState<boolean>(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<any>(null);

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

    const removePaymentFromSelectedMarkAsPaidList = useCallback((payment: any) => {
        setSelectedPayments(selectedPayments.filter((item: any) => item._id !== payment._id));
    }, [selectedPayments]);

    const completePaymentListColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: 'Receipt No.',
            key: 'receipt_no',
            align: 'center',
            fixed: 'left',
            dataIndex: 'receipt_number',
            render: (item: any) => {
                return <LinkComponent route={""}>
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
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{item?.amount}</>
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
                return <LinkComponent route={""}>
                    View Details
                </LinkComponent>
            }
        }
    ], []);

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
                return (
                    <LinkComponent route={""}>
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
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL} {item?.amount} </>
            }
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            dataIndex: 'action',
            render: (item: any) => {
                return <LinkComponent route={""}>
                    View Details
                </LinkComponent>
            }
        }
    ], [handlePaymentSelection, selectedPayments]);

    const markAsPaidTableColumns: ITableColumn[] = useMemo<any>(() => [
        {
            title: 'Appointment Date',
            key: 'date',
            dataIndex: 'date',
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <>
                    {CommonService.convertDateFormat2(item?.appointment_details?.appointment_date)}</>
            }
        },
        {
            title: 'Appointment ID',
            key: 'appointment_id',
            dataIndex: 'appointment_id',
            width: 150,
            align: 'center',
        },
        {
            title: 'Amount (Inc. Tax)',
            key: 'amount',
            dataIndex: 'amount',
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <>{Misc.CURRENCY_SYMBOL} {item?.amount} </>
            }
        },
        {
            title: '',
            key: 'action',
            dataIndex: 'action',
            width: 150,
            align: 'center',
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
        // searchParams.set("currentStep", value);
        // setSearchParams(searchParams);
        setCurrentTab(value);
    }, []);

    const openMarkAsPaidModal = useCallback(() => {
        setShowMarkAsPaidModal(true);
    }, []);

    const closeMarkAsPaidModal = useCallback(() => {
        setShowMarkAsPaidModal(false);
    }, []);

    const openPaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(true);
    }, []);

    const closePaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(false);
        setSelectedPaymentMode('');
    }, []);

    const handlePaymentMarkingConfirmation = useCallback(() => {
        closeMarkAsPaidModal();
        openPaymentModeModal();
    }, [openPaymentModeModal, closeMarkAsPaidModal]);

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
                }
            )
            .catch((error: any) => {
                CommonService._alert.showToast(error?.error || error?.errors || "Failed to mark payments marked as paid", "error");
                setIsPaymentsAreBeingMarkedAsPaid(false);
            });
    }, [selectedPayments, closePaymentModeModal, selectedPaymentMode]);

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
                    {currentTab === 'pendingPayments' &&
                        <>
                            <ButtonComponent variant={'outlined'}
                                             className={'mrg-right-10'}
                                             disabled={selectedPayments.length === 0}
                                             onClick={openMarkAsPaidModal}
                                             prefixIcon={<ImageConfig.CircleCheck/>}>
                                Mark as paid {selectedPayments.length > 0 && <> ( {selectedPayments.length} ) </>}
                            </ButtonComponent>&nbsp;&nbsp;
                        </>
                    }
                    <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>
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
                                           columns={pendingPaymentColumn}
                                           moduleName={PENDING_PAYMENTS_MODULE}
                    />
                </TabContentComponent>
                <TabContentComponent value={'completedPayments'} selectedTab={currentTab}>
                    <TableWrapperComponent url={APIConfig.COMPLETE_PAYMENT_LIST.URL}
                                           method={APIConfig.COMPLETE_PAYMENT_LIST.METHOD}
                                           extraPayload={clientListFilterState}
                                           columns={completePaymentListColumn}/>
                </TabContentComponent>
            </TabsWrapperComponent>
            <ModalComponent isOpen={showMarkAsPaidModal}
                            title={'Outstanding Balance'}
                            modalFooter={<>
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
                            </>
                            }
            >
                <CardComponent title={'Client Details'}>
                    <div className="ts-row">
                        <div className="ts-col-lg-6">
                            <DataLabelValueComponent label={"Client Name"}>
                                {CommonService.extractName(selectedPayments[0]?.client_details)}
                            </DataLabelValueComponent>
                        </div>
                        <div className="ts-col-lg-6">
                            <DataLabelValueComponent label={"Phone Number"}>
                                {selectedPayments[0]?.client_details?.primary_contact_info?.phone}
                            </DataLabelValueComponent>
                        </div>
                    </div>
                </CardComponent>
                <TableComponent
                    columns={markAsPaidTableColumns}
                    data={selectedPayments}
                />
            </ModalComponent>
            <ModalComponent isOpen={isPaymentModeModalOpen}
                            className={'mark-payment-as-paid-payment-mode-modal'}
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
                    label={"Mode Of Payment"}
                    onUpdate={(value: any) => {
                        setSelectedPaymentMode(value);
                    }
                    }
                />
            </ModalComponent>
        </div>
    );

};

export default BillingPaymentScreen;
