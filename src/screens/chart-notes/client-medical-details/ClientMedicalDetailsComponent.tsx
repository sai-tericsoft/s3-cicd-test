import "./ClientMedicalDetailsComponent.scss";
import ClientMedicalDetailsCardComponent from "../client-medical-details-card/ClientMedicalDetailsCardComponent";
import ClientMedicalAttachmentsComponent from "../client-medical-attachments/ClientMedicalAttachmentsComponent";
import ClientMedicalRecordsComponent from "../client-medical-records/ClientMedicalRecordsComponent";

interface ClientMedicalDetailsComponentProps {

}

const ClientMedicalDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {

    return (
        <div className={'client-medical-details-component'}>
            <ClientMedicalDetailsCardComponent />
            <ClientMedicalRecordsComponent/>
            {/*<ClientMedicalAttachmentsComponent/>*/}
        </div>
    );

};

export default ClientMedicalDetailsComponent;