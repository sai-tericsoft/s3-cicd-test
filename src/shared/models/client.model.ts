import {IEmploymentStatus, IGender, ILanguage, IPhoneType, IRelationship} from "./common.model";

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
        key: string ,
        order: string | undefined
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
    secondary_emails?: string[] | null;
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
