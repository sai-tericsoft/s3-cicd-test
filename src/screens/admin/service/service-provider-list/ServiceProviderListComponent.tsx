import "./ServiceProviderListComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {ENV, ImageConfig, Misc} from "../../../../constants";
import {useCallback} from "react";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../../shared/services";

interface ServiceProviderComponentProps {
    serviceId: string;
    serviceName?: string;
}

const ServiceProviderListComponent = (props: ServiceProviderComponentProps) => {

    const {serviceId, serviceName} = props;

    const ClientListColumns = [
        {
            key: 'providerName',
            dataIndex: 'provider_name',
            title: "Provider Name"
        },
        {
            key: 'action',
            title: 'Action',
            render: (item: any) => {
                return <ButtonComponent isIconButton={true}
                                        onClick={() => {
                                            handleDeleteProvider(item)
                                        }
                                        }
                                        style={{cursor: "pointer"}}>
                    <ImageConfig.DeleteIcon/>
                </ButtonComponent>
            }
        }
    ];

    const handleDeleteProvider = useCallback((item: any) => {
        const payload = {};
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
            confirmationSubTitle: `Do you want to remove "${item.provider_name}" as a provider for "${serviceName}"?`
        }).then(() => {
            CommonService._serviceProvider.ServiceProviderDeleteAPICall(serviceId, item?.provider_id, payload)
                .then((response) => {
                    if (response.success) {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success")
                    }
                })
        }).catch((error) => {
            CommonService._alert.showToast(error[Misc.API_RESPONSE_MESSAGE_KEY], "error")
        })
    }, []);

    return (
        <div className={'service-provider'}>
            <CardComponent title={'Providers'}>
                <TableWrapperComponent url={ENV.API_URL + `/service/${serviceId}/providers`} method={'get'}
                                       isPaginated={false} columns={ClientListColumns}/>
            </CardComponent>
        </div>
    );

};

export default ServiceProviderListComponent;