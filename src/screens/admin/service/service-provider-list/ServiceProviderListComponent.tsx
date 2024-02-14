import "./ServiceProviderListComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import {ImageConfig, Misc} from "../../../../constants";
import React, {useCallback, useEffect} from "react";
import {CommonService} from "../../../../shared/services";
import {ITableColumn} from "../../../../shared/models/table.model";
import {IService} from "../../../../shared/models/service.model";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import TableComponent from "../../../../shared/components/table/TableComponent";
import {getServiceProviderList} from "../../../../store/actions/service.action";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import {useNavigate} from "react-router-dom";
import commonService from "../../../../shared/services/common.service";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";

interface ServiceProviderComponentProps {
    serviceId: string;
    serviceDetails: IService;
}

const ServiceProviderListComponent = (props: ServiceProviderComponentProps) => {

    const {serviceId, serviceDetails} = props;
    const dispatch = useDispatch();
    const {
        serviceProviderList,
        isServiceProviderListLoading
    } = useSelector((state: IRootReducerState) => state.service);
    const navigate = useNavigate();

    const ClientListColumns: ITableColumn[] = [
        {
            key: 'providerName',
            dataIndex: 'provider_name',
            title: "Provider Name",
            render: (item: any, index: number) => {
                // return <>{item?.is_linked && item?.provider_name}</>
                return <><LinkComponent id={"sv_view_details_" + index}
                                        route={commonService._routeConfig.LinkProviderToSericeRoute(serviceId, item._id, item?.first_name, item?.last_name)}>
                    {item?.first_name + " " + item?.last_name}
                </LinkComponent>
                </>
            }
        },
        // {
        //     key: 'viewDetails',
        //     dataIndex: 'view_details',
        //     title: '',
        //     align: 'right',
        //     width: 100,
        //     render: (item: any, index: number) => {
        //         if (item._id && item.first_name && item.last_name) {
        //             return <LinkComponent id={"sv_view_details_" + index}
        //                                   route={commonService._routeConfig.LinkProviderToSericeRoute(serviceId, item._id, item?.first_name, item?.last_name)}>
        //                 View Details
        //             </LinkComponent>
        //         }
        //     }
        // },
        {
            key: 'action',
            title: 'Action',
            fixed: 'right',
            align: 'center',
            render: (item: any) => {
                return <ButtonComponent
                    color={"error"}
                    variant={"outlined"}
                    prefixIcon={<ImageConfig.CrossOutlinedIcon/>}
                    onClick={() => {
                        handleDeleteProvider(item);
                    }}
                    id={"pv_delete_btn_" + item.provider_name}>
                    Unlink Provider
                </ButtonComponent>
            }
        }
    ];
    const handleDeleteProvider = useCallback((item: any) => {
        console.log('item', item)
        CommonService.onConfirm({
            confirmationTitle: "UNLINK PROVIDER",
            image: ImageConfig.ConfirmationLottie,
            showLottie: true,
            confirmationSubTitle: `Are you sure you want to unlink "${item.first_name} ${item.last_name}" as a provider for "${serviceDetails.name}"?`

        }).then(() => {
            CommonService._service.ServiceProviderUnlinkAPICall(serviceId,item?._id, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getServiceProviderList(serviceId));
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error deleting provider", "error");
            })
        })
    }, [dispatch, serviceId, serviceDetails]);

    // const handleProviderLinking = useCallback(() => {
    //     const provider_ids = selectedProvider.map((item: any) => item);
    //     setIsLinkProviderInProgress(true);
    //     CommonService._service.ServiceProviderLinkAPICall(serviceId, {provider_ids, is_linked: true})
    //         .then((response) => {
    //             CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
    //             dispatch(getServiceProviderList(serviceId));
    //             // setSelectedProviderIDsForLinking([]);
    //             closeProviderLinkFormDrawer();
    //             setIsLinkProviderInProgress(false);
    //         }).catch((error: any) => {
    //         CommonService._alert.showToast(error.error || "Error linking provider", "error");
    //         setIsLinkProviderInProgress(false);
    //     })
    // }, [dispatch, serviceId, selectedProvider, closeProviderLinkFormDrawer]);

    useEffect(() => {
        dispatch(getServiceProviderList(serviceId));
    }, [dispatch, serviceId]);

    return (
        <CardComponent className={'service-provider'}>
            <div className={'provider-button-wrapper'}>
                <FormControlLabelComponent label={"Providers"} size={'xl'}/>
                <div className={'add-provider'}>
                    <ButtonComponent
                        className={'add-provider-cta'}
                        prefixIcon={<InsertLinkIcon/>}
                        onClick={() => {
                            navigate(commonService._routeConfig.LinkProviderToSericeRoute(serviceId))
                        }}
                        id={"pv_add_btn"}
                    >
                        Link Provider
                    </ButtonComponent>
                </div>
            </div>
            <TableComponent
                columns={ClientListColumns}
                data={serviceProviderList}
                noDataText={<div className={'no-data-text'}>No provider linked yet.</div>}
                loading={isServiceProviderListLoading}
            />
        </CardComponent>
    );

};

export default ServiceProviderListComponent;
