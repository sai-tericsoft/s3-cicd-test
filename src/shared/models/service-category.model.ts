export interface IServiceCategory {
    _id: string;
    name: string;
    description: string;
    image_key: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    image_url: string;
    services_count: number;
}
