import "./CouponDetailsComponent.scss";
import {useNavigate, useParams} from "react-router-dom";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
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
            title:'Service Category',
            key:'service_category',
            render:(item:any)=>{
                return <>{item?.category_name || "-"}</>
            }
        },
        {
            title:"Service",
            key:'service',
            dataIndex:'name',
            render:(item:any)=>{
                return <>{item?.service_names?.length>0 && item?.service_names?.map((service:any)=>{
                    return <>{service?.name || "-"}{","}</>
                })}</>
            }
        }
    ],[])

    useEffect(() => {
        if (couponId) {
            dispatch(getCouponDetails(couponId));
        }
    }, [dispatch, couponId]);
    
    console.log('couponDetails',couponDetails);

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
                isCouponDetailsLoaded &&<>
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
                    <CardComponent>
                        <FormControlLabelComponent label={"Coupon Valid On :"} size={'lg'}/>
                        <div className={'coupon-valid-on-table-wrapper'}>
                            <TableComponent columns={couponValidOnColumn}
                                            data={couponDetails?.services}
                                            bordered={true}/>
                        </div>
                    </CardComponent>
                </>

            }
        </div>

    );

};

export default CouponDetailsComponent;