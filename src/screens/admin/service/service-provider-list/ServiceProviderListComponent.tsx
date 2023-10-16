import "./ServiceProviderListComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import {APIConfig, ImageConfig, Misc} from "../../../../constants";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../../shared/services";
import {ITableColumn} from "../../../../shared/models/table.model";
import {IService} from "../../../../shared/models/service.model";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import DrawerComponent from "../../../../shared/components/drawer/DrawerComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import TableComponent from "../../../../shared/components/table/TableComponent";
import {getServiceProviderList} from "../../../../store/actions/service.action";
import SearchComponent from "../../../../shared/components/search/SearchComponent";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import CheckBoxComponent from "../../../../shared/components/form-controls/check-box/CheckBoxComponent";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import {useNavigate} from "react-router-dom";
import commonService from "../../../../shared/services/common.service";
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
    const [isLinkProviderDrawerOpened, setIsLinkProviderDrawerOpened] = useState<boolean>(false);
    const [isLinkProviderInProgress, setIsLinkProviderInProgress] = useState<boolean>(false);
    // const [selectedProviderIDsForLinking, setSelectedProviderIDsForLinking] = useState<any[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<any[]>([]);
    const [providerListFilterState, setProviderListFilterState] = useState<any>({
        search: "",
    });
    const navigate = useNavigate();

    const ClientListColumns: ITableColumn[] = [
        {
            key: 'providerName',
            dataIndex: 'provider_name',
            title: "Provider Name",
            width: "90%",
            render: (item: any) => {
                // return <>{item?.is_linked && item?.provider_name}</>
                return <>{item?.first_name + " " + item?.last_name}</>
            }
        },
        {
            key: 'action',
            title: 'Action',
            width: 100,
            fixed: 'right',
            align: 'center',
            render: (item: any) => {
                return <IconButtonComponent
                    color={"error"}
                    onClick={() => {
                    handleDeleteProvider(item);
                }}
                                            id={"pv_delete_btn_" + item.provider_name}>
                    <ImageConfig.DeleteIcon />
                </IconButtonComponent>
            }
        }
    ];

    const LinkedClientListColumns: ITableColumn[] = [
        {
            key: 'select',
            title: 'Provider Name',
            dataIndex: 'provider_name',
            width: 500,
            fixed: 'left',
            render: (item: any) => {
                const label = `${CommonService.capitalizeFirstLetter(item?.first_name)} ${CommonService.capitalizeFirstLetter(item?.last_name)}`;
                return (
                    <CheckBoxComponent
                        label={label}
                        checked={selectedProvider.includes(item?._id) || item?.is_linked}
                        disabled={item?.is_linked}
                        onChange={(isChecked) => {
                            if (isChecked) {
                                setSelectedProvider([...selectedProvider, item?._id]);
                            } else {
                                setSelectedProvider(selectedProvider.filter((id: any) => id !== item?._id));
                            }
                        }}
                    />
                );
            }
        },

    ];
    const handleDeleteProvider = useCallback((item: any) => {
        CommonService.onConfirm({
            confirmationTitle: "REMOVE USER",
            image: ImageConfig.RemoveImage,
            confirmationSubTitle: `Do you want to remove "${item.provider_name}" as a provider for "${serviceDetails.name}"?`
        }).then(() => {
            CommonService._service.ServiceProviderUnlinkAPICall(serviceId, item?.provider_id, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getServiceProviderList(serviceId));
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error deleting provider", "error");
            })
        })
    }, [dispatch, serviceId, serviceDetails]);

    const openProviderLinkFormDrawer = useCallback(() => {
        setIsLinkProviderDrawerOpened(true);
    }, []);

    const closeProviderLinkFormDrawer = useCallback(() => {
        setIsLinkProviderDrawerOpened(false);
    }, []);

    const handleProviderLinking = useCallback(() => {
        const provider_ids = selectedProvider.map((item: any) => item);
        setIsLinkProviderInProgress(true);
        CommonService._service.ServiceProviderLinkAPICall(serviceId, {provider_ids, is_linked: true})
            .then((response) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                dispatch(getServiceProviderList(serviceId));
                // setSelectedProviderIDsForLinking([]);
                closeProviderLinkFormDrawer();
                setIsLinkProviderInProgress(false);
            }).catch((error: any) => {
            CommonService._alert.showToast(error.error || "Error linking provider", "error");
            setIsLinkProviderInProgress(false);
        })
    }, [dispatch, serviceId, selectedProvider, closeProviderLinkFormDrawer]);

    useEffect(() => {
        dispatch(getServiceProviderList(serviceId));
    }, [dispatch, serviceId]);

    return (
        <div className={'service-provider'}>
            <div className={'add-provider'}>
                <ButtonComponent
                    className={'add-provider-cta'}
                    size={"small"}
                    prefixIcon={<InsertLinkIcon/>}
                    onClick={()=>{navigate(commonService._routeConfig.LinkProviderToSericeRoute(serviceId))}}
                    id={"pv_add_btn"}
                >
                    Link Provider
                </ButtonComponent>
            </div>
            <CardComponent title={'Providers'}>
                <TableComponent
                    size={"small"}
                    columns={ClientListColumns}
                    data={serviceProviderList}
                    loading={isServiceProviderListLoading}
                />
            </CardComponent>
        </div>
    );

};

export default ServiceProviderListComponent;
