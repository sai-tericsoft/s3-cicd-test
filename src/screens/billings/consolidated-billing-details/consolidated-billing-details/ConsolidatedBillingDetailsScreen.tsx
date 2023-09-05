import "./ConsolidatedBillingDetailsScreen.scss";
import {CommonService} from "../../../../shared/services";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig, Misc} from "../../../../constants";
import MenuDropdownComponent from "../../../../shared/components/menu-dropdown/MenuDropdownComponent";
import {ListItem} from "@mui/material";
import PageHeaderComponent from "../../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useState} from "react";
import {BillingType} from "../../../../shared/models/common.model";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {getBillingFromAddress} from "../../../../store/actions/billings.action";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import CardComponent from "../../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../../shared/components/data-label-value/DataLabelValueComponent";
import TableComponent from "../../../../shared/components/table/TableComponent";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import TextAreaComponent from "../../../../shared/components/form-controls/text-area/TextAreaComponent";

interface ConsolidatedBillingDetailsScreenProps {

}

const ConsolidatedBillingDetailsScreen = (props: ConsolidatedBillingDetailsScreenProps) => {

        const dispatch = useDispatch();
        const [type, setType] = useState<BillingType>('invoice');
        const [isBillingDetailsBeingLoaded, setIsBillingDetailsBeingLoaded] = useState<boolean>(false);
        const [isBillingDetailsBeingLoading, setIsBillingDetailsBeingLoading] = useState<boolean>(false);
        const [isBillingDetailsBeingLoadingFailed, setIsBillingDetailsBeingLoadingFailed] = useState<boolean>(false);
        const [billingDetails, setBillingDetails] = useState<any>(undefined);
        const [thankYouNote, setThankYouNote] = useState<any>('');
        const [comments, setComments] = useState<any>('');

        const {billingFromAddress} = useSelector((state: IRootReducerState) => state.billings);

        useEffect(() => {
            dispatch(getBillingFromAddress())
        }, [dispatch]);

        useEffect(() => {
            setThankYouNote(billingDetails?.thankyou_note);
            setComments(billingDetails?.comments);
        }, [billingDetails?.thankyou_note, billingDetails?.comments]);

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
                render: (item: any) => {
                    return <IconButtonComponent>
                        <ImageConfig.CircleCancel/>
                    </IconButtonComponent>
                }
            }
        ]

        const fetchBillingDetails = useCallback(() => {
            setIsBillingDetailsBeingLoading(true);
            setIsBillingDetailsBeingLoadingFailed(false);
            setIsBillingDetailsBeingLoaded(false);
            CommonService._billingsService.GetConsolidatedBillingDetails('64f58b5cfa59f9f71115a63c', {})
                .then((response) => {
                    setIsBillingDetailsBeingLoading(false);
                    setIsBillingDetailsBeingLoaded(true);
                    setBillingDetails(response.data);
                }).catch((error) => {
                setBillingDetails(undefined)
                setIsBillingDetailsBeingLoading(false);
                setIsBillingDetailsBeingLoadingFailed(true);
            });
        }, []);

        useEffect(() => {
            fetchBillingDetails();
        }, [fetchBillingDetails]);


        return (
            <div className={'consolidated-billing-details-component billing-details-screen'}>
                <PageHeaderComponent
                    title={`View Consolidated ${CommonService.capitalizeFirstLetter(type)}`}
                    actions={<>
                        {
                            // type === 'invoice' &&
                            <>
                                <ButtonComponent variant={'outlined'} color={'error'}
                                                 prefixIcon={<ImageConfig.DeleteIcon/>}>
                                    Delete
                                </ButtonComponent>&nbsp;&nbsp;

                                <ButtonComponent
                                    prefixIcon={<ImageConfig.CircleCheck/>}
                                    // onClick={openPaymentModeModal}
                                    // disabled={isBillingBeingMarkedAsPaid}
                                    // isLoading={isBillingBeingMarkedAsPaid}
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
                                // onClick={handleBillingDownload}
                            >
                                Download {CommonService.capitalizeFirstLetter(type)}
                            </ListItem>,
                            <ListItem
                                // onClick={handleBillingPrint}
                            >
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
                                    <img src={ImageConfig.BillingLogo} alt=""/>
                                </div>
                                <div className={"billing-details-meta"}>
                                    {
                                        <div>
                                            <div className={'appointment-id-heading'}>
                                                {CommonService.capitalizeFirstLetter(billingDetails?.bill_type) +' No'}
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
                                        {(billingDetails?.billing_address && type === 'invoice') &&
                                            <LinkComponent
                                                // onClick={openBillingAddressFormDrawer}
                                            >
                                              <span>  <ImageConfig.EditIcon height={'15'}
                                                                            width={'15'}/> </span>
                                                <span className={'edit-text'}>Edit</span>
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
                                                    {/*{(type === 'invoice' && selectedAddress) && */}
                                                    {billingDetails?.billing_address?.name}
                                                </div>
                                                <div
                                                    className={"billing-address-block__detail__row"}>
                                                    {/*{(type === 'invoice' && selectedAddress) ? selectedAddress?.address : billingDetails?.billing_address.address_line}*/}
                                                    {billingDetails?.billing_address.address_line}
                                                </div>
                                                <div className={"billing-address-block__detail__row"}>
                                                    <span>{billingDetails?.billing_address?.city}</span>,&nbsp;
                                                    <span>{billingDetails?.billing_address?.state}</span>&nbsp;
                                                    <span>{billingDetails?.billing_address?.zip_code}</span>
                                                </div>
                                                <div
                                                    className={"billing-address-block__detail__row"}>  {billingDetails?.billing_address?.phone || '-'} </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                billingDetails?.bills_details?.length > 0 && billingDetails?.bills_details?.map((billDetail: any) => {
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
                                            <TableComponent columns={consolidatedDetailsColumn} data={billDetail?.bills}/>
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
                                            {/*{type === 'invoice' ?*/}
                                            <TextAreaComponent label={'Comments'}
                                                               placeholder={'Please add your comments here'}
                                                               fullWidth={true}
                                                               value={comments}
                                                               onChange={(value: any) => setComments(value)}
                                            />
                                            {/*//     : <TextAreaComponent label={'Comments'}*/}
                                            {/*//                         placeholder={'Please add your comments here'}*/}
                                            {/*//                         fullWidth={true}*/}
                                            {/*//     // value={comments?.length>0?comments:'N/A'}*/}
                                            {/*//                         disabled={true}*/}
                                            {/*// />*/}

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
                                            {type === 'receipt' &&
                                                <div className="add-new-invoice__payment__block__row date">
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
                                                        {billingDetails?.payment_mode_details?.title || billingDetails?.payment_mode || "N/A"}
                                                    </div>
                                                </div>

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardComponent title={'Thank You Note'} className={'mrg-top-30'}>
                                <TextAreaComponent label={'Note'}
                                                   fullWidth={true}
                                                   value={thankYouNote}
                                                   onChange={(value: any) => setThankYouNote(value)}
                                />
                                {/*// <div className={'pdd-bottom-20'}>{thankYouNote}</div>*/}
                                <div className={'ts-col-md-12'}>
                                    {(thankYouNote?.length) >= 90 ?
                                        <div className={'alert-error'}>Characters
                                            Limit:{(thankYouNote?.length)}/90</div> :
                                        <div className={'no-alert'}>Characters
                                            Limit:{(thankYouNote?.length)}/90</div>}
                                </div>
                            </CardComponent>
                        </div>
                        <div className={'d-flex ts-justify-content-center mrg-top-20'}>
                            <ButtonComponent>Save</ButtonComponent>
                        </div>
                    </>
                }
            </div>
        );

    }
;

export default ConsolidatedBillingDetailsScreen;