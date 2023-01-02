import "./ClientMedicalRecordDetailsComponent.scss";
import ClientMedicalDetailsCardComponent from "../client-medical-details-card/ClientMedicalDetailsCardComponent";

interface ClientMedicalDetailsComponentProps {

}

const ClientMedicalRecordDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {

    return (
        <div className={'client-medical-record-details-component'}>
            <ClientMedicalDetailsCardComponent />
            {/*<ClientMedicalRecordsComponent/>*/}
            {/*<ClientMedicalAttachmentsComponent/>*/}
        </div>
    );

};

export default ClientMedicalRecordDetailsComponent;
