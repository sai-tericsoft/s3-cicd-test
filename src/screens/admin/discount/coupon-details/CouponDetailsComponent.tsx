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
import {useDispatch} from "react-redux";

interface CouponDetailsComponentProps {

}

const CouponDetailsComponent = (props: CouponDetailsComponentProps) => {

    const {couponId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(setCurrentNavParams("Back", null, () => {
            navigate(CommonService._routeConfig.DiscountList());
        }));
    },[]);

    return (
        <div className={'coupon-details-component'}>
            <CardComponent color={'primary'}>
                <div className={'coupon-name-button-wrapper'}>
                                    <span className={'coupon-name-wrapper'}>
                                        <span className={'coupon-name'}>
                                                {"first_name || N/A"} {"last_name || N/A"}
                                        </span>
                                        <ChipComponent
                                            className={".status === open" ? "active" : "inactive"}
                                            size={'small'}
                                            label={"status_details?.title || N/A"}/>
                                    </span>
                    <div className="ts-row width-auto">

                            <div className="">
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                 >
                                    Edit Coupon
                                </ButtonComponent>
                            </div>

                    </div>
                </div>
                <div className={'ts-row'}>
                    <div className={'ts-col-md-4 ts-col-lg'}>
                        <DataLabelValueComponent label={'Coupon Code'}>
                            {"coupon_code || N/A"}
                        </DataLabelValueComponent>
                    </div>
                    <div className={'ts-col-md-4 ts-col-lg'}>
                        <DataLabelValueComponent  label={'Minimum Billing Amount'}>
                            {"minimum_billing_amount || N/A"}
                        </DataLabelValueComponent>
                    </div>
                    <div className={'ts-col-md-4 ts-col-lg'}>
                        <DataLabelValueComponent label={'Usage Limit Per User'}>
                            {"usage_limit_per_user || N/A"}
                        </DataLabelValueComponent>
                    </div>
                    <div className={'ts-col-md-4 ts-col-lg'}>
                        <DataLabelValueComponent label={'Start Date'}>
                            {"start_date || N/A"}
                        </DataLabelValueComponent>
                    </div>
                    <div className={'ts-col-md-4 ts-col-lg'}>
                        <DataLabelValueComponent label={'End Date'}>
                            {"end_date || N/A"}
                        </DataLabelValueComponent>
                    </div>
                </div>
                <div className={'ts-row'}>
                    <div className={'ts-col-md-4 ts-col-lg'}>
                        <DataLabelValueComponent label={'Discount Type'}>
                            {"discount_type || N/A"}
                        </DataLabelValueComponent>
                    </div>
                    <div className={'ts-col-md-4 ts-col-lg'}>
                        <DataLabelValueComponent label={'Percentage'}>
                            {"percentage || N/A"}
                        </DataLabelValueComponent>
                    </div>
                </div>
                <div className={'ts-row'}>
                    <div className={'ts-col-md-4 ts-col-lg'}>
                        <DataLabelValueComponent label={'Description'}>
                            {"description || N/A"}
                        </DataLabelValueComponent>
                    </div>
                </div>

            </CardComponent>
        </div>
    );

};

export default CouponDetailsComponent;