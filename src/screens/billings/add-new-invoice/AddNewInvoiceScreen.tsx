import "./AddNewInvoiceScreen.scss";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import {ImageConfig, Misc} from "../../../constants";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import TextAreaComponent from "../../../shared/components/form-controls/text-area/TextAreaComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";

interface AddNewInvoiceScreenProps {

}

const AddNewInvoiceScreen = (props: AddNewInvoiceScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {name, address, city, state, zip, phone_number} = Misc.COMPANY_BILLING_ADDRESS;

    useEffect(() => {
        dispatch(setCurrentNavParams("Add New Invoice", null, () => {
            navigate(CommonService._routeConfig.BillingPaymentList());
        }));
    }, [navigate, dispatch]);

    return (
        <div className={'add-new-invoice-screen'}>
            <PageHeaderComponent title={'Add Receipt'}/>
            <div>
                {/*<div>*/}
                {/*    <div>*/}

                {/*    </div>*/}
                {/*    <div>*/}
                {/*        {CommonService.convertDateFormat2(new Date(), "DD MMM YYYY | hh:mm a")}*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<HorizontalLineComponent/>*/}
                {/*<div>*/}
                {/*    <div>*/}
                {/*        <div>Billing From</div>*/}
                {/*        <div>*/}
                {/*            <div>{name}</div>*/}
                {/*            <div> {address} </div>*/}
                {/*            <div><span> {city} </span>, <span>{state}</span>*/}
                {/*                <span>{zip}</span></div>*/}
                {/*            <div> {phone_number} </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <div>Billing To</div>*/}
                {/*        <div> -</div>*/}
                {/*        <div> -</div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <CardComponent title={"Client Details"}>
                    <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>
                        Add Client
                    </ButtonComponent>
                </CardComponent>
                <CardComponent title={"Provider Details"}>
                    <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>
                        Add Provider
                    </ButtonComponent>
                </CardComponent>
                <div>
                    <div>
                        Products list
                    </div>
                </div>
                {/*<div>*/}
                {/*    <div className="ts-row">*/}
                {/*        <div className="ts-col-lg-6">*/}
                {/*            <TextAreaComponent label={"Comments"}/>*/}
                {/*        </div>*/}
                {/*        <div className="ts-col-lg-6">*/}
                {/*            <div>*/}
                {/*                <div>*/}
                {/*                    <div>Subtotal (Inc. Tax)</div>*/}
                {/*                    <div>{Misc.CURRENCY_SYMBOL} 0.00</div>*/}
                {/*                </div>*/}
                {/*                <div>*/}
                {/*                    <InputComponent*/}
                {/*                        label={"Discount"}*/}
                {/*                        type={"number"}*/}
                {/*                        placeholder={"Discount"}*/}
                {/*                        prefix={Misc.CURRENCY_SYMBOL}*/}
                {/*                    />*/}
                {/*                </div>*/}
                {/*                <div>*/}
                {/*                    <div>Grand Total (Inc. Tax)</div>*/}
                {/*                    <div>{Misc.CURRENCY_SYMBOL} 0.00</div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="t-form-actions">*/}
                {/*    <ButtonComponent variant={"outlined"}>*/}
                {/*        Cancel*/}
                {/*    </ButtonComponent>&nbsp;&nbsp;*/}
                {/*    <ButtonComponent>*/}
                {/*        Generate Receipt*/}
                {/*    </ButtonComponent>*/}
                {/*</div>*/}
            </div>
        </div>
    );

};

export default AddNewInvoiceScreen;
