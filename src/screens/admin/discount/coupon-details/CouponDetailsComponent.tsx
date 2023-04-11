import "./CouponDetailsComponent.scss";
import {useNavigate, useParams} from "react-router-dom";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import DataLabelValueComponent from "../../../../shared/components/data-label-value/DataLabelValueComponent";
import CardComponent from "../../../../shared/components/card/CardComponent";
import React, {useEffect} from "react";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {CommonService} from "../../../../shared/services";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {getCouponDetails} from "../../../../store/actions/discount.action";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";

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

    useEffect(() => {
        if (couponId) {
            dispatch(getCouponDetails(couponId));
        }
    }, [dispatch, couponId])

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
                isCouponDetailsLoadingFailed && <StatusCardComponent title={'Error in fetching coupon details'}/>
            }
            {
                isCouponDetailsLoaded &&
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

                            <div className="">
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}>
                                    Edit Coupon
                                </ButtonComponent>
                            </div>

                        </div>
                    </div>
                    <div className={'ts-row'}>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Coupon Code'}>
                                {couponDetails?.code || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Minimum Billing Amount'}>
                                {couponDetails?.min_billing_amount || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Usage Limit Per User'}>
                                {couponDetails?.usage_limit || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Start Date'}>
                                {couponDetails?.start_date || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'End Date'}>
                                {couponDetails?.end_date || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                    </div>
                    <div className={'ts-row'}>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Discount Type'}>
                                {couponDetails?.discount_type || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Percentage'}>
                                {couponDetails?.percentage || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Maximum Discount Amount'}>
                                {couponDetails?.max_discount_amount || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}/>
                        <div className={'ts-col-md-4 ts-col-lg'}/>
                    </div>
                    <div className={'ts-row'}>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Description'}>
                                {couponDetails?.description || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                    </div>

                </CardComponent>
            }
        </div>

    );

};

export default CouponDetailsComponent;