import "./ClientBasicDetailsCardComponent.scss";
import AvatarComponent from "../../../../shared/components/avatar/AvatarComponent";
import DataLabelValueComponent from "../../../../shared/components/data-label-value/DataLabelValueComponent";

interface ClientBasicDetailsCardComponentProps {

}
const client_details={
    name:'Scott',
    title:'Schott eli',
    is_active:'true',
    id:'2345654',
    age:'42'
}

const ClientBasicDetailsCardComponent = (props: ClientBasicDetailsCardComponentProps) => {

    return (
        <div className={'client-basic-detail-card-wrapper'}>
            <div className={'client-basic-detail-card'}>
                <div className={'client-basic-detail-card-upper-portion'}>
                    <div className={'client-image-wrapper'}>
                        <AvatarComponent title={client_details.title}/>
                    </div>
                </div>
                <div className={'client-details-wrapper'}>
                <div className={'client-name'}>
                    {client_details.name}
                </div>
                <div className={'client-status'}>
                    {client_details.is_active?'Active':'Inactive'}
                </div>
                <div className={'dashed-border'}/>
                <div className={'client-id-age-wrapper'}>
                    <DataLabelValueComponent label={'Client ID'}>
                        {client_details.id}
                    </DataLabelValueComponent>
                    <DataLabelValueComponent label={'Age'}>
                        {client_details.age}
                    </DataLabelValueComponent>
                </div>
                </div>

            </div>

        </div>
    );

};

export default ClientBasicDetailsCardComponent;