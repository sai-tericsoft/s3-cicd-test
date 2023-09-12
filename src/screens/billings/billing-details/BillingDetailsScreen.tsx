import "./BillingDetailsScreen.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {CommonService} from "../../../shared/services";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig, Misc} from "../../../constants";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import {ListItem} from "@mui/material";
import {IAPIResponseType} from "../../../shared/models/api.model";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import EditBillingAddressComponent from "../edit-billing-address/EditBillingAddressComponent";
import {IRootReducerState} from "../../../store/reducers";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import TableComponent from "../../../shared/components/table/TableComponent";
import {BillingType} from "../../../shared/models/common.model";
import {getBillingFromAddress, getBillingSettings} from "../../../store/actions/billings.action";
import {RadioButtonComponent} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import AddBillingAddressComponent from "../add-billing-address/AddBillingAddressComponent";
import TextAreaComponent from "../../../shared/components/form-controls/text-area/TextAreaComponent";

interface BillingDetailsScreenProps {

}

const BillingTypes: BillingType[] = ['invoice', 'receipt'];
type BillingViewMode = 'general' | 'detailed';
const BillingViewModes: BillingViewMode[] = ['general', 'detailed'];

const BillingDetailsScreen = (props: BillingDetailsScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {billingId} = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState<BillingType | undefined>(undefined);
    const [viewMode, setViewMode] = useState<BillingViewMode>('general');
    const [isBillingBeingMarkedAsPaid, setIsBillingBeingMarkedAsPaid] = useState<boolean>(false);
    const [isBillingDetailsBeingLoaded, setIsBillingDetailsBeingLoaded] = useState<boolean>(false);
    const [isBillingDetailsBeingLoading, setIsBillingDetailsBeingLoading] = useState<boolean>(false);
    const [isBillingDetailsBeingLoadingFailed, setIsBillingDetailsBeingLoadingFailed] = useState<boolean>(false);
    const [billingDetails, setBillingDetails] = useState<any>(undefined);
    const [isClientBillingAddressDrawerOpened, setIsClientBillingAddressDrawerOpened] = useState<boolean>(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");
    const [currentStep, setCurrentStep] = useState<"selectAddress" | "editAddress" | "addAddress">("selectAddress");
    const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = useState<boolean>(false);
    const [isInterventionIncompleteModalOpen, setIsInterventionIncompleteModalOpen] = useState<boolean>(false);
    const [getBillingList, setGetBillingList] = useState<any>([]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [tempSelectedAddress, setTempSelectedAddress] = useState<any>(null);
    const [selectedChanged, setSelectedChanged] = useState<boolean>(false);
    const [thankYouNote, setThankYouNote] = useState<any>('');
    const [comments, setComments] = useState<any>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    console.log('type', type);
    // const {
    //     billingSettings,
    // } = useSelector((state: IRootReducerState) => state.billings);

    const {
        paymentModes
    } = useSelector((state: IRootReducerState) => state.staticData);

    const {billingFromAddress} = useSelector((state: IRootReducerState) => state.billings);
    useEffect(() => {
        dispatch(getBillingFromAddress())
    }, [dispatch]);

    useEffect(() => {
        const type: BillingType = searchParams.get("type") as BillingType;
        if (type && BillingTypes.includes(type)) {
            setType(type);
        } else {
            searchParams.set("type", BillingTypes[0]);
            setSearchParams(searchParams);
        }
        const viewMode: BillingViewMode = searchParams.get("viewMode") as BillingViewMode;
        if (viewMode && BillingViewModes.includes(viewMode)) {
            setViewMode(viewMode);
        } else {
            searchParams.set("viewMode", BillingViewModes[0]);
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

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

    useEffect(() => {
        dispatch(getBillingSettings())
    }, [dispatch]);

    const openPaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(true);
    }, []);

    const closePaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(false);
        setSelectedPaymentMode("");
    }, []);

    const fetchBillingDetails = useCallback((billingId: string, type: string) => {
        setIsBillingDetailsBeingLoading(true);
        setIsBillingDetailsBeingLoadingFailed(false);
        setIsBillingDetailsBeingLoaded(false)
        let billingDetails: any = undefined;
        let apiCall: any = undefined;
        if (type === 'invoice') {
            apiCall = CommonService._billingsService.GetInvoiceDetailsAPICall(billingId);
        } else if (type === 'receipt') {
            apiCall = CommonService._billingsService.GetReceiptDetailsAPICall(billingId);
        } else {
            return;
        }
        apiCall.then((response: IAPIResponseType<any>) => {
            if (response?.data) {
                billingDetails = response.data;
            }
            setBillingDetails(billingDetails);
            setSelectedAddress(billingDetails?.billing_address)
            console.log(billingDetails?.billing_address)
            setIsBillingDetailsBeingLoading(false);
            setIsBillingDetailsBeingLoaded(true);
            setIsBillingDetailsBeingLoadingFailed(false);
        }).catch((error: any) => {
            setIsBillingDetailsBeingLoading(false);
            setIsBillingDetailsBeingLoaded(false);
            setIsBillingDetailsBeingLoadingFailed(true);
            setBillingDetails(billingDetails);
        })
    }, []);

    const getClientBillingAddressList = useCallback(() => {
        // setIsClientBillingAddressListLoading(true);
        billingDetails?.client_id && CommonService._billingsService.GetBillingAddressList(billingDetails?.client_id)
            .then((response: any) => {
                setGetBillingList(response?.data);
                // setIsClientBillingAddressListLoading(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || "Failed to fetch client billing address", "error");
                // setIsClientBillingAddressListLoading(false);
            });
    }, [billingDetails?.client_id]);

    useEffect(() => {
        getClientBillingAddressList()
    }, [getClientBillingAddressList]);

    useEffect(() => {
        setThankYouNote(billingDetails?.thankyou_note);
        setComments(billingDetails?.comments);
    }, [billingDetails?.thankyou_note, billingDetails?.comments]);

    const handleBillingMarkAsPaidSuccess = useCallback(() => {
        navigate(CommonService._routeConfig.BillingList() + '?referrer=' + location.pathname + '&type=receipt');
    }, [navigate, location.pathname]);

    const handleBillingMarkAsPaid = useCallback(() => {
        closePaymentModeModal();
        setIsBillingBeingMarkedAsPaid(true);
        const payload = {
            "payment_mode": selectedPaymentMode
        }
        CommonService._billingsService.MarkPaymentAsPaidAPICall(billingId, payload)
            .then((response: IAPIResponseType<any>) => {
                setIsBillingBeingMarkedAsPaid(false);
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Payment marked as paid successfully", "success");
                handleBillingMarkAsPaidSuccess();
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || "Failed to mark payment as paid", "error");
                setIsBillingBeingMarkedAsPaid(false);
            });
    }, [billingId, closePaymentModeModal, selectedPaymentMode, handleBillingMarkAsPaidSuccess]);

    useEffect(() => {
        if (billingId && type) {
            fetchBillingDetails(billingId, type);
        }
    }, [billingId, fetchBillingDetails, type]);

    const openIncompleteInterventionInfoModal = useCallback(() => {
        setIsInterventionIncompleteModalOpen(true);
    }, []);

    const closeIncompleteInterventionInfoModal = useCallback(() => {
        setIsInterventionIncompleteModalOpen(false);
    }, []);

    const handleViewModeChange = useCallback(() => {
        if (!billingDetails?.is_intervention_complete) {
            openIncompleteInterventionInfoModal();
            return;
        }
        const newViewMode: BillingViewMode = viewMode === 'general' ? 'detailed' : 'general';
        searchParams.set("viewMode", newViewMode);
        setSearchParams(searchParams);
        CommonService._alert.showToast(`Switched to ${newViewMode} view`, "success");
    }, [searchParams, openIncompleteInterventionInfoModal, billingDetails, setSearchParams, viewMode]);

    const openBillingAddressFormDrawer = useCallback(() => {
        setIsClientBillingAddressDrawerOpened(true);
    }, []);

    const closeBillingAddressFormDrawer = useCallback(() => {
        setIsClientBillingAddressDrawerOpened(false);
        setTempSelectedAddress(selectedAddress);
        setCurrentStep('selectAddress');
    }, [selectedAddress]);

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

    const ICDCodesColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: 'ICD Code',
            dataIndex: 'icd_code',
            key: 'icd_code',
            fixed: 'left',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        }], []);

    const TreatmentColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: 'CPT Code(s)',
            dataIndex: 'treatment',
            key: 'treatment',
            width: 500,
            fixed: 'left',
            render: (record: any) => {
                return <>{record?.cpt_code_details?.cpt_code}</>
            }
        },
        {
            title: 'Units',
            dataIndex: 'units_of_care',
            key: 'units_of_care',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (record: any) => {
                return <>N/A</>
            }
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (record: any) => {
                return <>N/A</>
            }
        }
    ], []);

    const ProductsColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: 'S.No',
            dataIndex: 's.no',
            key: 's.no',
            width: 100,
            fixed: 'left',
            render: (record: any, index) => {
                return <>{index + 1}</>
            }
        },
        {
            title: 'Item(s)',
            dataIndex: 'item',
            key: 'item',
            width: 500,
            fixed: 'left',
            render: (record: any) => {
                return <>{record?.product_name}</>
            }
        },
        {
            title: 'Units',
            dataIndex: 'units',
            key: 'units',
            align: 'center',
            width:40,
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            align: 'center',
            width:50,
            render: (record: any) => {
                return <> {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(+record?.discount) || '0.00'}</>

            }

        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            align: 'center',
            width:40,
            render: (record: any) => {
                return <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(record?.amount)}</>
            }
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align:'center',
            fixed:'right',
            width:80,
            render: (record: any) => {
                return <>
                    {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(record?.amount * record?.units)}
                </>
            }
        }
    ], []);

    const fetchBillingPDF = useCallback((cb: any) => {
        const payload = {
            is_detailed: viewMode === 'detailed',
            bill_type: type,
            _id: billingId
        };
        (billingDetails?.payment_for === "appointment") ? CommonService._billingsService.GetAppointmentBillingPDFDocument(payload) : CommonService._billingsService.GetProductBillingPDFDocument(payload)
            .then((response: IAPIResponseType<any>) => {
                cb(response?.data?.url);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || "Failed to fetch", "error");
            });
    }, [viewMode, type, billingId, billingDetails]);


    const handleBillingPrint = useCallback(() => {
        fetchBillingPDF((url: string) => {
            CommonService.printAttachment({
                url: url,
                type: "application/pdf",
                key: CommonService.getUUID(),
                name: `${type}-${billingId}.pdf`
            })
        });
    }, [fetchBillingPDF, type, billingId]);

    const handleBillingDownload = useCallback(() => {
        fetchBillingPDF((url: string) => {
            CommonService.downloadFile(url, `${type}-${billingId}.pdf`);
        });
    }, [fetchBillingPDF, type, billingId]);

    const handleSaveButtonClick = useCallback(() => {
        if (tempSelectedAddress) {
            setSelectedAddress(tempSelectedAddress); // Update the selected address when "Save" is clicked
        }
        setSelectedChanged(false);
        closeBillingAddressFormDrawer();
    }, [closeBillingAddressFormDrawer, tempSelectedAddress]);

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

    const handleNoteAndComment = useCallback((comment: any, thankYouNote: any, selectedAddress: any) => {
        setIsSubmitting(true);
        const payload = {
            billing_address: selectedAddress,
            thankyou_note: thankYouNote,
            comments: comment
        }
        billingId && CommonService._billingsService.AddInvoiceNote(billingId, payload)
            .then((response: IAPIResponseType<any>) => {
                setIsSubmitting(false);
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Note and comment added successfully", "success");
                navigate(CommonService._routeConfig.BillingList() + '?referrer=' + location.pathname + '&type=' + type);
            })
            .catch((error: any) => {
                setIsSubmitting(false);
                CommonService._alert.showToast(error.error || error.errors || "Failed to add note and comment", "error");
            });
    }, [billingId, navigate, location.pathname, type]);


    return (
        <div className={'billing-details-screen'}>
            <PageHeaderComponent
                title={`View ${CommonService.capitalizeFirstLetter(viewMode)} ${CommonService.capitalizeFirstLetter(type)}`}
                actions={<>
                    {
                        type === 'invoice' && <>
                            <ButtonComponent
                                prefixIcon={<ImageConfig.CircleCheck/>}
                                onClick={openPaymentModeModal}
                                disabled={isBillingBeingMarkedAsPaid}
                                isLoading={isBillingBeingMarkedAsPaid}
                            >
                                Mark as Paid
                            </ButtonComponent>&nbsp;&nbsp;
                        </>
                    }
                    <MenuDropdownComponent className={'billing-details-drop-down-menu'} menuBase={
                        <ButtonComponent size={'large'} variant={'outlined'} fullWidth={true}>
                            Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                        </ButtonComponent>
                    } menuOptions={[
                        billingDetails?.payment_for !== 'products' && <ListItem
                            onClick={handleViewModeChange}>
                            View {viewMode === 'general' ? 'Detailed' : 'General'} {CommonService.capitalizeFirstLetter(type)}
                        </ListItem>,
                        <ListItem
                            onClick={handleBillingDownload}>
                            Download {CommonService.capitalizeFirstLetter(type)}
                        </ListItem>,
                        <ListItem onClick={handleBillingPrint}>
                            Print {CommonService.capitalizeFirstLetter(type)}
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
                                <div>{<ImageConfig.NewLogo/>}</div>
                            </div>
                            <div className={"billing-details-meta"}>
                                {
                                    type === 'invoice' && <div>
                                        <div className={'appointment-id-heading'}>
                                            Invoice No.
                                        </div>
                                        <div className={'appointment-id'}>
                                            {billingDetails?.invoice_number}
                                        </div>
                                    </div>
                                }
                                {
                                    type === 'receipt' && <div>
                                        <div className={'receipt-no-heading'}>
                                            Receipt No.
                                        </div>
                                        <div className={'receipt-no'}>
                                            {billingDetails?.receipt_number}
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
                            <div className={"billing-address-block from ts-col-lg-4"}>
                                <div className={"billing-address-block__header"}>
                                    <div className={"billing-address-block__title"}>Billing From</div>
                                </div>
                                <div className={"billing-address-block__details"}>
                                    <div
                                        className={"billing-address-block__detail__row name"}>{billingFromAddress?.name}</div>
                                    <div
                                        className={"billing-address-block__detail__row"}> {billingFromAddress?.address_line} </div>
                                    <div className={"billing-address-block__detail__row"}>
                                        <span>{billingFromAddress?.city}</span>, <span>{billingFromAddress?.state}</span>&nbsp;
                                        <span>{billingFromAddress?.zip_code}</span>
                                    </div>
                                    <div
                                        className={"billing-address-block__detail__row"}> {CommonService.formatPhoneNumber(billingFromAddress?.phone)} </div>
                                </div>
                            </div>
                            <div className={'ts-col-lg-2'}/>
                            <div className={"billing-address-block to ts-col-lg-4"}>
                                <div className={"billing-address-block__header"}>
                                    <div className={"billing-address-block__title"}>Billing To</div>
                                    &nbsp;&nbsp;
                                    {(billingDetails?.billing_address && type === 'invoice') &&
                                        <ButtonComponent
                                            onClick={openBillingAddressFormDrawer}
                                            variant={'text'}
                                            color={"primary"}
                                            className={'edit-button'}
                                            prefixIcon={<ImageConfig.EditIcon height={'15'}
                                                                              width={'15'}/>}
                                        >
                                            Edit
                                        </ButtonComponent>}
                                </div>
                                <div className={"billing-address-block__details"}>
                                    {
                                        !billingDetails?.billing_address && <>
                                            <div className={"billing-address-block__detail__row"}> -</div>
                                            <div className={"billing-address-block__detail__row"}> -</div>
                                        </>
                                    }

                                    <div
                                        className={"billing-address-block__detail__row name"}>
                                        {selectedAddress?.name || "-"}
                                    </div>
                                    <div
                                        className={"billing-address-block__detail__row"}> {selectedAddress?.address_line || "-"} </div>
                                    <div className={"billing-address-block__detail__row"}>
                                        <span>{selectedAddress?.city || "-"}</span>,&nbsp;
                                        <span>{selectedAddress?.state || "-"}</span>&nbsp;
                                        <span>{selectedAddress?.zip_code || "-"}</span>
                                    </div>
                                    <div
                                        className={"billing-address-block__detail__row"}>  {CommonService.formatPhoneNumber(billingDetails?.billing_address?.phone) || '-'} </div>
                                </div>
                            </div>
                        </div>
                        <CardComponent title={"Client Details"}>
                            <div className="ts-row">
                                <div className="ts-col-lg-3">
                                    <DataLabelValueComponent label={"First Name"}>
                                        {billingDetails?.client_details?.first_name}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-lg-3">
                                    <DataLabelValueComponent label={"Last Name"}>
                                        {billingDetails?.client_details?.last_name}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-lg-3">
                                    <DataLabelValueComponent label={"Phone Number"}>
                                        {CommonService.formatPhoneNumber(billingDetails?.client_details?.primary_contact_info?.phone) || '-'}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-lg-3">
                                    <DataLabelValueComponent label={"Email"}>
                                        {billingDetails?.client_details?.primary_email || '-'}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                        </CardComponent>
                        <CardComponent title={"Provider Details"}>
                            <div className="ts-row">
                                <div className="ts-col-lg-3">
                                    <DataLabelValueComponent label={"Provider Name"}>
                                        {billingDetails?.provider_details?.first_name} {billingDetails?.provider_details?.last_name}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-lg-3">
                                    <DataLabelValueComponent label={"NPI Number"}>
                                        {billingDetails?.provider_details?.npi_number || 'N/A'}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-lg-3">
                                    <DataLabelValueComponent label={"License Number"}>
                                        {billingDetails?.provider_details?.license_number || 'N/A'}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                        </CardComponent>
                        {
                            (((type === "receipt" || type === "invoice") && billingDetails?.payment_for === 'products')) &&
                            <CardComponent className={'billing-products-card'}>
                                <TableComponent
                                    columns={ProductsColumns}
                                    data={billingDetails?.products || []}
                                    autoHeight={true}
                                />
                            </CardComponent>
                        }
                        {
                            ((type === 'invoice' || type === "receipt") && billingDetails?.payment_for !== 'products') &&
                            <CardComponent title={"Appointment Details"}>
                                <div className="ts-row">
                                    <div className="ts-col-lg-3">
                                        <DataLabelValueComponent label={"Service Category"}>
                                            {billingDetails?.category_details?.name || '-'}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className="ts-col-lg-3">
                                        <DataLabelValueComponent label={"Service"}>
                                            {billingDetails?.service_details?.name || '-'}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className="ts-col-lg-3">
                                        <DataLabelValueComponent label={"Date and Time"}>
                                            {CommonService.convertDateFormat2(billingDetails?.appointment_details?.appointment_date, "DD-MMM-YYYY")}, {CommonService.getHoursAndMinutesFromMinutes(billingDetails?.appointment_details?.start_time)}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </CardComponent>
                        }
                        {
                            viewMode === 'detailed' && <>
                                <CardComponent title={"ICD-11 Description(s) and Code(s)"}>
                                    <TableComponent
                                        columns={ICDCodesColumns}
                                        data={billingDetails?.linked_icd_codes || []}
                                        autoHeight={true}
                                    />
                                </CardComponent>
                                <CardComponent className={'billing-treatment-card'}>
                                    <TableComponent
                                        columns={TreatmentColumns}
                                        data={billingDetails?.linked_cpt_codes || []}
                                        autoHeight={true}
                                    />
                                </CardComponent>
                            </>
                        }
                        <div className={'add-new-invoice__comments__payment__block__wrapper'}>
                            <div className="ts-row">
                                <div className="ts-col-lg-4 add-new-invoice__comments__block">
                                    <DataLabelValueComponent className={'comments'} label={""}>
                                        {type === 'invoice' ? <TextAreaComponent label={'Comments'}
                                                                                 placeholder={'Please add your comments here'}
                                                                                 fullWidth={true}
                                                                                 value={comments}
                                                                                 onChange={(value: any) => setComments(value)}
                                            /> :
                                            //     <TextAreaComponent label={'Comments'}
                                            //                         placeholder={'Please add your comments here'}
                                            //                         fullWidth={true}
                                            //                         value={comments?.length > 0 ? comments : 'N/A'}
                                            //                         disabled={true}
                                            // />
                                            <div className={'ts-col-12 comment-wrapper'}>
                                                <div className={'comment-heading'}>Comments</div>
                                                <div
                                                    className={'pdd-bottom-10'}>{comments?.length > 0 ? comments : 'N/A'}</div>
                                            </div>
                                        }
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
                                        {type === 'receipt' && <div className="add-new-invoice__payment__block__row date">
                                            <div className="add-new-invoice__payment__block__row__title">
                                                Payment Date
                                            </div>
                                            <div
                                                className="add-new-invoice__payment__block__row__value">
                                                {CommonService.convertDateFormat2(billingDetails?.created_at)}
                                            </div>
                                        </div>}
                                        {
                                            type === 'receipt' &&
                                            // <DataLabelValueComponent className={'mode_of_payment'}
                                            //                          label={"Mode Of Payment: "}
                                            //                          direction={"row"}
                                            // >
                                            //     {billingDetails?.payment_mode_details?.title || billingDetails?.payment_mode || "N/A"}
                                            // </DataLabelValueComponent>
                                            <div className="add-new-invoice__payment__block__row date">
                                                <div className="add-new-invoice__payment__block__row__title">
                                                    Payment Method
                                                </div>
                                                <div
                                                    className="add-new-invoice__payment__block__row__value">
                                                    {billingDetails?.payment_mode_details?.title?.replace('_', " ") || billingDetails?.payment_mode?.replace('_', " ") || "N/A"}
                                                </div>
                                            </div>

                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CardComponent title={'Thank You Note'} className={'mrg-top-30'}>
                            {type === 'invoice' ? <><TextAreaComponent label={'Note'}
                                                                       fullWidth={true}
                                                                       value={thankYouNote}
                                                                       onChange={(value: any) => setThankYouNote(value)}

                                />
                                    <div className={'ts-col-md-12'}>
                                        {(thankYouNote?.length) >= 90 ?
                                            <div className={'alert-error'}>Characters
                                                Limit: {(thankYouNote?.length)}/90</div> :
                                            <div className={'no-alert'}>Characters
                                                Limit: {(thankYouNote?.length)}/90</div>}
                                    </div>
                                </>
                                : <div className={'pdd-bottom-20'}>{thankYouNote}</div>
                            }
                        </CardComponent>
                    </div>
                    {type === 'invoice' && <div className={'cta-wrapper'}>
                        {/*<ButtonComponent variant={"outlined"}*/}
                        {/*                 className={'mrg-right-20'}*/}
                        {/*                 onClick={() => navigate(CommonService._routeConfig.BillingList())}>*/}
                        {/*    Cancel*/}
                        {/*</ButtonComponent>*/}
                        <ButtonComponent variant={"contained"}
                                         isLoading={isSubmitting}
                                         disabled={isSubmitting || thankYouNote?.length > 90}
                                         onClick={() => handleNoteAndComment(comments, thankYouNote, selectedAddress)}
                                         color={"primary"}>
                            Save
                        </ButtonComponent>

                    </div>}
                </>
            }
            <DrawerComponent isOpen={isClientBillingAddressDrawerOpened}
                             onClose={closeBillingAddressFormDrawer}
                             showClose={true}>
                {
                    currentStep === 'selectAddress' && <>
                        <FormControlLabelComponent label={"Select Billing Address"}/>
                        <div className={'select-billing-address'}>
                            {getBillingList?.length > 0 && getBillingList?.map((item: any, index: number) => {
                                return <div className={'select-address-card'}>
                                    <div className={'select-address-card-header'}>
                                        <div className={'btn-heading-wrapper'}>
                                            <RadioButtonComponent
                                                checked={selectedChanged ? tempSelectedAddress._id === item._id : selectedAddress._id === item._id}
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
                            <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}
                                             onClick={() => setCurrentStep("addAddress")} variant={"text"}>Add New
                                Address</ButtonComponent>
                        </div>


                        <div className={'select-cta'}>
                            <ButtonComponent fullWidth={true} onClick={handleSaveButtonClick}>Select</ButtonComponent>
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

            {/*Payment mode selection Modal start*/}
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
                <FormControlLabelComponent label={"Select Mode of Payment"}/>
                <SelectComponent
                    label={"Select Mode of Payment"}
                    className={'t-form-control'}
                    options={paymentModes || []}
                    value={selectedPaymentMode}
                    fullWidth={true}
                    onUpdate={(value) => setSelectedPaymentMode(value)}
                />
            </ModalComponent>
            {/*Payment mode selection Modal end*/}

            {/*Incomplete Appointment Info Modal start*/}
            <ModalComponent isOpen={isInterventionIncompleteModalOpen}
                            className={'incomplete-invoice-info-modal'}
                            modalFooter={<>
                                <ButtonComponent onClick={closeIncompleteInterventionInfoModal}>
                                    Close
                                </ButtonComponent>
                            </>
                            }
            >
                <img className="incomplete-invoice-icon" src={ImageConfig.Confirm} alt=""/>
                <div className={'incomplete-invoice-info-title'}>
                    INTERVENTION INCOMPLETE
                </div>
                <div className={'incomplete-invoice-info-description'}>
                    Once the treatment is completed, the corresponding <br/>
                    invoice will be generated.
                </div>
            </ModalComponent>
            {/*Incomplete Appointment Info Modal end*/}
        </div>
    );

};

export default BillingDetailsScreen;
