export interface IFacility {
    _id: string;
    name: string;
    location: string;
    primary_email: string;
    primary_contact_info: PrimaryContactInfo;
    image: Image;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    services: any;
}
export interface PrimaryContactInfo {
    phone_type: string;
    phone: string;
}
export interface Image {
    name: string;
    type: string;
    key: string;
}
