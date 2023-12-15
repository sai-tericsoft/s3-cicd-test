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
import React, {useCallback, useEffect} from "react";
import moment from "moment-timezone";
import {ListItemButton} from "@mui/material";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import momentTimezone from "moment-timezone";

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
    isDocumentShared?: boolean;
    onRemoveAccess: Function;
    medicalRecordDocumentId?: string;
    noteTypeCategory?: string;
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
        showEdit,
        isDocumentShared,
        onRemoveAccess,
        medicalRecordDocumentId,
        noteTypeCategory,
    } = props;

    const [tempAttachmentDetails] = React.useState<any>(attachmentDetails);

    const [isShared, setIsShared] = React.useState<boolean>(false);

    useEffect(() => {
        setIsShared(!!isDocumentShared);
    }, [isDocumentShared]);

    const handleEdit = useCallback(() => {
        if (onEdit) {
            onEdit();
        }
    }, [onEdit]);

    const handleRemoveAccess = useCallback((item: any) => {
        // commonService.openConfirmationDialog({
        //     confirmationTitle: "REMOVE ACCESS",
        //     confirmationSubTitle: "Are you sure you want to remove access for this shared document?",
        //     image: `${ImageConfig.confirmImage}`,
        //     yes: {
        //         text: "Yes",
        //         color: "primary"
        //     },
        //     no: {
        //         text: "No",
        //         color: "primary"
        //     }
        // })
        CommonService.onConfirm({
            image: ImageConfig.PopupLottie,
            showLottie: true,
            confirmationTitle: "REMOVE ACCESS",
            confirmationSubTitle: "Are you sure you want to remove access for this shared document?",
        })
            .then((res: any) => {
                onRemoveAccess(item);
            })
    }, [onRemoveAccess]);

    const handlePrint = useCallback(() => {

        if (medicalRecordDocumentId) {
            const payload = {
                note_type_category: noteTypeCategory,
                timezone: momentTimezone.tz.guess(),
            }
            CommonService._chartNotes.PrintDocument(medicalRecordDetails?._id, medicalRecordDocumentId, payload)
                .then((res: any) => {
                    const attachment = {
                        type: 'application/pdf',
                        url: res.data.url,
                        name: 'progress report',
                        key: ''
                    };
                    CommonService.printAttachment(attachment);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        }
    }, [medicalRecordDetails?._id, medicalRecordDocumentId, noteTypeCategory]);

    return (
        <div className={"medical-record-attachment-basic-details-card-component"}>
            <PageHeaderComponent title={pageTitle} actions={<>
                <div className={"medical-attachment-last-updated-on-wrapper"}>
                    <DataLabelValueComponent className={'mrg-bottom-0'} label={"Last updated on: "} direction={"row"}>
                        {(tempAttachmentDetails.updated_at ? moment(tempAttachmentDetails.updated_at).tz(moment.tz.guess()).format('DD-MMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                        {tempAttachmentDetails?.last_updated_by_details?.first_name ? tempAttachmentDetails?.last_updated_by_details?.first_name + ' ' + tempAttachmentDetails?.last_updated_by_details?.last_name : ' N/A'}
                    </DataLabelValueComponent>
                </div>
            </>}/>
            {
                isShared &&
                <div className={"medical-record-attachment-remove-access-wrapper"}>
                    <div className={"medical-record-attachment-data-wrapper"}>
                        This file was shared to the client
                        on <b>{tempAttachmentDetails?.shared_at ? CommonService.transformTimeStamp(tempAttachmentDetails?.shared_at) : 'N/A'}</b>.
                    </div>
                    <LinkComponent
                        onClick={() => {
                            handleRemoveAccess(tempAttachmentDetails);
                        }}

                    >
                        Remove Access
                    </LinkComponent>
                </div>
            }
            <div className={"medical-record-attachment-basic-details-wrapper"}>
                <CardComponent color={"primary"}>
                    <div className={"medical-record-attachment-basic-details-header"}>
                        <div className={"medical-record-attachment-basic-details-name-status-wrapper"}>
                            <div className={"medical-record-attachment-basic-details-name"}>
                                <span
                                    className={medicalRecordDetails.client_details?.is_alias_name_set ? 'alias-name' : ''}> {CommonService.extractName(medicalRecordDetails.client_details)}</span>
                            </div>
                            <div className={"medical-record-attachment-basic-details-status"}>
                                <ChipComponent
                                    label={tempAttachmentDetails?.medical_record_details?.status === "open" ? "Open - Unresolved" : 'Closed - Resolved'}
                                    color={"success"}
                                    className={tempAttachmentDetails?.medical_record_details?.status === "open" ? 'active' : 'inactive'}/>
                            </div>
                        </div>
                        <div className={"medical-record-attachment-basic-details-actions"}>
                            {/*{*/}
                            {/*    (pageTitle === "View Document" || pageTitle === "View Dry Needling File") && <>*/}
                            {/*        <ButtonComponent*/}
                            {/*            prefixIcon={<ImageConfig.ShareIcon/>}*/}
                            {/*            className={'mrg-right-10'}*/}
                            {/*            onClick={pageTitle === "View Document" ? onShare : onDryNeedingShare}*/}
                            {/*        >*/}
                            {/*            Share*/}
                            {/*        </ButtonComponent>*/}
                            {/*    </>*/}
                            {/*}*/}
                            {/*{*/}
                            {/*    attachmentType === "concussionFile" && <>*/}
                            {/*        <ButtonComponent*/}
                            {/*            prefixIcon={<ImageConfig.ShareIcon/>}*/}
                            {/*            className={'mrg-right-10'}*/}
                            {/*            onClick={onConcussionFileShare}*/}
                            {/*        >*/}
                            {/*            Share*/}
                            {/*        </ButtonComponent>*/}
                            {/*    </>*/}
                            {/*}*/}
                            {/*{*/}
                            {/*    onDelete && <>*/}
                            {/*        <ButtonComponent*/}
                            {/*            className={'mrg-right-10'}*/}
                            {/*            onClick={onDelete}*/}
                            {/*            variant={'outlined'}*/}
                            {/*            color={'error'}*/}
                            {/*            prefixIcon={<ImageConfig.DeleteIcon/>}>*/}
                            {/*            Delete Document*/}
                            {/*        </ButtonComponent>*/}
                            {/*    </>*/}
                            {/*}*/}
                            {showEdit && <ButtonComponent
                                prefixIcon={<ImageConfig.EditIcon/>}
                                onClick={handleEdit}
                            >
                                Edit Details
                            </ButtonComponent>}

                            <MenuDropdownComponent className={'billing-details-drop-down-menu'} menuBase={
                                <ButtonComponent size={'large'} variant={'outlined'} fullWidth={true}
                                >
                                    Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                                </ButtonComponent>
                            } menuOptions={[
                                (pageTitle === "View Document" || pageTitle === "View Dry Needling File" || attachmentType === "concussionFile") &&
                                <ListItemButton
                                    disabled={isShared}
                                    onClick={attachmentType === "concussionFile" ? onConcussionFileShare : (pageTitle === "View Document") ? onShare : onDryNeedingShare}>
                                    Share
                                </ListItemButton>,
                                <ListItemButton onClick={handlePrint}>
                                    Print
                                </ListItemButton>,
                                <ListItemButton
                                    disabled={!onDelete}
                                    onClick={onDelete}>
                                    Delete Document
                                </ListItemButton>,

                            ]}
                            />
                        </div>
                    </div>
                    <MedicalInterventionLinkedToComponent label={'Document Linked to:'}
                                                          medicalRecordDetails={medicalRecordDetails}/>
                    <div className={"ts-row"}>
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <DataLabelValueComponent label={"Date of Document"}>
                                {tempAttachmentDetails.document_date ? CommonService.getSystemFormatTimeStamp(tempAttachmentDetails.document_date) : "-"}
                            </DataLabelValueComponent>
                        </div>
                        <>
                            {
                                attachmentType === "medicalRecordDocument" && <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Document Type"}>
                                        {tempAttachmentDetails?.document_type_details?.type}
                                    </DataLabelValueComponent>
                                </div>
                            }
                        </>
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <DataLabelValueComponent label={"Attached by"}>
                                {CommonService.extractName(tempAttachmentDetails?.attached_by_details)}
                            </DataLabelValueComponent>
                        </div>
                    </div>
                    <div className={"ts-row"}>
                        <div className="ts-col-12">
                            <DataLabelValueComponent label={"Comments"}>
                                {tempAttachmentDetails.comments ? tempAttachmentDetails.comments : "N/A"}
                            </DataLabelValueComponent>
                        </div>
                    </div>
                </CardComponent>
            </div>
        </div>
    );

};

export default MedicalRecordAttachmentBasicDetailsCardComponent;
