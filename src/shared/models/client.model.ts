import {
    ICommunicationModeType,
    IEmploymentStatus, IGender,
    ILanguage,
    IMedicalHistoryOption,
    IPhoneType, IReferralType,
    IRelationship,
    ISocialMediaPlatform, ISurgicalHistoryOption,
    ITextValue
} from "./common.model";

export type IClientDetailsSteps =
    "basicDetails"
    | "medicalHistoryQuestionnaire"
    | "accountDetails"
    | "activityLog"
    ;

export type IClientFormSteps =
    "basicDetails"
    | "personalHabits"
    | "allergies"
    | "medicalSupplements"
    | "medicalHistory"
    | "surgicalHistory"
    | "medicalFemaleOnly"
    | "medicalProvider"
    | "musculoskeletalHistory"
    | "accountDetails"
    ;

export interface IClientListFilterState {
    search: string;
    is_active?: string;
    sort: {
        [key: string]: string,
    }
    is_chart_notes?:boolean
    page?: number;
}

export interface IClientMedicalStatusFilterState {
    status?: boolean;
}

export interface IClientBasicDetails {
    _id?: string;
    first_name: string;
    last_name: string;
    alias_first_name?: string;
    alias_last_name?: string;
    is_alias_name_set?: boolean;
    gender: string;
    gender_details?: IGender;
    dob: string;
    nick_name?: string;
    client_id?: string;
    ssn: string;
    is_active?: boolean;
    primary_email: string;
    show_secondary_emergency_form: boolean;
    secondary_emails?: IEmail[];
    primary_contact_info: IContactInfo;
    secondary_contact_info?: IContactInfo[];
    emergency_contact_info: IEmergencyContactInfo;
    work_info: IWorkInfo;
    address: IAddress;
    last_completed_intervention_date?: string;
    last_provider?: any;
    last_provider_details?: any;
    created_at?: string;
    send_invite?: boolean;
}

export interface IClientAppointmentsFilterState {
    status: string;
    provider_id: any;
}

export interface IClientDocumentsFilterState {
    posted_by: any;
    date_range: any;
    start_date: any;
    end_date: any;
    is_shared?: any;
}

export interface IEmergencyContactInfo {
    primary_emergency: IEmergencyContact;
    secondary_emergency: IEmergencyContact;
}

export interface IWorkInfo {
    occupation: string;
    employment_status: string;
    employment_status_details?: IEmploymentStatus;
}

export interface IAddress {
    address_line: string;
    city: string;
    country: string;
    zip_code: string;
    state: string;
}

export interface IContactInfo {
    phone_type: string;
    phone_type_details?: IPhoneType;
    phone?: string;
    terisoft?: string;
}

export interface IEmail {
    email: string;
}

export interface IEmergencyContact {
    name: string;
    relationship_details?: IRelationship;
    relationship: string;
    language: string;
    language_details?: ILanguage;
    primary_contact_info: IContactInfo;
    secondary_contact_info?: IContactInfo[];
}

export interface IClientMedicalDetails {
    _id: string;
    client_id: string;
    personal_habits: IClientPersonalHabits;
    allergies: string;
    medications: IClientMedicalSupplements;
    medical_history: IClientMedicalHistoryDetails;
    females_only_questions: IClientMedicalFemaleOnly;
    surgical_history: IClientSurgicalHistoryDetails;
    musculoskeletal_history: IClientMusculoskeletalHistory;
    medical_provider_info: IClientMedicalProvider;
    created_at: string;
    updated_at: string;
}

export interface IClientMedicalRecord {
    _id: string;
    client_id: string;
    name: string;
    status: string;
    onset_date: string;
    date_of_surgery: string;
    surgery_date: string;
    case_physician: any;
    next_md_appointment: string;
    total_direct_minutes: number;
    injury_description: string;
    limitations: string;
    intervention_linked_to: string;
    next_appointment: string;
    injury_details: any;
    body_side: string;
    created_at: string | undefined;
    status_details: any;
    client_details: IClientBasicDetails;
}

export interface IClientPersonalHabitsForm {
    "personal_habits": IClientPersonalHabits;
}

export interface IClientPersonalHabits {
    "Smoke/Chew Tobacco?": ITextValue;
    "Drink Alcohol?": ITextValue;
    "Drink Coffee?": ITextValue;
    "Drink Soda/Pop?": ITextValue;
}

export interface IClientAllergiesForm {
    allergies: string;
}

export interface IClientMedicalSupplementsForm {
    "medications": IClientMedicalSupplements
}

export interface IClientMedicalSupplements {
    "non_prescription_medication": string;
    "prescription_medication": string;
}

export interface IClientMedicalHistoryForm {
    "medical_history": IClientMedicalHistoryDetails
}

export interface IClientSurgicalHistoryForm {
    "surgical_history": IClientSurgicalHistoryDetails
}

export interface IClientMedicalFemaleOnlyForm {
    "females_only_questions": IClientMedicalFemaleOnly
}

export interface IClientMedicalFemaleOnly {
    "Nursing?": string;
    "Pregnant or trying to get pregnant?": string;
}

export interface IClientMedicalProviderForm {
    "medical_provider_info": IClientMedicalProvider
}

export interface IClientMedicalProvider {
    "last_examination_date": string;
    "family_doctor_name": string;
    "md_phone": string;
    "primary_phone_details"?: IPhoneType;
    "referring_doctor_name":string;
    "primary_phone":string;


}

export interface IClientMusculoskeletalHistoryForm {
    "musculoskeletal_history": IClientMusculoskeletalHistory
}

export interface IClientMedicalHistoryDetails {
    questions: string[],
    questions_details?: IMedicalHistoryOption[]
    comments: string;
    isCustomOption: boolean;
}

export interface IClientSurgicalHistoryDetails {
    questions: string[],
    questions_details?: ISurgicalHistoryOption[],
    comments: string;
    isCustomOption: boolean;
}

export interface IClientMusculoskeletalHistory {
    [k: string]: {
        value: string;
        text: string;
        title: string;
    }
}

export interface IClientAccountDetails {
    client_id?: string;
    "communication_preferences": {
        "appointment_reminders": string;
        "appointment_reminders_details"?: ICommunicationModeType;
        "appointment_confirmations": string;
        "appointment_confirmations_details"?: ICommunicationModeType;
    },
    "referral_details": {
        "source": string;
        "source_details"?: IReferralType;
        "source_info_name": string
        "source_info_name_details"?: string | ICommunicationModeType | ISocialMediaPlatform | any;
        "source_info_phone"?: string;
        "source_info_email"?: string;
        "source_info_relationship"?: string;
        "source_info_relationship_details"?: IRelationship;
    }
}

export interface IClientActivityLog {
    _id: string;
    client_id: string;
    module_name: string;
    field_name: string;
    updated_by: {
        _id: string;
        name: string;
    };
    created_at: string;
    updated_at: string;
}
