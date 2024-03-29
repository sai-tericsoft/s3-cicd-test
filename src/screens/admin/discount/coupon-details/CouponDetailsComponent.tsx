import "./CouponDetailsComponent.scss";
import {useNavigate, useParams} from "react-router-dom";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig, Misc} from "../../../../constants";
import DataLabelValueComponent from "../../../../shared/components/data-label-value/DataLabelValueComponent";
import CardComponent from "../../../../shared/components/card/CardComponent";
import React, {useEffect, useMemo} from "react";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {CommonService} from "../../../../shared/services";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {getCouponDetails} from "../../../../store/actions/discount.action";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import TableComponent from "../../../../shared/components/table/TableComponent";
import {ITableColumn} from "../../../../shared/models/table.model";
import LinkComponent from "../../../../shared/components/link/LinkComponent";

interface CouponDetailsComponentProps {

}

const CouponDetailsComponent = (props: CouponDetailsComponentProps) => {

    const {couponId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        couponDetails,
        isCouponDetailsLoading,
        isCouponDetailsLoaded,
        isCouponDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.discount);


    const couponValidOnColumn: ITableColumn[] = useMemo(() => [
        {
            title: 'Service Category',
            key: 'service_category',
            width: 100,
            render: (item: any) => {
                return <>{item?.category_name || "-"}</>
            }
        },
        {
            title: "Service",
            key: 'service',
            dataIndex: 'name',
            width:500,
            render: (item: any) => {
                return <div>{item?.services?.length > 0 && item?.services?.map((service: any) => {
                    return <>
                        <div className={'mrg-bottom-5 mrg-top-5'}>{service?.name || "N/A"}</div>
                    </>
                })}</div>
            }
        }
    ], [])

    useEffect(() => {
        if (couponId) {
            dispatch(getCouponDetails(couponId));
        }
    }, [dispatch, couponId]);


    useEffect(() => {
        dispatch(setCurrentNavParams("", null, () => {
            navigate(CommonService._routeConfig.DiscountList());
        }));
    }, [dispatch, navigate]);

    return (
        <div className={'coupon-details-component'}>
            {
                isCouponDetailsLoading && <LoaderComponent/>
            }
            {
                isCouponDetailsLoadingFailed &&
                <StatusCardComponent title={'Unable to load data. Please wait a moment and try again.'}/>
            }
            {
                isCouponDetailsLoaded && <>
                    <CardComponent color={'primary'}>
                        <div className={'coupon-name-button-wrapper'}>
                                    <span className={'coupon-name-wrapper'}>
                                        <span className={'coupon-name'}>
                                                {couponDetails?.title || "N/A"}
                                        </span>
                                        <ChipComponent
                                            className={couponDetails?.is_active ? "active" : "inactive"}
                                            size={'small'}
                                            label={couponDetails?.is_active ? "Active" : "Inactive" || "N/A"}/>
                                    </span>
                            <div className="ts-row width-auto">

                                {couponId && <LinkComponent route={CommonService._routeConfig.CouponEdit(couponId)}>
                                    <div>
                                        <ButtonComponent variant={'outlined'} prefixIcon={<ImageConfig.EditIcon/>}>
                                            Edit Coupon
                                        </ButtonComponent>
                                    </div>
                                </LinkComponent>}

                            </div>
                        </div>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Coupon Code'}>
                                    {couponDetails?.code || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Start Date'}>
                                    {CommonService.convertDateFormat2(couponDetails?.start_date) || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'End Date'}>
                                    {CommonService.convertDateFormat2(couponDetails?.end_date) || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Minimum Billing Amount'}>
                                    <>{couponDetails?.min_billing_amount ? <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(+couponDetails?.min_billing_amount)}</> : "N/A"}</>
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Usage Limit Per User'}>
                                    {couponDetails?.usage_limit || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Discount Type'}>
                                    {CommonService.capitalizeFirstLetter(couponDetails?.discount_type) || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            {couponDetails?.discount_type === "percentage" && <>
                                <div className={'ts-col-md-4 ts-col-lg'}>
                                    <DataLabelValueComponent label={'Percentage'}>
                                        {couponDetails?.percentage + '%' || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className={'ts-col-md-4 ts-col-lg'}>
                                    <DataLabelValueComponent label={'Maximum Discount Amount'}>
                                        {couponDetails?.max_discount_amount ? <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(+couponDetails?.max_discount_amount)}</> : "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                            </>}
                            {
                                couponDetails?.discount_type === 'amount' && <>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Discount Amount'}>
                                            {couponDetails?.amount ? <>{Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(+couponDetails?.amount)}</> : "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}/>
                                    {/*<div className={'ts-col-md-4 ts-col-lg'}/>*/}
                                </>
                            }
                        </div>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Description'}>
                                    {couponDetails?.description || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent className={'coupon-valid-on-card'}>
                        <FormControlLabelComponent label={"Coupon valid on:"} size={'md'}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-12'}>
                                <TableComponent columns={couponValidOnColumn}
                                                bordered={true}
                                                data={couponDetails?.linked_services}
                                                autoHeight={true}
                                />
                            </div>
                        </div>
                    </CardComponent>
                </>

            }
        </div>

    );

};

export default CouponDetailsComponent;