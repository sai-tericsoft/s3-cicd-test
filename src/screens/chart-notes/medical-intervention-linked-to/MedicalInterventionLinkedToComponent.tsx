import "./MedicalInterventionLinkedToComponent.scss";
import {CommonService} from "../../../shared/services";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import React, {useCallback, useEffect, useState} from "react";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {fromEvent} from "rxjs";

interface MedicalInterventionLinkedToComponentProps {
    medicalRecordDetails: any;
    label?: string;
}

const MedicalInterventionLinkedToComponent = (props: MedicalInterventionLinkedToComponentProps) => {

        const {medicalRecordDetails, label} = props;
        const [isBodyPartsModalOpen, setIsBodyPartsModalOpen] = React.useState<boolean>(false);
        const interventionDivRef = React.useRef<HTMLDivElement>(null);
        const [shouldShowViewAllBodyParts, setShowViewAllBodyParts] = useState<boolean>(false);

        const openBodyPartsModal = useCallback(() => {
            setIsBodyPartsModalOpen(true);
        }, []);

        const closeBodyPartsModal = useCallback(() => {
            setIsBodyPartsModalOpen(false);
        }, []);

        const bodyPartsColumns: any = [
            {
                title: "Body Part",
                dataIndex: "body_part",
                key: "body_part",
                fixed: "left",
                width: 151,
                render: (item: any) => {
                    return <>{item?.body_part_details?.name}</>
                }
            },
            {
                title: "Body  Side(s)",
                dataIndex: "body_side",
                key: "body_side",
                width: 114,
                render: (item: any) => {
                    return <>{item?.body_side || "N/A"}</>
                }
            }];

        const shouldShowViewAllBodyPartsButton = useCallback(() => {
            if (interventionDivRef.current) {
                setShowViewAllBodyParts(CommonService.isTextEllipsisActive(interventionDivRef.current));
            }
        }, []);

        useEffect(() => {
            shouldShowViewAllBodyPartsButton();
        }, [shouldShowViewAllBodyPartsButton, medicalRecordDetails]);

        useEffect(() => {
            const sub = fromEvent(window, "resize").subscribe(() => {
                shouldShowViewAllBodyPartsButton();
            });
            return () => {
                if (sub) {
                    sub.unsubscribe();
                }
            }
        }, [shouldShowViewAllBodyPartsButton]);

        return (
            <div className={'medical-intervention-linked-to-component'}>
                <DataLabelValueComponent label={label ? label : 'Intervention Linked to:'} direction={"row"}
                                         className={'medical-record-injury-details-wrapper'}>
                    <div className={'medical-record-injury-details'} ref={interventionDivRef}>
                        {medicalRecordDetails?.intervention_linked_to}
                        {medicalRecordDetails?.created_at && CommonService.transformTimeStamp(medicalRecordDetails?.created_at)}{" "}
                        {"-"} {medicalRecordDetails?.injury_details?.map((injury: any, index: number) => {
                        return <>{injury.body_part_details.name} {injury.body_side ? `( ${injury.body_side} )` : ''} {index !== medicalRecordDetails?.injury_details.length - 1 ? <> | </> : ""}</>
                    })}
                    </div>
                    {
                        (medicalRecordDetails?.injury_details?.length > 1 && shouldShowViewAllBodyParts) &&
                        <span className={'medical-record-injury-details-view-all-body-parts'}
                              onClick={openBodyPartsModal}>
                        View All Body Parts
                        </span>
                    }
                </DataLabelValueComponent>

                {/*Body Parts Modal Start*/}
                <ModalComponent title={"All Added Body Parts"} className={'all-body-body-parts-heading'}
                                isOpen={isBodyPartsModalOpen} onClose={closeBodyPartsModal}>
                    <TableComponent data={medicalRecordDetails?.injury_details} columns={bodyPartsColumns}/>
                    <div className={'close-modal-btn'}>
                        <ButtonComponent onClick={closeBodyPartsModal}>Close</ButtonComponent>
                    </div>
                </ModalComponent>
                {/*Body Parts Modal End*/}

            </div>
        );

    }
;

export default MedicalInterventionLinkedToComponent;
