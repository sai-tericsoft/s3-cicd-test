import "./ClientMedicalRecordDetailsComponent.scss";
import ClientMedicalDetailsCardComponent from "../client-medical-details-card/ClientMedicalDetailsCardComponent";
import ClientMedicalRecordsComponent from "../client-medical-records/ClientMedicalRecordsComponent";

interface ClientMedicalDetailsComponentProps {

}

const ClientMedicalRecordDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {

    return (
        <div className={'client-medical-record-details-component'}>
            <ClientMedicalDetailsCardComponent />
            <ClientMedicalRecordsComponent/>
            {/*<ClientMedicalAttachmentsComponent/>*/}
        </div>
    );

};

export default ClientMedicalRecordDetailsComponent;
