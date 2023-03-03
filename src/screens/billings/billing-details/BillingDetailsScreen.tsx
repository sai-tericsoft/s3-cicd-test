import "./BillingDetailsScreen.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig, Misc} from "../../../constants";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import {ListItem} from "@mui/material";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IService} from "../../../shared/models/service.model";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface BillingDetailsScreenProps {

}

type BillingType = 'invoice' | 'receipt';
const BillingTypes: BillingType[] = ['invoice', 'receipt'];

const BillingDetailsScreen = (props: BillingDetailsScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {billingId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState<BillingType | undefined>(undefined);
    const [viewMode, setViewMode] = useState<'general' | 'detailed'>('general');
    const [isBillingBeingMarkedAsPaid, setIsBillingBeingMarkedAsPaid] = useState<boolean>(false);
    const [isBillingDetailsBeingLoaded, setIsBillingDetailsBeingLoaded] = useState<boolean>(false);
    const [isBillingDetailsBeingLoading, setIsBillingDetailsBeingLoading] = useState<boolean>(false);
    const [isBillingDetailsBeingLoadingFailed, setIsBillingDetailsBeingLoadingFailed] = useState<boolean>(false);
    const [billingDetails, setBillingDetails] = useState<any>(undefined);

    useEffect(() => {
        const type: BillingType = searchParams.get("type") as BillingType;
        if (type && BillingTypes.includes(type)) {
            setType(type);
        } else {
            searchParams.set("type", BillingTypes[0]);
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        dispatch(setCurrentNavParams("View Invoice", null, () => {
            navigate(CommonService._routeConfig.BillingList());
        }));
    }, [navigate, dispatch]);

    const handleBillingMarkAsPaid = useCallback(() => {
        setIsBillingBeingMarkedAsPaid(true);
        CommonService._billingsService.MarkPaymentAsPaidAPICall(billingId)
            .then((response: IAPIResponseType<any>) => {
                setIsBillingBeingMarkedAsPaid(false);
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Payment marked as paid successfully", "success");
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || "Failed to mark payment as paid", "error");
                setIsBillingBeingMarkedAsPaid(false);
            });
    }, [billingId]);

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
        apiCall.then((response: IAPIResponseType<IService>) => {
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

    useEffect(() => {
        if (billingId) {
            fetchBillingDetails();
        }
    }, [billingId, fetchBillingDetails]);

    return (
        <div className={'billing-details-screen screen'}>
            <PageHeaderComponent
                title={`View ${CommonService.capitalizeFirstLetter(viewMode)} ${CommonService.capitalizeFirstLetter(type)}`}
                actions={<>
                    {
                        type === 'invoice' && <>
                            <ButtonComponent
                                prefixIcon={<ImageConfig.CircleCheck/>}
                                onClick={handleBillingMarkAsPaid}
                                disabled={isBillingBeingMarkedAsPaid}
                                isLoading={isBillingBeingMarkedAsPaid}
                            >
                                Mark as Paid
                            </ButtonComponent>&nbsp;&nbsp;
                        </>
                    }
                    <MenuDropdownComponent menuBase={
                        <ButtonComponent size={'large'} variant={'outlined'} fullWidth={true}>
                            Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                        </ButtonComponent>
                    } menuOptions={[
                        <ListItem
                            onClick={CommonService.ComingSoon}>View {viewMode === 'general' ? 'Detailed' : 'General'} {CommonService.capitalizeFirstLetter(type)}</ListItem>,
                        <ListItem
                            onClick={CommonService.ComingSoon}>Download {CommonService.capitalizeFirstLetter(type)}</ListItem>,
                        <ListItem
                            onClick={CommonService.ComingSoon}>Print {CommonService.capitalizeFirstLetter(type)}</ListItem>
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
                        {
                            JSON.stringify(billingDetails)
                        }
                    </div>
                </>
            }
        </div>
    );

};

export default BillingDetailsScreen;
