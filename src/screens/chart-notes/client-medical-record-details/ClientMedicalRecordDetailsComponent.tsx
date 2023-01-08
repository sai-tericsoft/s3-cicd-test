import "./ClientMedicalRecordDetailsComponent.scss";
import ClientMedicalDetailsCardComponent from "../client-medical-details-card/ClientMedicalDetailsCardComponent";
import MedicalInterventionListComponent from "../medical-intervention-list/MedicalInterventionListComponent";
import ClientMedicalAttachmentsComponent from "../client-medical-attachments/ClientMedicalAttachmentsComponent";

interface ClientMedicalDetailsComponentProps {

}

const ClientMedicalRecordDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {

    return (
        <div className={'client-medical-record-details-component'}>
            <ClientMedicalDetailsCardComponent showAction={true} />
            <MedicalInterventionListComponent/>
            <ClientMedicalAttachmentsComponent/>
        </div>
    );

};

export default ClientMedicalRecordDetailsComponent;
