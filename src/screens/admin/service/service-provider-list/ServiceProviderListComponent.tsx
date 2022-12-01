import "./ServiceProviderListComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {ENV, ImageConfig, Misc} from "../../../../constants";
import {useCallback, useState} from "react";
import {CommonService} from "../../../../shared/services";
import {ITableColumn} from "../../../../shared/models/table.model";
import {IService} from "../../../../shared/models/service-category.model";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
// import DrawerComponent from "../../../../shared/components/drawer/DrawerComponent";
// import AutoCompleteComponent from "../../../../shared/components/form-controls/auto-complete/AutoCompleteComponent";
// import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";

interface ServiceProviderComponentProps {
    serviceDetails: IService;
}

const ServiceProviderListComponent = (props: ServiceProviderComponentProps) => {

    const {serviceDetails} = props;
    const [tableRefreshToken, setTableRefreshToken] = useState<string>(CommonService.getUUID());
    // const [isLinkProviderDrawerOpened, setIsLinkProviderDrawerOpened] = useState<boolean>(false);
    // const [isLinkProviderInProgress, setIsLinkProviderInProgress] = useState<boolean>(false);
    // const [selectedProviderIDsForLinking, setSelectedProviderIDsForLinking] = useState<any[]>([]);

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
                                        }}>
                    <ImageConfig.DeleteIcon/>
                </IconButtonComponent>
            }
        }
    ];

    const handleDeleteProvider = useCallback((item: any) => {
        CommonService.onConfirm({
            confirmationTitle: "REMOVE USER",
            yes: {
                color: 'primary',
                text: "Yes"
            },
            no: {
                color: 'primary',
                text: "No"
            },
            image: ImageConfig.RemoveImage,
            confirmationSubTitle: `Do you want to remove "${item.provider_name}" as a provider for "${serviceDetails.name}"?`
        }).then(() => {
            CommonService._service.ServiceProviderUnlinkAPICall(serviceDetails._id, item?.provider_id, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setTableRefreshToken(CommonService.getUUID()); // TODO review and make it standard to refresh list
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error deleting provider", "error");
            })
        })
    }, [serviceDetails]);

    // const openProviderLinkFormDrawer = useCallback(() => {
    //     setIsLinkProviderDrawerOpened(true);
    // }, []);

    // const closeProviderLinkFormDrawer = useCallback(() => {
    //     setIsLinkProviderDrawerOpened(false);
    // }, []);

    // const handleProviderLinking = useCallback(() => {
    //     const provider_ids = selectedProviderIDsForLinking.map((item) => item._id);
    //     setIsLinkProviderInProgress(true);
    //     CommonService._service.ServiceProviderLinkAPICall(serviceDetails._id, {provider_ids})
    //         .then((response) => {
    //             CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
    //             setTableRefreshToken(CommonService.getUUID()); // TODO review and make it standard to refresh list
    //             setSelectedProviderIDsForLinking([]);
    //             closeProviderLinkFormDrawer();
    //             setIsLinkProviderInProgress(false);
    //         }).catch((error: any) => {
    //         CommonService._alert.showToast(error.error || "Error linking provider", "error");
    //         setIsLinkProviderInProgress(false);
    //     })
    // }, [serviceDetails, selectedProviderIDsForLinking, closeProviderLinkFormDrawer]);

    return (
        <div className={'service-provider'}>
            <CardComponent title={'Providers'} actions={<>
                {/*<ButtonComponent prefixIcon={<ImageConfig.AddIcon/>} onClick={openProviderLinkFormDrawer}>*/}
                {/*    Add Provider*/}
                {/*</ButtonComponent>*/}
            </>}>
                <TableWrapperComponent url={ENV.API_URL + `/service/${serviceDetails._id}/providers`}
                                       method={'get'}
                                       size={"small"}
                                       isPaginated={false}
                                       columns={ClientListColumns}
                                       refreshToken={tableRefreshToken}
                />
            </CardComponent>
            {/*<DrawerComponent isOpen={isLinkProviderDrawerOpened}*/}
            {/*                 showClose={true}*/}
            {/*                 onClose={closeProviderLinkFormDrawer}*/}
            {/*>*/}
            {/*    <div>*/}
            {/*        <FormControlLabelComponent label={"Add Provider"}/>*/}
            {/*        <AutoCompleteComponent*/}
            {/*            label={"Providers"}*/}
            {/*            searchMode={"serverSide"}*/}
            {/*            value={selectedProviderIDsForLinking}*/}
            {/*            url={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.URL(serviceDetails._id)}*/}
            {/*            method={APIConfig.AVAILABLE_SERVICE_PROVIDERS_TO_LINK.METHOD}*/}
            {/*            dataListKey={"data"}*/}
            {/*            multiple={true}*/}
            {/*            displayWith={item => item ? (item.first_name || "") + " " + (item.last_name || "") : ""}*/}
            {/*            onUpdate={(value) => {*/}
            {/*                setSelectedProviderIDsForLinking(value);*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <div>*/}
            {/*            <ButtonComponent fullWidth={true}*/}
            {/*                             isLoading={isLinkProviderInProgress}*/}
            {/*                             disabled={isLinkProviderInProgress || selectedProviderIDsForLinking.length === 0}*/}
            {/*                             onClick={handleProviderLinking}>*/}
            {/*                Save*/}
            {/*            </ButtonComponent>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</DrawerComponent>*/}
        </div>
    );

};

export default ServiceProviderListComponent;