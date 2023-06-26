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

    const ClientListColumns: ITableColumn[] = [
        {
            key: 'providerName',
            dataIndex: 'provider_name',
            title: "Provider Name",
            width: "90%",
            render:(item:any)=>{
                // return <>{item?.is_linked && item?.provider_name}</>
                return <>{item?.provider_name}</>
            }
        },
        {
            key: 'action',
            title: 'Action',
            width: 100,
            fixed:'right',
            align: 'center',
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
            key: 'select',
            title: '',
            dataIndex: 'select',
            width: 40,
            fixed: 'left',
            render: (item: any) => {
                return <CheckBoxComponent label={""} checked={selectedProvider.includes(item?._id)}
                                          onChange={(isChecked) => {
                                              if (isChecked) {

                                                  setSelectedProvider([...selectedProvider, item?._id]);
                                              } else {
                                                  setSelectedProvider(selectedProvider.filter((id:any) => id !== item?._id));
                                              }
                                          }}/>

            }
        },
        {
            key: 'providerName',
            dataIndex: 'provider_name',
            title: "Provider Name",
            width: "100%",
            render:(item:any)=>{
                return <>{item?.first_name} {item?.last_name}</>
            }
        },
    ];
    console.log(selectedProvider)

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
        const provider_ids = selectedProvider.map((item:any) => item);
        setIsLinkProviderInProgress(true);
        CommonService._service.ServiceProviderLinkAPICall(serviceId, {provider_ids,is_linked:true})
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
            <div  className={'add-provider'}>
                <ButtonComponent
                    className={'add-provider-cta'}
                    size={"small"}
                    prefixIcon={<ImageConfig.AddIcon/>}
                    onClick={openProviderLinkFormDrawer}
                    id={"pv_add_btn"}
                >
                    Add Provider
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
            <DrawerComponent isOpen={isLinkProviderDrawerOpened}
                             showClose={true}
                             onClose={closeProviderLinkFormDrawer}
                             className={"link-provider-drawer-container"}
            >
                <div className={"link-provider-drawer"}>
                    <FormControlLabelComponent label={"Add Provider"}/>
                    {/*<AutoCompleteComponent*/}
                    {/*    label={"Providers"}*/}
                    {/*    placeholder={"Search for provider by name"}*/}
                    {/*    searchMode={"serverSide"}*/}
                    {/*    value={selectedProviderIDsForLinking}*/}
                    {/*    url={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.URL(serviceDetails._id)}*/}
                    {/*    method={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.METHOD}*/}
                    {/*    dataListKey={"data"}*/}
                    {/*    multiple={true}*/}
                    {/*    displayWith={item => item ? (item.first_name || "") + " " + (item.last_name || "") : ""}*/}
                    {/*    // valueExtractor={item => item ? item._id : ""}*/}
                    {/*    onUpdate={(value) => {*/}
                    {/*        setSelectedProviderIDsForLinking(value);*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <SearchComponent size={'medium'}
                                     className={'client-search-input mrg-top-20'}
                                     label={'Search for Provider'}
                                     value={providerListFilterState.search}
                                     onSearchChange={(value) => {
                                         setProviderListFilterState({...providerListFilterState, search: value})
                                     }}/>
                    <div className={"link-provider-existing-list"}>
                        <FormControlLabelComponent label={"Added Providers"} size={"sm"}/>
                        {/*<TableComponent*/}
                        {/*    size={"small"}*/}
                        {/*    columns={LinkedClientListColumns}*/}
                        {/*    data={serviceProviderList}*/}
                        {/*    hideHeader={true}*/}
                        {/*    loading={isServiceProviderListLoading}*/}
                        {/*/>*/}
                        <div className={'table-container'}>
                        <TableWrapperComponent url={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.URL(serviceId)}
                                               method={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.METHOD}
                                               extraPayload={providerListFilterState}
                                               isPaginated={false}
                                               columns={LinkedClientListColumns}/>
                        </div>
                    </div>
                    <div className={"link-provider-actions"}>
                        <ButtonComponent fullWidth={true}
                                         isLoading={isLinkProviderInProgress}
                                         disabled={ selectedProvider.length === 0}
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
