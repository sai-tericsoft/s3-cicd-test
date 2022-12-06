import {IConsultationDuration} from "./static-data.model";
import {IServiceCategory} from "./service-category.model";

export interface IService{
    _id?: string;
    name:string;
    description:string;
    image:any;
    category_id?: string;
    is_active?: boolean;
    category?: IServiceCategory;
    initial_consultation: IInitialConsultation[];
    followup_consultation: IInitialConsultation[];
}

export interface IInitialConsultation {
    title: string;
    consultation_details: IConsultation[];
}

export interface IConsultation {
    duration?: string;
    duration_details?: IConsultationDuration;
    price?: string;
}
