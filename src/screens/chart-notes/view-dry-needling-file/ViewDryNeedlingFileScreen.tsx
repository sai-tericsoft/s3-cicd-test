import "./ViewDryNeedlingFileScreen.scss";
import {useParams} from "react-router-dom";
import MedicalRecordAttachmentBasicDetailsCardComponent
    from "../medical-record-attachment-basic-details-card/MedicalRecordAttachmentBasicDetailsCardComponent";
import AttachmentComponent from "../../../shared/attachment/AttachmentComponent";

interface ViewDryNeedlingFileScreenProps {

}

const ViewDryNeedlingFileScreen = (props: ViewDryNeedlingFileScreenProps) => {

    const {medicalRecordId, dryNeedlingFileId} = useParams();
    const dryNeedlingFileDetails = {
        "_id": "63c65a2a12bb563ad502973d",
        "medical_record_id": "63bff49a383cd0c23a5ba415",
        "intervention_id": "63bff49b383cd0c23a5ba418",
        "document_date": "2022-12-03T00:00:00.000Z",
        "attached_by": "637b2800d5cc2f7067e6ae33",
        "comments": "bye",
        "attachment": {
            "name": "cat.jpg",
            "type": "image/jpeg",
            "key": "Interventions/63bff49b383cd0c23a5ba418/Dry Needling/63c65a2a12bb563ad502973d",
            "url": "https://kinergy-dev.s3.ap-south-1.amazonaws.com/Interventions/63bff49b383cd0c23a5ba418/Dry%20Needling/63c65a2a12bb563ad502973d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6LCW3LSHDADD2WF7%2F20230118%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230118T095837Z&X-Amz-Expires=900&X-Amz-Signature=9b9479709b08579d08da92f2ff325b19ab3743458c3f02729b80b6246f0bfa7d&X-Amz-SignedHeaders=host"
        },
        "created_at": "2023-01-17T08:19:54.963Z",
        "updated_at": "2023-01-17T08:22:04.721Z",
        "attached_by_details": {
            "_id": "637b2800d5cc2f7067e6ae33",
            "first_name": "terrill",
            "last_name": "lobo"
        },
        "medical_record_details": {
            "_id": "63bff49a383cd0c23a5ba415",
            "client_id": "63905e4ba2bba5718d3b4c4a",
            "category_id": null,
            "service_id": null,
            "onset_date": "2022-11-02T00:00:00.000Z",
            "case_physician": {
                "is_case_physician": true,
                "name": "Fzk",
                "next_appointment": "2023-01-24T00:00:00.000Z"
            },
            "injury_description": "descriptions",
            "limitations": "issuess",
            "injury_details": [
                {
                    "body_part_id": "63aaa520fa2621a3af6ace13",
                    "body_side": "Left",
                    "injury_type_id": "637f420dd8a7cf010f1490b6",
                    "body_part_details": {
                        "_id": "63aaa520fa2621a3af6ace13",
                        "name": "Cervical Spine",
                        "sides": [
                            "Left",
                            "Right",
                            "Central"
                        ],
                        "special_tests": [
                            "Tinel’s Test",
                            "Valgus Stress Test",
                            "Varusus Stress Test",
                            "Lateral Epicondylitis Test"
                        ],
                        "default_body_side": "Left",
                        "movements": [
                            {
                                "name": "Lateral Flexion",
                                "applicable_rom": [
                                    "AROM",
                                    "PROM",
                                    "Strength"
                                ],
                                "applicable_sides": [
                                    "Left",
                                    "Right"
                                ]
                            },
                            {
                                "name": "Rotation",
                                "applicable_rom": [
                                    "AROM",
                                    "PROM",
                                    "Strength"
                                ],
                                "applicable_sides": [
                                    "Left",
                                    "Right"
                                ]
                            },
                            {
                                "name": "Flexion",
                                "applicable_rom": [
                                    "AROM",
                                    "PROM",
                                    "Strength"
                                ],
                                "applicable_sides": [
                                    "Central"
                                ]
                            },
                            {
                                "name": "Extension",
                                "applicable_rom": [
                                    "AROM",
                                    "PROM",
                                    "Strength"
                                ],
                                "applicable_sides": [
                                    "Central"
                                ]
                            }
                        ]
                    }
                }
            ],
            "status": "open",
            "created_at": "2023-01-12T11:52:58.951Z",
            "updated_at": "2023-01-13T13:11:57.531Z",
            "client_details": {
                "_id": "63905e4ba2bba5718d3b4c4a",
                "first_name": "Client",
                "last_name": "Kutch"
            }
        }
    };

    return (
        <div className={'view-dry-needling-file-screen'}>
            <MedicalRecordAttachmentBasicDetailsCardComponent
                pageTitle={"View Dry Needling File"}
                attachmentDetails={dryNeedlingFileDetails}
                medicalRecordDetails={dryNeedlingFileDetails.medical_record_details}
                attachmentType={"dryNeedlingFile"}

            />
            <div>
                <AttachmentComponent attachment={dryNeedlingFileDetails.attachment}/>
            </div>
        </div>
    );

};

export default ViewDryNeedlingFileScreen;
