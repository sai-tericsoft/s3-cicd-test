import "./MedicalRecordAttachmentBasicDetailsCardComponent.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import {CommonService} from "../../../shared/services";
import {useCallback} from "react";
import moment from "moment-timezone";

interface MedicalRecordAttachmentBasicDetailsCardComponentProps {
    attachmentType: "dryNeedlingFile" | "concussionFile" | "medicalRecordDocument";
    pageTitle: string;
    attachmentDetails: any;
    medicalRecordDetails: any;
    onEdit?: () => void;
    showEdit?: boolean;
    onDelete?: () => void;
    onShare?: () => void;
    onDryNeedingShare?: () => void;
    onConcussionFileShare?: () => void;
}

const MedicalRecordAttachmentBasicDetailsCardComponent = (props: MedicalRecordAttachmentBasicDetailsCardComponentProps) => {

    const {
        pageTitle,
        onShare,
        onDryNeedingShare,
        onConcussionFileShare,
        medicalRecordDetails,
        attachmentDetails,
        attachmentType,
        onEdit,
        onDelete,
        showEdit
    } = props;

    const handleEdit = useCallback(() => {
        if (onEdit) {
            onEdit();
        }
    }, [onEdit]);


    return (
        <div className={"medical-record-attachment-basic-details-card-component"}>
            <PageHeaderComponent title={pageTitle} actions={<>
                <div className={"medical-attachment-last-updated-on-wrapper"}>
                    <DataLabelValueComponent className={'mrg-bottom-0'} label={"Last updated on: "} direction={"row"}>
                        {(attachmentDetails.updated_at ? moment(attachmentDetails.updated_at).tz(moment.tz.guess()).format('DD-MMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                        {attachmentDetails?.last_updated_by_details?.first_name ? attachmentDetails?.last_updated_by_details?.first_name + ' ' + attachmentDetails?.last_updated_by_details?.last_name : ' N/A'}
                    </DataLabelValueComponent>
                </div>
            </>}/>
            <div className={"medical-record-attachment-basic-details-wrapper"}>
                <CardComponent color={"primary"}>
                    <div className={"medical-record-attachment-basic-details-header"}>
                        <div className={"medical-record-attachment-basic-details-name-status-wrapper"}>
                            <div className={"medical-record-attachment-basic-details-name"}>
                                <span className={medicalRecordDetails.client_details?.is_alias_name_set ? 'alias-name':''}> {CommonService.extractName(medicalRecordDetails.client_details)}</span>
                            </div>
                            <div className={"medical-record-attachment-basic-details-status"}>
                                <ChipComponent
                                    label={attachmentDetails?.medical_record_details?.status === "open" ? "Open - Unresolved" : 'Closed - Resolved'}
                                    color={"success"}
                                    className={attachmentDetails?.medical_record_details?.status === "open" ? 'active' : 'inactive'}/>
                            </div>
                        </div>
                        <div className={"medical-record-attachment-basic-details-actions"}>
                            {
                                (pageTitle === "View Document" || pageTitle === "View Dry Needling File") && <>
                                    <ButtonComponent
                                        prefixIcon={<ImageConfig.ShareIcon/>}
                                        className={'mrg-right-10'}
                                        onClick={pageTitle === "View Document" ? onShare : onDryNeedingShare}
                                    >
                                        Share
                                    </ButtonComponent>
                                </>
                            }
                            {
                                attachmentType === "concussionFile" && <>
                                    <ButtonComponent
                                        prefixIcon={<ImageConfig.ShareIcon/>}
                                        className={'mrg-right-10'}
                                        onClick={onConcussionFileShare}
                                    >
                                        Share
                                    </ButtonComponent>
                                </>
                            }
                            {
                                onDelete && <>
                                    <ButtonComponent
                                        className={'mrg-right-10'}
                                        onClick={onDelete}
                                        variant={'outlined'}
                                        color={'error'}
                                        prefixIcon={<ImageConfig.DeleteIcon/>}>
                                        Delete Document
                                    </ButtonComponent>
                                </>
                            }
                            {showEdit && <ButtonComponent
                                prefixIcon={<ImageConfig.EditIcon/>}
                                onClick={handleEdit}
                            >
                                Edit Details
                            </ButtonComponent>}
                        </div>
                    </div>
                    <MedicalInterventionLinkedToComponent label={'Document Linked to:'}
                                                          medicalRecordDetails={medicalRecordDetails}/>
                    <div className={"ts-row"}>
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <DataLabelValueComponent label={"Date of Document"}>
                                {attachmentDetails.document_date ? CommonService.getSystemFormatTimeStamp(attachmentDetails.document_date) : "-"}
                            </DataLabelValueComponent>
                        </div>
                        <>
                            {
                                attachmentType === "medicalRecordDocument" && <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Document Type"}>
                                        {attachmentDetails?.document_type_details?.type}
                                    </DataLabelValueComponent>
                                </div>
                            }
                        </>
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <DataLabelValueComponent label={"Attached by"}>
                                {CommonService.extractName(attachmentDetails?.attached_by_details)}
                            </DataLabelValueComponent>
                        </div>
                    </div>
                    <div className={"ts-row"}>
                        <div className="ts-col-12">
                            <DataLabelValueComponent label={"Comments"}>
                                {attachmentDetails.comments ? attachmentDetails.comments : "N/A"}
                            </DataLabelValueComponent>
                        </div>
                    </div>
                </CardComponent>
            </div>
        </div>
    );

};

export default MedicalRecordAttachmentBasicDetailsCardComponent;
