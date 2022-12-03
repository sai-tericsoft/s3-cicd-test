import {
    ICommunicationModeType,
    IEmploymentStatus,
    IGender,
    ILanguage,
    IMedicalHistoryOption,
    IPhoneType, IReferralType,
    IRelationship, ISurgicalHistoryOption,
    ITextValue
} from "./common.model";

export interface IClient {
    _id: string;
    client_id: string;
    first_name: string;
    last_name: string;
    primary_email: string;
    primary_contact_info: PrimaryContactInfo;
    is_active: boolean;
    last_appointment_date: string;
    last_provider: string;
}

export interface PrimaryContactInfo {
    phone_type: string;
    phone: string;
}

export interface IClientListFilterState {
    search: string;
    sort: {
        [key: string]: string,
    }
}

export interface IClientBasicDetailsForm {
    first_name: string;
    last_name: string;
    gender: string;
    dob: string;
    nick_name: string;
    ssn: string;
    primary_email: string;
    show_secondary_emergency_form: boolean;
    secondary_emails: SecondaryEmail[];
    primary_contact_info: SecondaryContactInfoEntityOrPrimaryContactInfo;
    secondary_contact_info?: (SecondaryContactInfoEntityOrPrimaryContactInfo)[] | null;
    emergency_contact_info: EmergencyContactInfo;
    work_info: WorkInfo;
    address: Address;

}

export interface SecondaryEmail {
    email: string;
}

export interface SecondaryContactInfoEntityOrPrimaryContactInfo {
    phone_type: string;
    phone: string;
}

export interface EmergencyContactInfo {
    primary_emergency: PrimaryEmergency;
    secondary_emergency: SecondaryEmergency;
}

export interface PrimaryEmergency {
    name: string;
    relationship: string;
    language: string;
    primary_contact_info: SecondaryContactInfoEntityOrPrimaryContactInfo;
    secondary_contact_info?: (SecondaryContactInfoEntityOrPrimaryContactInfo)[] | null;
}

export interface SecondaryEmergency {
    name: string;
    relationship: string;
    language: string;
    primary_contact_info: SecondaryContactInfoEntityOrPrimaryContactInfo;
    secondary_contact_info?: (SecondaryContactInfoEntityOrPrimaryContactInfo)[] | null;
}

export interface WorkInfo {
    occupation: string;
    employment_status: string;
}

export interface Address {
    address_line: string;
    city: string;
    country: string;
    zip_code: string;
    state: string;
}

export interface IClientBasicDetails {
    _id: string;
    client_id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    dob: string;
    gender: IGender;
    ssn: string;
    address: IAddress;
    primary_email: string;
    secondary_emails?: IEmail[] | null;
    primary_contact_info: IContactInfo;
    secondary_contact_info?: IContactInfo[] | null;
    emergency_contact_info: IEmergencyContactInfo;
    work_info: IWorkInfo;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    language?: ILanguage;
}

export interface IAddress {
    address_line: string;
    city: string;
    country: string;
    zip_code: string;
    state: string;
}

export interface IContactInfo {
    phone_type: IPhoneType;
    phone: string;
}

export interface IEmail {
    email: string;
}

export interface IEmergencyContactInfo {
    primary_emergency: IEmergency;
    secondary_emergency: IEmergency;
}

export interface IEmergency {
    name: string;
    relationship: IRelationship;
    language: ILanguage;
    primary_contact_info: IContactInfo;
    secondary_contact_info?: IContactInfo[] | null;
}

export interface IWorkInfo {
    occupation: string;
    employment_status: IEmploymentStatus;
}

export type ClientAddFormSteps =
    "basicDetails"
    | "personalHabits"
    | "allergies"
    | "medicalSupplements"
    | "surgicalHistory"
    | "medicalFemaleOnly"
    | "medicalProvider"
    | "musculoskeletal"
    | "medicalHistory"
    | "accountDetails"
    ;

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
export interface IClientMedicalSupplements{
    "non_prescription_medication": string;
    "prescription_medication": string;
}
export interface IClientMedicalHistoryForm {
    "medical_history": IClientMedicalHistory

}
export interface IClientMedicalHistory{
    "comments": string;
    "isCustomOption": boolean;
    "questions": string[];
}

export interface IClientSurgicalHistoryForm {
    "surgical_history":IClientSurgicalHistory
}
export interface IClientSurgicalHistory{
    "comments": string;
    "questions": ISurgicalHistoryOption[];
    "isCustomOption": boolean;
}

export interface IClientMedicalFemaleOnlyForm {
    "females_only_questions": IClientMedicalFemaleOnly
}
export interface IClientMedicalFemaleOnly{
    "Nursing?": string;
    "Pregnant or trying to get pregnant?": string;
}
export interface IClientMedicalProviderForm {
    "medical_provider_info":IClientMedicalProvider
}
export interface IClientMedicalProvider{
    "last_examination_date": string;
    "name": string;
    "primary_phone": string;
}

export interface IClientMusculoskeletalHistoryForm {
    "musculoskeletal_history": {
        [k: string]: {
            "text": string,
            "value": string
        }
    }
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
    musculoskeletal_history: IMusculoskeletalHistory;
    medical_provider_info: IClientMedicalProvider;
    created_at: string;
    updated_at: string;
}

export interface IClientMedicalHistoryDetails {
    questions: IMedicalHistoryOption[],
    comments: string;
}

export interface IClientSurgicalHistoryDetails {
    questions: ISurgicalHistoryOption[],
    comments: string;
}

export interface IMusculoskeletalHistory {
    [k: string]:{
        value: string;
        text: string;
        title: string;
    }
}

export interface IClientAccountDetailsForm {
    "communication_preferences": {
        "appointment_reminders": string;
        "appointment_confirmations": string;
    },
    "referral_details": {
        "source": string;
        "source_info_name": string;
        "source_info_phone"?: string;
        "source_info_email"?: string;
        "source_info_relationship"?: string;
    }
}

export interface IClientActivityLog {
    _id: string;
    client_id: string;
    module_name: string;
    field_name: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export interface IClientAccountDetails {
    "communication_preferences": {
        "appointment_reminders": ICommunicationModeType;
        "appointment_confirmations":  ICommunicationModeType;
    },
    "referral_details": {
        "source": IReferralType;
        "source_info_name": any; //Todo refactor model
        "source_info_phone"?: string;
        "source_info_email"?: string;
        "source_info_relationship"?: IRelationship;
    }
}