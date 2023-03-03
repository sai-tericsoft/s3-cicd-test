import "./BillingDetailsScreen.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
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
import LinkComponent from "../../../shared/components/link/LinkComponent";
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

interface BillingDetailsScreenProps {

}

type BillingType = 'invoice' | 'receipt';
const BillingTypes: BillingType[] = ['invoice', 'receipt'];
type BillingViewMode = 'general' | 'detailed';
const BillingViewModes: BillingViewMode[] = ['general', 'detailed'];

const BillingDetailsScreen = (props: BillingDetailsScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {billingId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState<BillingType | undefined>(undefined);
    const [viewMode, setViewMode] = useState<BillingViewMode>('general');
    const [isBillingBeingMarkedAsPaid, setIsBillingBeingMarkedAsPaid] = useState<boolean>(false);
    const [isBillingDetailsBeingLoaded, setIsBillingDetailsBeingLoaded] = useState<boolean>(false);
    const [isBillingDetailsBeingLoading, setIsBillingDetailsBeingLoading] = useState<boolean>(false);
    const [isBillingDetailsBeingLoadingFailed, setIsBillingDetailsBeingLoadingFailed] = useState<boolean>(false);
    const [billingDetails, setBillingDetails] = useState<any>(undefined);
    const {name, address, city, state, zip, phone_number} = Misc.COMPANY_BILLING_ADDRESS;
    const [isClientBillingAddressDrawerOpened, setIsClientBillingAddressDrawerOpened] = useState<boolean>(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");
    const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = useState<boolean>(false);

    const {
        paymentModes
    } = useSelector((state: IRootReducerState) => state.staticData);

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
        dispatch(setCurrentNavParams("View Invoice", null, () => {
            navigate(CommonService._routeConfig.BillingList());
        }));
    }, [navigate, dispatch]);

    const openPaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(true);
    }, []);

    const closePaymentModeModal = useCallback(() => {
        setIsPaymentModeModalOpen(false);
        setSelectedPaymentMode("");
    }, []);

    const fetchBillingDetails = useCallback(() => {
        setIsBillingDetailsBeingLoading(true);
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
            setIsBillingDetailsBeingLoading(false);
            setIsBillingDetailsBeingLoaded(true);
            setIsBillingDetailsBeingLoadingFailed(false);
        }).catch((error: any) => {
            setIsBillingDetailsBeingLoading(false);
            setIsBillingDetailsBeingLoaded(false);
            setIsBillingDetailsBeingLoadingFailed(true);
            setBillingDetails(billingDetails);
        })
    }, [type, billingId]);

    const handleBillingMarkAsPaidSuccess = useCallback((receiptId: string) => {
        navigate(CommonService._routeConfig.BillingDetails(receiptId, "receipt"));
    }, [navigate]);

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
                handleBillingMarkAsPaidSuccess(response?.data?._id);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || "Failed to mark payment as paid", "error");
                setIsBillingBeingMarkedAsPaid(false);
            });
    }, [billingId, closePaymentModeModal, selectedPaymentMode, handleBillingMarkAsPaidSuccess]);

    useEffect(() => {
        if (billingId) {
            fetchBillingDetails();
        }
    }, [billingId, fetchBillingDetails]);

    const handleViewModeChange = useCallback(() => {
        const newViewMode: BillingViewMode = viewMode === 'general' ? 'detailed' : 'general';
        searchParams.set("viewMode", newViewMode);
        setSearchParams(searchParams);
        CommonService._alert.showToast(`Switched to ${newViewMode} view`, "success");
    }, [searchParams, setSearchParams, viewMode]);

    const openBillingAddressFormDrawer = useCallback(() => {
        setIsClientBillingAddressDrawerOpened(true);
    }, []);

    const closeBillingAddressFormDrawer = useCallback(() => {
        setIsClientBillingAddressDrawerOpened(false);
    }, []);

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
            title: 'Treatment(s)',
            dataIndex: 'treatment',
            key: 'treatment',
            fixed: 'left',
        },
        {
            title: 'Units',
            dataIndex: 'units',
            key: 'units',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        }
    ], []);

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
                        <ListItem
                            onClick={handleViewModeChange}>
                            View {viewMode === 'general' ? 'Detailed' : 'General'} {CommonService.capitalizeFirstLetter(type)}
                        </ListItem>,
                        <ListItem
                            onClick={CommonService.ComingSoon}>
                            Download {CommonService.capitalizeFirstLetter(type)}
                        </ListItem>,
                        <ListItem onClick={CommonService.ComingSoon}>
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
                            className={"d-flex justify-content-space-between align-items-center mrg-bottom-20"}>
                            <div>
                                <img src={ImageConfig.BillingLogo} alt=""/>
                            </div>
                            <div>
                                {
                                    type === 'invoice' && <DataLabelValueComponent label={"Appointment ID"}>
                                        #{billingDetails?.appointment_id}
                                    </DataLabelValueComponent>
                                }
                                {
                                    type === 'receipt' && <DataLabelValueComponent label={"Receipt No."}>
                                        {billingDetails?.receipt_number}
                                    </DataLabelValueComponent>
                                }
                                <div>
                                    {CommonService.convertDateFormat2(billingDetails?.created_at, "DD MMM YYYY | hh:mm A")}
                                </div>
                            </div>
                        </div>
                        <HorizontalLineComponent/>
                        <div className={"billing-address-wrapper"}>
                            <div className={"billing-address-block from"}>
                                <div className={"billing-address-block__header"}>
                                    <div className={"billing-address-block__title"}>Billing From</div>
                                </div>
                                <div className={"billing-address-block__details"}>
                                    <div className={"billing-address-block__detail__row name"}>{name}</div>
                                    <div className={"billing-address-block__detail__row"}> {address} </div>
                                    <div className={"billing-address-block__detail__row"}>
                                        <span> {city} </span>, <span>{state}</span>&nbsp;<span>{zip}</span>
                                    </div>
                                    <div
                                        className={"billing-address-block__detail__row"}> {phone_number} </div>
                                </div>
                            </div>
                            <div className={"billing-address-block to"}>
                                <div className={"billing-address-block__header"}>
                                    <div className={"billing-address-block__title"}>Billing To</div>
                                    &nbsp;&nbsp;
                                    {(billingDetails?.billing_address && type === 'invoice') &&
                                        <LinkComponent onClick={openBillingAddressFormDrawer}>
                                            (Edit Billing To)
                                        </LinkComponent>}
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
                                                {billingDetails?.billing_address?.name}
                                            </div>
                                            <div
                                                className={"billing-address-block__detail__row"}> {billingDetails?.billing_address.address_line} </div>
                                            <div className={"billing-address-block__detail__row"}>
                                                <span>  {billingDetails?.billing_address?.city} </span>, <span> {billingDetails?.billing_address?.state} </span>&nbsp;
                                                <span>  {billingDetails?.billing_address?.zip_code} </span>
                                            </div>
                                            <div
                                                className={"billing-address-block__detail__row"}>  {billingDetails?.billing_address?.phone || '-'} </div>
                                        </>
                                    }
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
                                        {billingDetails?.client_details?.primary_contact_info?.phone || '-'}
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
                                        {CommonService.convertDateFormat2(billingDetails?.appointment_details?.appointment_date, "DD MMM YYYY, hh:mm A")}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                        </CardComponent>
                        {
                            viewMode === 'detailed' && <>
                                <CardComponent title={"ICD-11 Description(s) and Code(s)"}>
                                    <TableComponent
                                        columns={ICDCodesColumns}
                                        data={billingDetails?.linked_icd_codes || []}
                                    />
                                </CardComponent>
                                <CardComponent title={"Treatments"}>
                                    <TableComponent
                                        columns={TreatmentColumns}
                                        data={billingDetails?.linked_cpt_codes || []}
                                    />
                                </CardComponent>
                            </>
                        }
                        <div className={'add-new-invoice__comments__payment__block__wrapper'}>
                            <div className="ts-row">
                                <div className="ts-col-lg-6">
                                    <DataLabelValueComponent label={"Comments"}>
                                        {billingDetails?.comments || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-lg-6">
                                    <div className="add-new-invoice__payment__block">
                                        <div className="add-new-invoice__payment__block__row">
                                            <div
                                                className="add-new-invoice__payment__block__row__title">
                                                Subtotal (Inc. Tax)
                                            </div>
                                            <div
                                                className="add-new-invoice__payment__block__row__value">
                                                {Misc.CURRENCY_SYMBOL} {billingDetails?.amount}
                                            </div>
                                        </div>
                                        <div className="add-new-invoice__payment__block__row discount">
                                            <div
                                                className="add-new-invoice__payment__block__row__title">
                                                Discount
                                            </div>
                                            <div
                                                className="add-new-invoice__payment__block__row__value">
                                                - {Misc.CURRENCY_SYMBOL} {(billingDetails?.discount_amount ? parseInt(billingDetails?.discount_amount) : 0)}
                                            </div>
                                        </div>
                                        <div className="add-new-invoice__payment__block__row grand">
                                            <div className="add-new-invoice__payment__block__row__title">
                                                Grand Total (Inc. Tax)
                                            </div>
                                            <div
                                                className="add-new-invoice__payment__block__row__value">{Misc.CURRENCY_SYMBOL}
                                                {
                                                    parseInt(billingDetails?.amount) - (billingDetails?.discount_amount ? parseInt(billingDetails?.discount_amount) : 0)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            <DrawerComponent isOpen={isClientBillingAddressDrawerOpened}
                             onClose={closeBillingAddressFormDrawer}
                             showClose={true}>
                <EditBillingAddressComponent billing_address={billingDetails?.billing_address}
                                             clientId={billingDetails?.client_id}
                                             onCancel={closeBillingAddressFormDrawer}
                                             onSave={handleEditBillingAddress}/>
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
            {/*Payment mode selection Modal end*/}
        </div>
    );

};

export default BillingDetailsScreen;
