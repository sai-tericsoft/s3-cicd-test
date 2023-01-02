import "./ClientMedicalRecordDetailsComponent.scss";
import ClientMedicalDetailsCardComponent from "../client-medical-details-card/ClientMedicalDetailsCardComponent";
import MedicalInterventionListComponent from "../medical-intervention-list/MedicalInterventionListComponent";

interface ClientMedicalDetailsComponentProps {

}

const ClientMedicalRecordDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {

    return (
        <div className={'client-medical-record-details-component'}>
            <ClientMedicalDetailsCardComponent />
            <MedicalInterventionListComponent/>
            {/*<ClientMedicalAttachmentsComponent/>*/}
        </div>
    );

};

export default ClientMedicalRecordDetailsComponent;
