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
    primary_contact_info: SecondaryContactInfoEntityOrPrimaryContactInfo;
    secondary_contact_info?: (SecondaryContactInfoEntityOrPrimaryContactInfo)[] | null;
    emergency_contact_info: EmergencyContactInfo;
    work_info: WorkInfo;
    address: Address;
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

