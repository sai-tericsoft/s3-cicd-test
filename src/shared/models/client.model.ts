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
