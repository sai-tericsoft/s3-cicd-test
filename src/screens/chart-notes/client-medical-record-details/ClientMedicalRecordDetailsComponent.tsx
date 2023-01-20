import "./ClientMedicalRecordDetailsComponent.scss";
import MedicalRecordBasicDetailsCardComponent from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import MedicalInterventionListComponent from "../medical-intervention-list/MedicalInterventionListComponent";
import MedicalRecordAttachmentsComponent from "../medical-record-attachments/MedicalRecordAttachmentsComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";

interface ClientMedicalDetailsComponentProps {

}

const ClientMedicalRecordDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {

    return (
        <div className={'client-medical-record-details-component'}>
            <PageHeaderComponent title={"Medical Record Main Page"}/>
            <MedicalRecordBasicDetailsCardComponent showAction={true}/>
            <MedicalInterventionListComponent/>
            <MedicalRecordAttachmentsComponent/>
        </div>
    );

};

export default ClientMedicalRecordDetailsComponent;
