import {IAttachment} from "./common.model";

export interface IServiceCategory {
    _id: string;
    name: string;
    description: string;
    image: IAttachment;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    services_count: number;
}

export interface IServiceCategoryAddForm {
    name: string;
    description: string;
    image: any;
    bg_color_code?: any;
    text_color_code?: any;

}

export interface IServiceCategoryEditForm {
    name: string;
    description: string;
    image: any;
    is_active: boolean;
}
