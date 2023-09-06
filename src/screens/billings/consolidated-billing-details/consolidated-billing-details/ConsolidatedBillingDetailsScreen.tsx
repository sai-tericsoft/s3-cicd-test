import "./ConsolidatedBillingDetailsScreen.scss";
import {CommonService} from "../../../../shared/services";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig, Misc} from "../../../../constants";
import MenuDropdownComponent from "../../../../shared/components/menu-dropdown/MenuDropdownComponent";
import {ListItem} from "@mui/material";
import PageHeaderComponent from "../../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useState} from "react";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {getBillingFromAddress, getBillingSettings} from "../../../../store/actions/billings.action";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import CardComponent from "../../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../../shared/components/data-label-value/DataLabelValueComponent";
import TableComponent from "../../../../shared/components/table/TableComponent";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import TextAreaComponent from "../../../../shared/components/form-controls/text-area/TextAreaComponent";
import DrawerComponent from "../../../../shared/components/drawer/DrawerComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {RadioButtonComponent} from "../../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import EditBillingAddressComponent from "../../edit-billing-address/EditBillingAddressComponent";
import AddBillingAddressComponent from "../../add-billing-address/AddBillingAddressComponent";
import SelectComponent from "../../../../shared/components/form-controls/select/SelectComponent";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import ModalComponent from "../../../../shared/components/modal/ModalComponent";
import commonService from "../../../../shared/services/common.service";
import _ from "lodash";

interface ConsolidatedBillingDetailsScreenProps {

}

const ConsolidatedBillingDetailsScreen = (props: ConsolidatedBillingDetailsScreenProps) => {

        const dispatch = useDispatch();
        const navigate = useNavigate();
        const location = useLocation();
        const {consolidatedBillingId} = useParams();
        const [searchParams] = useSearchParams();
        const [isBillingDetailsBeingLoaded, setIsBillingDetailsBeingLoaded] = useState<boolean>(false);
        const [isBillingDetailsBeingLoading, setIsBillingDetailsBeingLoading] = useState<boolean>(false);
        const [isBillingDetailsBeingLoadingFailed, setIsBillingDetailsBeingLoadingFailed] = useState<boolean>(false);
        const [billingDetails, setBillingDetails] = useState<any>(undefined);
        const [thankYouNote, setThankYouNote] = useState<any>('');
        const [comments, setComments] = useState<any>('');
        const [getBillingList, setGetBillingList] = useState<any>([]);
        const {billingFromAddress} = useSelector((state: IRootReducerState) => state.billings);
        const [currentStep, setCurrentStep] = useState<"selectAddress" | "editAddress" | "addAddress">("selectAddress");
        const [selectedAddress, setSelectedAddress] = useState<any>(null);
        const [tempSelectedAddress, setTempSelectedAddress] = useState<any>(null);
        const [selectedChanged, setSelectedChanged] = useState<boolean>(false);
        const [isClientBillingAddressDrawerOpened, setIsClientBillingAddressDrawerOpened] = useState<boolean>(false);
        const [clientLinkedList, setClientLinkedList] = useState<any>([]);
        const [isBillingListLoading, setIsBillingListLoading] = useState<boolean>(false);
        const [isBillingListLoaded, setIsBillingListLoaded] = useState<boolean>(false);
        const [isBillingBeingMarkedAsPaid, setIsBillingBeingMarkedAsPaid] = useState<boolean>(false);
        const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");
        const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = useState<boolean>(false);
        const [currentClientIndex, setCurrentClientIndex] = useState<number>(0);
        const {
            paymentModes
        } = useSelector((state: IRootReducerState) => state.staticData);
        const {billingSettings} = useSelector((state: IRootReducerState) => state.billings);

        useEffect(() => {
            dispatch(getBillingFromAddress())
            dispatch(getBillingSettings())
        }, [dispatch]);

        const fetchBillingDetails = useCallback(() => {
            setIsBillingDetailsBeingLoading(true);
            setIsBillingDetailsBeingLoadingFailed(false);
            setIsBillingDetailsBeingLoaded(false);
            consolidatedBillingId && CommonService._billingsService.GetConsolidatedBillingDetails(consolidatedBillingId, {})
                .then((response) => {
                    setIsBillingDetailsBeingLoading(false);
                    setIsBillingDetailsBeingLoaded(true);
                    setBillingDetails(response.data);
                }).catch((error) => {
                    setBillingDetails(undefined)
                    setIsBillingDetailsBeingLoading(false);
                    setIsBillingDetailsBeingLoadingFailed(true);
                });
        }, [consolidatedBillingId]);

        useEffect(() => {
            fetchBillingDetails();
        }, [fetchBillingDetails]);

        useEffect(() => {
            if (searchParams.get('type') === 'consolidatedInvoice') {
                setThankYouNote(billingSettings?.default_thankyou_note);
            } else {
                setThankYouNote(billingDetails?.thankyou_note);
            }
            setComments(billingDetails?.comments);
        }, [billingSettings?.default_thankyou_note, billingDetails?.thankyou_note, searchParams, billingDetails?.comments]);

        useEffect(() => {
            const referrer: any = searchParams.get("referrer");
            dispatch(setCurrentNavParams("View Invoice", null, () => {
                if (referrer) {
                    navigate(referrer);
                } else {
                    navigate(CommonService._routeConfig.BillingList());
                }
            }));
        }, [navigate, dispatch, searchParams]);

        const removePayment = useCallback((item: any, index: number,billingDetails:any,currentClientIndex:number) => {
            const tempBillingDetails = _.cloneDeep(billingDetails);
            tempBillingDetails.bills_details[currentClientIndex].bills.splice(index, 1);
            tempBillingDetails.bills_details[currentClientIndex].totalAmount = tempBillingDetails.bills_details[currentClientIndex].bills.reduce((acc: any, item: any) => {
                return acc + item.total;
            }, 0);
            tempBillingDetails.bills_details[currentClientIndex].totalDiscount = tempBillingDetails.bills_details[currentClientIndex].bills.reduce((acc: any, item: any) => {
                return acc + item.discount;
            }, 0);
            tempBillingDetails.bills_details[currentClientIndex].totalPayableAmount = tempBillingDetails.bills_details[currentClientIndex].bills.reduce((acc: any, item: any) => {
                return acc + item.payable_amount;
            }, 0);
            tempBillingDetails.payable_amount = tempBillingDetails.bills_details.reduce((acc: any, item: any) => {
                return acc + item.totalPayableAmount;
            }, 0);
            tempBillingDetails.discount = tempBillingDetails.bills_details.reduce((acc: any, item: any) => {
                return acc + item.totalDiscount;
            }, 0);
            tempBillingDetails.total = tempBillingDetails.bills_details.reduce((acc: any, item: any) => {
                return acc + item.totalAmount;
            }, 0);
            // eslint-disable-next-line array-callback-return
            tempBillingDetails.bill_ids = tempBillingDetails.bill_ids.map((billId: any) => {
                if (billId !== item._id) {
                    return item._id
                }
            })
            setBillingDetails(tempBillingDetails);
        }, []);

        const handleRemovePayment = useCallback((item: any, index: number) => () => {
            commonService.openConfirmationDialog({
                confirmationTitle: "REMOVE RECEIPT",
                confirmationSubTitle: "Are you sure you want to remove the\n" +
                    "selected receipt?",
                image: `${ImageConfig.confirmImage}`,
                yes: {
                    text: "Yes",
                    color: "primary"
                },
                no: {
                    text: "No",
                    color: "primary"
                }
            }).then((response: any) => {
                removePayment(item, index,billingDetails,currentClientIndex)
            }).catch((error: any) => {
            })
        }, [billingDetails,currentClientIndex,removePayment]);

        const consolidatedDetailsColumn: any = [
            {
                title: CommonService.capitalizeFirstLetter(billingDetails?.bill_type) + ' No.',
                key: billingDetails?.bill_type,
                dataIndex: billingDetails?.bill_type,
                fixed: 'left',
                render: (item: any) => {
                    return <>{item?.invoice_number ? item?.invoice_number : item?.receipt_number}</>
                }
            },
            {
                title: 'Date and Time',
                key: 'created_at',
                dataIndex: 'created_at',
                render: (item: any) => {
                    return <>{CommonService.convertDateFormat2(item?.created_at, "DD-MMM-YYYY  hh:mm A") || '-'}</>
                }

            },
            {
                title: 'Provider',
                key: 'provider',
                dataIndex: 'provider',
                align: 'center',
                render: (item: any) => {
                    return <>{CommonService.extractName(item?.provider_details)}<br/>
                        {item?.provider_details?.primary_contact_info?.phone || '-'}</>
                }
            },
            {
                title: 'Service Description',
                key: 'service_description',
                dataIndex: 'service_description',
                width: 210,

                render: (item: any) => {
                    return <>{item?.service_details?.name || '-'}
                        <br/>{CommonService.capitalizeFirstLetter(item?.appointment_type)}({item?.duration}minutes)
                    </>
                }
            },
            {
                title: 'Rate',
                key: 'payable_amount',
                dataIndex: 'payable_amount',
                align: 'center',
                render: (item: any) => {
                    return <>{item?.payable_amount ? <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.payable_amount)}</> : '-'}</>
                }
            },
            {
                title: 'Quantity',
                key: 'qty',
                dataIndex: 'qty',
                align: 'center',
                render: (item: any) => {
                    return <>{item?.qty || "-"}</>
                }
            },
            {
                title: 'Discount',
                key: 'discount',
                dataIndex: 'discount',
                align: 'center',
                render: (item: any) => {
                    return <>{item?.discount ? <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.discount)}</> : "-"}</>
                }
            },
            {
                title: 'Amount',
                key: 'total',
                dataIndex: 'total',
                align: 'center',
                render: (item: any) => {
                    return <>{item?.total ? <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(item?.total)}</> : "-"}</>
                }
            },
            {
                title: "",
                dataIndex: "actions",
                key: "actions",
                fixed: 'right',
                width: 70,
                render: (item: any, index: any) => {
                    return <IconButtonComponent onClick={handleRemovePayment(item, index)}>
                        <ImageConfig.CircleCancel/>
                    </IconButtonComponent>
                }
            }
        ]


        const getClientBillingAddressList = useCallback((clientId?: string) => {
            setIsBillingListLoading(true);
            setIsBillingListLoaded(false);
            clientId && CommonService._billingsService.GetBillingAddressList(clientId)
                .then((response: any) => {
                    setIsBillingListLoading(false);
                    setIsBillingListLoaded(true);
                    setGetBillingList(response?.data);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || "Failed to fetch client billing address", "error");
                });
        }, []);

        useEffect(() => {
            if (billingDetails?.client_id !== undefined) {
                getClientBillingAddressList(billingDetails?.client_id)
            }
        }, [getClientBillingAddressList, billingDetails?.client_id]);

        const handleSelectChange = useCallback((value: any) => {
            getClientBillingAddressList(value);
        }, [getClientBillingAddressList]);

        useEffect(() => {
            // Initialize selectedAddress with the default address when the component mounts
            const defaultAddress = getBillingList.find((item: any) => item.is_default);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress);
            }
        }, [getBillingList]);

        const openBillingAddressFormDrawer = useCallback(() => {
            setIsClientBillingAddressDrawerOpened(true);
        }, []);

        const closeBillingAddressFormDrawer = useCallback(() => {
            setIsClientBillingAddressDrawerOpened(false);
            setCurrentStep('selectAddress');
        }, []);

        const handleRadioButtonClick = useCallback((address: any) => {
            // Update selectedAddress when a radio button is clicked
            setTempSelectedAddress(address);
            setSelectedChanged(true);
            // setSelectedAddress(address);
        }, []);

        const handleEdit = useCallback((address: any) => {
            setCurrentStep('editAddress');
            setTempSelectedAddress(address)
        }, []);

        const handleSaveButtonClick = useCallback(() => {
            if (tempSelectedAddress) {
                setSelectedAddress(tempSelectedAddress); // Update the selected address when "Save" is clicked
            }
            setSelectedChanged(false);
            closeBillingAddressFormDrawer();
        }, [closeBillingAddressFormDrawer, tempSelectedAddress]);

        const handleEditBillingAddress = useCallback((values: any) => {
            setBillingDetails((prevBillingDetails: any) => {
                return {
                    ...prevBillingDetails,
                    billing_address: {
                        ...prevBillingDetails.billing_address,
                        ...values
                    }
                }
            });
            closeBillingAddressFormDrawer();
        }, [closeBillingAddressFormDrawer]);

        const handleSave = useCallback((thankYouNote: any, comments: any, selectedAddress: any, billingDetails: any) => {
            const payload = {
                "billing_address_id": selectedAddress?._id,
                "thankyou_note": thankYouNote,
                "comments": comments,
                "bill_ids": [...billingDetails?.bill_ids]
            }
            consolidatedBillingId && CommonService._billingsService.EditConsolidatedBill(consolidatedBillingId, payload)
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Billing updated successfully", "success");
                    navigate(CommonService._routeConfig.BillingList() + '?activeTab=consolidatedPayments');
                }).catch((error) => {
                    CommonService._alert.showToast(error.error || error.errors || "Failed to update billing", "error");
                })

        }, [consolidatedBillingId, navigate]);

        const getLinkedClientList = useCallback(() => {
            CommonService._billingsService.LinkedClientListAPICall(billingDetails?.client_id, {})
                .then((response: any) => {
                    setClientLinkedList(response?.data);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || "Failed to fetch client linked list", "error");
                });

        }, [billingDetails?.client_id]);

        useEffect(() => {
            getLinkedClientList();
        }, [getLinkedClientList]);

        const handleBillingMarkAsPaidSuccess = useCallback(() => {
            navigate(CommonService._routeConfig.BillingList() + '?referrer=' + location.pathname + '&type=receipt');
        }, [navigate, location.pathname]);

        const openPaymentModeModal = useCallback(() => {
            setIsPaymentModeModalOpen(true);
        }, []);

        const closePaymentModeModal = useCallback(() => {
            setIsPaymentModeModalOpen(false);
            setSelectedPaymentMode("");
        }, []);

        const handleBillingMarkAsPaid = useCallback(() => {
            closePaymentModeModal();
            setIsBillingBeingMarkedAsPaid(true);
            const payload = {
                "payment_mode": selectedPaymentMode,
                "_id": consolidatedBillingId
            }
            CommonService._billingsService.ConsolidatedMarkAsPaid(payload)
                .then((response: IAPIResponseType<any>) => {
                    setIsBillingBeingMarkedAsPaid(false);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Payment marked as paid successfully", "success");
                    handleBillingMarkAsPaidSuccess();
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || "Failed to mark payment as paid", "error");
                    setIsBillingBeingMarkedAsPaid(false);
                });
        }, [consolidatedBillingId, closePaymentModeModal, selectedPaymentMode, handleBillingMarkAsPaidSuccess]);


        return (
            <div className={'consolidated-billing-details-component billing-details-screen'}>
                <PageHeaderComponent
                    title={`View Consolidated ${CommonService.capitalizeFirstLetter(billingDetails?.bill_type)}`}
                    actions={<>
                        {
                            searchParams.get('type') !== 'completed' &&
                            <>
                                <ButtonComponent variant={'outlined'} color={'error'}
                                                 prefixIcon={<ImageConfig.DeleteIcon/>}>
                                    Delete
                                </ButtonComponent>&nbsp;&nbsp;
                                {searchParams.get('type') === 'consolidatedInvoice' &&
                                    <ButtonComponent
                                        prefixIcon={<ImageConfig.CircleCheck/>}
                                        onClick={openPaymentModeModal}
                                        disabled={isBillingBeingMarkedAsPaid}
                                        isLoading={isBillingBeingMarkedAsPaid}
                                    >
                                        Mark as Paid
                                    </ButtonComponent>}
                                &nbsp;&nbsp;
                            </>
                        }
                        <MenuDropdownComponent className={'billing-details-drop-down-menu'} menuBase={
                            <ButtonComponent size={'large'} variant={'outlined'} fullWidth={true}>
                                Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                            </ButtonComponent>
                        } menuOptions={[
                            <ListItem
                                // onClick={handleBillingDownload}
                            >
                                Download {CommonService.capitalizeFirstLetter(billingDetails?.bill_type)}
                            </ListItem>,
                            <ListItem
                                // onClick={handleBillingPrint}
                            >
                                Print {CommonService.capitalizeFirstLetter(billingDetails?.bill_type)}
                            </ListItem>
                        ]}
                        />
                    </>
                    }
                />
                {
                    isBillingDetailsBeingLoading && <LoaderComponent/>
                }
                {
                    isBillingDetailsBeingLoadingFailed &&
                    <StatusCardComponent title={"Failed to fetch service details"}/>
                }
                {
                    isBillingDetailsBeingLoaded && <>
                        <div className={'billing-details-container'}>
                            <div
                                className={"billing-details-header"}>
                                <div className={"billing-details-logo"}>
                                    <img src={ImageConfig.BillingLogo} alt=""/>
                                </div>
                                <div className={"billing-details-meta"}>
                                    {
                                        <div>
                                            <div className={'appointment-id-heading'}>
                                                {CommonService.capitalizeFirstLetter(billingDetails?.bill_type) + ' No'}
                                            </div>
                                            <div className={'appointment-id'}>
                                                {billingDetails?.billing_number}
                                            </div>
                                        </div>
                                    }

                                    <div className={"billing-date"}>
                                        {CommonService.convertDateFormat2(billingDetails?.created_at, "DD-MMM-YYYY | hh:mm A")}
                                    </div>
                                </div>
                            </div>
                            <HorizontalLineComponent/>
                            <div className={"billing-address-wrapper ts-row"}>
                                <div className={"billing-address-block from ts-col-lg-3"}>
                                    <div className={"billing-address-block__header"}>
                                        <div className={"billing-address-block__title"}>Billing From</div>
                                    </div>
                                    <div className={"billing-address-block__details"}>
                                        <div
                                            className={"billing-address-block__detail__row name"}>{billingFromAddress?.name}</div>
                                        <div
                                            className={"billing-address-block__detail__row"}> {billingFromAddress?.address_line} </div>
                                        <div className={"billing-address-block__detail__row"}>
                                            <span>{billingFromAddress?.city}</span>, <span>{billingFromAddress?.state}</span>
                                            <span>{billingFromAddress?.zip_code}</span>
                                        </div>
                                        <div
                                            className={"billing-address-block__detail__row"}> {billingFromAddress?.phone} </div>
                                    </div>
                                </div>
                                <div className={'ts-col-lg-3'}/>
                                <div className={"billing-address-block to ts-col-lg-3"}>
                                    <div className={"billing-address-block__header"}>
                                        <div className={"billing-address-block__title"}>Billing To</div>
                                        &nbsp;&nbsp;
                                        {/*{(billingDetails?.billing_address && type === 'invoice') &&*/}
                                        <LinkComponent
                                            onClick={openBillingAddressFormDrawer}
                                        >
                                              <span>  <ImageConfig.EditIcon height={'15'}
                                                                            width={'15'}/> </span>
                                            <span className={'edit-text'}>Edit</span>
                                        </LinkComponent>
                                        {/*}*/}
                                    </div>
                                    <div className={"billing-address-block__details"}>
                                        {
                                            !billingDetails?.billing_address && <>
                                                <div className={"billing-address-block__detail__row"}> -</div>
                                                <div className={"billing-address-block__detail__row"}> -</div>
                                            </>
                                        }
                                        {
                                            (billingDetails?.billing_address) && <>
                                                <div
                                                    className={"billing-address-block__detail__row name"}>
                                                    {/*{(type === 'invoice' && selectedAddress) && */}
                                                    {selectedAddress ? selectedAddress?.name : billingDetails?.billing_address?.name}
                                                </div>
                                                <div
                                                    className={"billing-address-block__detail__row"}>
                                                    {/*{(type === 'invoice' && selectedAddress) ? selectedAddress?.address : billingDetails?.billing_address.address_line}*/}
                                                    {selectedAddress ? selectedAddress?.address : billingDetails?.billing_address.address_line}
                                                </div>
                                                <div className={"billing-address-block__detail__row"}>
                                                    <span>{selectedAddress ? selectedAddress?.city : billingDetails?.billing_address?.city}</span>,&nbsp;
                                                    <span>{selectedAddress ? selectedAddress?.state : billingDetails?.billing_address?.state}</span>&nbsp;
                                                    <span>{selectedAddress ? selectedAddress?.zip_code : billingDetails?.billing_address?.zip_code}</span>
                                                </div>
                                                <div
                                                    className={"billing-address-block__detail__row"}>  {billingDetails?.billing_address?.phone || '-'} </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                billingDetails?.bills_details?.length > 0 && billingDetails?.bills_details?.map((billDetail: any, index: number) => {
                                    return (
                                        <CardComponent title={'Client and Case Details'}>
                                            <div className={'ts-row'}>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Client Name'}>
                                                        <div className={'d-flex'}>
                                                            {CommonService.extractName(billDetail?.client_details) + "(" + billDetail?.client_details?.client_id + ")"}&nbsp;
                                                            <LinkComponent>View Details</LinkComponent>
                                                        </div>
                                                    </DataLabelValueComponent>
                                                </div>
                                                <div className={'ts-col-lg-3'}/>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Case Name'}>
                                                        {billDetail?.medical_record_details?.injury_details?.map((injury: any) => {
                                                            return (
                                                                <>
                                                                    {CommonService.convertDateFormat2(billDetail?.created_at)} - {injury?.body_part_name}( {injury?.body_side} )
                                                                </>
                                                            )
                                                        })}
                                                    </DataLabelValueComponent>
                                                </div>
                                            </div>
                                            <div className={'consolidated-client-bills-table'} onClick={() => {
                                                setCurrentClientIndex(index)
                                            }}>
                                                <TableComponent columns={consolidatedDetailsColumn} data={billDetail?.bills}/>
                                            </div>
                                            {
                                                billingDetails?.bills_details?.length > 1 && <>
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-lg-9 '}/>
                                                        <div className={'ts-col-3 mrg-top-25'}>
                                                            <div className={'d-flex ts-justify-content-sm-between'}>
                                                                <div className={'payment-type-header'}>
                                                                    Subtotal(Inc. tax)
                                                                </div>
                                                                <div className={'payment-type-header'}>
                                                                    {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(billDetail?.totalAmount)}
                                                                </div>
                                                            </div>
                                                            <div className={'d-flex ts-justify-content-sm-between'}>
                                                                <div className={'payment-type-header'}>
                                                                    Discount
                                                                </div>
                                                                <div className={'payment-type-header'}>
                                                                    {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(billDetail?.totalDiscount) || '0.00'}
                                                                </div>
                                                            </div>
                                                            <div className={'d-flex ts-justify-content-sm-between'}>
                                                                <div className={'payment-type-header-total'}>
                                                                    Amount(Inc.tax)
                                                                </div>
                                                                <div className={'payment-type-header-total'}>
                                                                    {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(billDetail?.totalPayableAmount) || '0.00'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </CardComponent>
                                    )
                                })
                            }
                            <div className={'add-new-invoice__comments__payment__block__wrapper'}>
                                <div className="ts-row">
                                    <div className="ts-col-lg-4 add-new-invoice__comments__block">
                                        <DataLabelValueComponent className={'comments'} label={""}>
                                            {searchParams.get('type') !== 'completed' &&
                                                <TextAreaComponent label={'Comments'}
                                                                   placeholder={'Please add your comments here'}
                                                                   fullWidth={true}
                                                                   value={comments}
                                                                   onChange={(value: any) => setComments(value)}
                                                />
                                            }
                                            {searchParams.get('type') === 'completed' && <TextAreaComponent label={'Comments'}
                                                                                                            placeholder={'Please add your comments here'}
                                                                                                            fullWidth={true}
                                                                                                            value={comments?.length > 0 ? comments : 'N/A'}
                                                                                                            disabled={true}
                                            />}

                                        </DataLabelValueComponent>
                                        {/*{*/}
                                        {/*    type === 'receipt' &&*/}
                                        {/*    <DataLabelValueComponent className={'mode_of_payment'}*/}
                                        {/*                             label={"Mode Of Payment: "}*/}
                                        {/*                             direction={"row"}*/}
                                        {/*    >*/}
                                        {/*        {billingDetails?.payment_mode_details?.title || billingDetails?.payment_mode || "N/A"}*/}
                                        {/*    </DataLabelValueComponent>*/}
                                        {/*}*/}
                                    </div>
                                    <div className="ts-col-lg-2"/>
                                    <div className="ts-col-lg-6">
                                        <div className="add-new-invoice__payment__block">
                                            <div className="add-new-invoice__payment__block__row subtotal">
                                                <div
                                                    className="add-new-invoice__payment__block__row__title">
                                                    Subtotal (Inc. Tax)
                                                </div>
                                                <div
                                                    className="add-new-invoice__payment__block__row__value">
                                                    {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(billingDetails?.total)}
                                                </div>
                                            </div>
                                            <div className="add-new-invoice__payment__block__row discount">
                                                <div
                                                    className="add-new-invoice__payment__block__row__title">
                                                    Discount
                                                </div>
                                                <div
                                                    className="add-new-invoice__payment__block__row__value">
                                                    {Misc.CURRENCY_SYMBOL}{billingDetails?.discount ? CommonService.convertToDecimals(billingDetails?.discount) : '0.00'}
                                                </div>
                                            </div>
                                            <div className="add-new-invoice__payment__block__row grand">
                                                <div className="add-new-invoice__payment__block__row__title">
                                                    Grand Total (Inc. Tax)
                                                </div>
                                                <div
                                                    className="add-new-invoice__payment__block__row__value">{Misc.CURRENCY_SYMBOL}
                                                    {
                                                        CommonService.convertToDecimals((billingDetails?.total) - (billingDetails?.discount ? (billingDetails?.discount) : 0))
                                                    }
                                                </div>
                                            </div>
                                            {searchParams.get('type') === 'consolidatedReceipt' &&
                                                <div className="add-new-invoice__payment__block__row date">
                                                    <div className="add-new-invoice__payment__block__row__title">
                                                        Payment Date
                                                    </div>
                                                    <div
                                                        className="add-new-invoice__payment__block__row__value">
                                                        {CommonService.convertDateFormat2(billingDetails?.created_at)}
                                                    </div>
                                                </div>
                                            }
                                            {/*// }*/}

                                            {searchParams.get('type') === 'consolidatedReceipt' &&
                                                <div className="add-new-invoice__payment__block__row date">
                                                    <div
                                                        className="add-new-invoice__payment__block__row__title">
                                                        Payment Method
                                                    </div>
                                                    <div
                                                        className="add-new-invoice__payment__block__row__value">
                                                        {billingDetails?.payment_mode_details?.title || billingDetails?.payment_mode || "N/A"}
                                                    </div>
                                                </div>
                                            }


                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardComponent title={'Thank You Note'} className={'mrg-top-30'}>
                                {searchParams.get('type') !== 'completed' && <><TextAreaComponent label={'Note'}
                                                                                                  fullWidth={true}
                                                                                                  value={thankYouNote}
                                                                                                  onChange={(value: any) => setThankYouNote(value)}
                                />

                                    <div className={'ts-col-md-12'}>
                                        {(thankYouNote?.length) >= 90 ?
                                            <div className={'alert-error'}>Characters
                                                Limit:{(thankYouNote?.length)}/90</div> :
                                            <div className={'no-alert'}>Characters
                                                Limit:{(thankYouNote?.length)}/90</div>}
                                    </div>
                                </>

                                }
                                {searchParams.get('type') === 'completed' && <>{billingDetails?.thankyou_note}</>}
                                {/*// <div className={'pdd-bottom-20'}>{thankYouNote}</div>*/}

                            </CardComponent>
                        </div>
                        {searchParams.get('type') !== 'completed' &&
                            <div className={'d-flex ts-justify-content-center mrg-top-20'}>
                                <ButtonComponent
                                    onClick={() => handleSave(thankYouNote, comments, selectedAddress, billingDetails)}>Save</ButtonComponent>
                            </div>}
                    </>
                }
                <DrawerComponent isOpen={isClientBillingAddressDrawerOpened}
                                 onClose={() => setIsClientBillingAddressDrawerOpened(false)}
                                 showClose={true}>

                    {
                        currentStep === 'selectAddress' && <>
                            <FormControlLabelComponent label={"Select Billing Address"}/>

                            <div className={'select-billing-address'}>
                                {clientLinkedList?.length > 1 &&
                                    <div className={'ts-row'}>
                                        <div className={'ts-col-lg-11'}>
                                            <SelectComponent options={clientLinkedList}
                                                             fullWidth={true}
                                                             label={'Select Client'}
                                                             displayWith={(item: any) => item?.first_name + " " + item?.last_name}
                                                             valueExtractor={(item: any) => item?._id}
                                                             onUpdate={(value: any) => {
                                                                 handleSelectChange(value)
                                                             }}/>
                                        </div>
                                    </div>
                                }
                                {
                                    isBillingListLoading && <LoaderComponent/>
                                }
                                {
                                    isBillingListLoaded && <>
                                        {getBillingList?.length > 0 && getBillingList?.map((item: any, index: number) => {
                                            return <div className={'select-address-card'}>
                                                <div className={'select-address-card-header'}>
                                                    <div className={'btn-heading-wrapper'}>
                                                        <RadioButtonComponent
                                                            checked={selectedChanged ? tempSelectedAddress === item : selectedAddress === item}
                                                            onChange={() => handleRadioButtonClick(item)}/>
                                                        <div
                                                            className={'card-heading'}>{item?.is_default ? 'Default Address' : 'Other Address'}</div>
                                                    </div>
                                                    <div className={'btn-wrapper'}>
                                                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} variant={'text'}
                                                                         onClick={() => handleEdit(item)}>
                                                            Edit
                                                        </ButtonComponent>
                                                    </div>
                                                </div>
                                                <div className={'ts-row mrg-top-10'}>
                                                    <div className={'ts-col-lg-1'}/>
                                                    <div className={'ts-col-lg-6'}>
                                                        <DataLabelValueComponent label={'Name of Client/Organisation'}>
                                                            {item?.name || 'N/A'}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className={'ts-col-lg-4'}>
                                                        <DataLabelValueComponent label={'Address Line'}>
                                                            {item?.address_line || 'N/A'}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className={'ts-col-lg-2'}/>

                                                </div>
                                                <div className={'ts-row'}>
                                                    <div className={'ts-col-lg-1'}/>
                                                    <div className={'ts-col-lg-6'}>
                                                        <DataLabelValueComponent label={'City'}>
                                                            {item?.city || "N/A"}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className={'ts-col-lg-4'}>
                                                        <DataLabelValueComponent label={'State'}>
                                                            {item?.state || 'N/A'}                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className={'ts-col-lg-2'}/>

                                                </div>
                                                <div className={'ts-row'}>
                                                    <div className={'ts-col-lg-1'}/>
                                                    <div className={'ts-col-lg-6'}>
                                                        <DataLabelValueComponent label={'ZIP Code'}>
                                                            {item?.zip_code || 'N/A'}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className={'ts-col-lg-4'}>
                                                        <DataLabelValueComponent label={'Country'}>
                                                            {item?.country || 'N/A'}                                       </DataLabelValueComponent>
                                                    </div>
                                                    <div className={'ts-col-lg-2'}/>

                                                </div>
                                            </div>
                                        })
                                        }
                                    </>
                                }
                                <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                                 onClick={() => setCurrentStep("addAddress")} variant={"text"}>Add New
                                    Address</ButtonComponent>
                            </div>


                            <div className={'select-cta'}>
                                <ButtonComponent fullWidth={true} onClick={handleSaveButtonClick}>
                                    Select</ButtonComponent>
                            </div>
                        </>
                    }
                    {currentStep === "editAddress" && <EditBillingAddressComponent billing_address={tempSelectedAddress}
                                                                                   clientId={billingDetails?.client_id}
                                                                                   onCancel={closeBillingAddressFormDrawer}
                                                                                   afterSave={getClientBillingAddressList}
                                                                                   onSave={handleEditBillingAddress}/>
                    }
                    {
                        currentStep === "addAddress" &&
                        <AddBillingAddressComponent clientId={billingDetails?.client_id}
                                                    onCancel={closeBillingAddressFormDrawer}
                                                    onSave={handleEditBillingAddress}
                                                    afterSave={getClientBillingAddressList}

                        />
                    }
                </DrawerComponent>
                <ModalComponent isOpen={isPaymentModeModalOpen}
                                className={'payment-mode-modal'}
                                onClose={() => {
                                    setSelectedPaymentMode("");
                                }
                                }
                                modalFooter={<>
                                    <ButtonComponent variant={'outlined'}
                                                     className={'mrg-right-10'}
                                                     onClick={() => {
                                                         setIsPaymentModeModalOpen(false);
                                                         setSelectedPaymentMode("");
                                                     }}
                                    >
                                        Cancel
                                    </ButtonComponent>
                                    <ButtonComponent variant={'contained'}
                                                     color={'primary'}
                                                     disabled={!selectedPaymentMode}
                                                     onClick={handleBillingMarkAsPaid}
                                    >
                                        Confirm Payment
                                    </ButtonComponent>
                                </>
                                }
                >
                    <ImageConfig.ConfirmIcon/>
                    <FormControlLabelComponent label={"Select Mode Of Payment"}/>
                    <SelectComponent
                        label={"Select Mode Of Payment"}
                        className={'t-form-control'}
                        options={paymentModes || []}
                        value={selectedPaymentMode}
                        fullWidth={true}
                        onUpdate={(value) => setSelectedPaymentMode(value)}
                    />
                </ModalComponent>
            </div>
        );

    }
;

export default ConsolidatedBillingDetailsScreen;
