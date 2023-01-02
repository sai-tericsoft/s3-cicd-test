import "./ServiceProviderListComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import {APIConfig, ImageConfig, Misc} from "../../../../constants";
import {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../../shared/services";
import {ITableColumn} from "../../../../shared/models/table.model";
import {IService} from "../../../../shared/models/service.model";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import DrawerComponent from "../../../../shared/components/drawer/DrawerComponent";
import AutoCompleteComponent from "../../../../shared/components/form-controls/auto-complete/AutoCompleteComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import TableComponent from "../../../../shared/components/table/TableComponent";
import {getServiceProviderList} from "../../../../store/actions/service.action";

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
    const [selectedProviderIDsForLinking, setSelectedProviderIDsForLinking] = useState<any[]>([]);

    const ClientListColumns: ITableColumn[] = [
        {
            key: 'providerName',
            dataIndex: 'provider_name',
            title: "Provider Name",
            width: "90%"
        },
        {
            key: 'action',
            title: 'Action',
            width: "10%",
            render: (item: any) => {
                return <IconButtonComponent onClick={() => {
                    handleDeleteProvider(item);
                }}
                id={"pv_delete_btn_" + item.provider_name}>
                    <ImageConfig.DeleteIcon/>
                </IconButtonComponent>
            }
        }
    ];

    const LinkedClientListColumns: ITableColumn[] = [
        {
            key: 'providerName',
            dataIndex: 'provider_name',
            title: "Provider Name",
            width: "100%"
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
        const provider_ids = selectedProviderIDsForLinking.map((item) => item._id);
        setIsLinkProviderInProgress(true);
        CommonService._service.ServiceProviderLinkAPICall(serviceId, {provider_ids})
            .then((response) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                dispatch(getServiceProviderList(serviceId));
                setSelectedProviderIDsForLinking([]);
                closeProviderLinkFormDrawer();
                setIsLinkProviderInProgress(false);
            }).catch((error: any) => {
            CommonService._alert.showToast(error.error || "Error linking provider", "error");
            setIsLinkProviderInProgress(false);
        })
    }, [dispatch, serviceId, selectedProviderIDsForLinking, closeProviderLinkFormDrawer]);

    useEffect(() => {
        dispatch(getServiceProviderList(serviceId));
    }, [dispatch, serviceId]);

    return (
        <div className={'service-provider'}>
            <CardComponent title={'Providers'} actions={<>
                <ButtonComponent
                    size={"small"}
                    prefixIcon={<ImageConfig.AddIcon/>}
                    onClick={openProviderLinkFormDrawer}
                    id={"pv_add_btn"}
                >
                    Add Provider
                </ButtonComponent>
            </>}>
                <TableComponent
                    size={"small"}
                    columns={ClientListColumns}
                    data={serviceProviderList}
                    loading={isServiceProviderListLoading}
                />
            </CardComponent>
            <DrawerComponent isOpen={isLinkProviderDrawerOpened}
                             showClose={true}
                             onClose={closeProviderLinkFormDrawer}
                             className={"link-provider-drawer-container"}
            >
                <div className={"link-provider-drawer"}>
                    <FormControlLabelComponent label={"Add Provider"}/>
                    <AutoCompleteComponent
                        label={"Providers"}
                        placeholder={"Search for provider by name"}
                        searchMode={"serverSide"}
                        value={selectedProviderIDsForLinking}
                        url={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.URL(serviceDetails._id)}
                        method={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.METHOD}
                        dataListKey={"data"}
                        multiple={true}
                        displayWith={item => item ? (item.first_name || "") + " " + (item.last_name || "") : ""}
                        // valueExtractor={item => item ? item._id : ""}
                        onUpdate={(value) => {
                            setSelectedProviderIDsForLinking(value);
                        }}
                    />
                    <div className={"link-provider-existing-list"}>
                        <FormControlLabelComponent label={"Added Providers"} size={"sm"}/>
                        <TableComponent
                            size={"small"}
                            columns={LinkedClientListColumns}
                            data={serviceProviderList}
                            showHeader={false}
                            loading={isServiceProviderListLoading}
                        />
                    </div>
                    <div className={"link-provider-actions"}>
                        <ButtonComponent fullWidth={true}
                                         isLoading={isLinkProviderInProgress}
                                         disabled={isLinkProviderInProgress || selectedProviderIDsForLinking.length === 0}
                                         onClick={handleProviderLinking}
                                         id={"pv_save_btn"}
                        >
                            Save
                        </ButtonComponent>
                    </div>
                </div>
            </DrawerComponent>
        </div>
    );

};

export default ServiceProviderListComponent;
