import "./ServiceProviderListComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {ENV, ImageConfig, Misc} from "../../../../constants";
import {useCallback, useState} from "react";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../../shared/services";
import {ITableColumn} from "../../../../shared/models/table.model";
import {IService} from "../../../../shared/models/service-category.model";

interface ServiceProviderComponentProps {
    serviceDetails: IService;
}

const ServiceProviderListComponent = (props: ServiceProviderComponentProps) => {

    const {serviceDetails} = props;
    const [tableRefreshToken, setTableRefreshToken] = useState<string>(CommonService.getUUID());

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
                return <ButtonComponent isIconButton={true}
                                        onClick={() => {
                                            handleDeleteProvider(item);
                                        }}>
                    <ImageConfig.DeleteIcon/>
                </ButtonComponent>
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
            CommonService._serviceProvider.ServiceProviderDeleteAPICall(serviceDetails._id, item?.provider_id, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setTableRefreshToken(CommonService.getUUID()); // TODO review and make it standard to refresh list
                })
        }).catch((error: any) => {
            CommonService._alert.showToast(error.error || "Error deleting provider", "error");
        })
    }, []);

    return (
        <div className={'service-provider'}>
            <CardComponent title={'Providers'}>
                <TableWrapperComponent url={ENV.API_URL + `/service/${serviceDetails._id}/providers`}
                                       method={'get'}
                                       isPaginated={false}
                                       columns={ClientListColumns}
                                       refreshToken={tableRefreshToken}
                />
            </CardComponent>
        </div>
    );

};

export default ServiceProviderListComponent;