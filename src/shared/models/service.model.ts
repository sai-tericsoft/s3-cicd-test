export interface IServiceAdd{
    name:string;
    description:string;
    image:any;
    category_id: string;
    initial_consultation: IInitialConsultation[];
    followup_consultation: IInitialConsultation[];
}

export interface IInitialConsultation {
    title: string;
    consultation_details: IConsultation[];
}

interface IConsultation {
    duration?: string;
    price?: string;
}

export interface IServiceEdit{
    name:string;
    description:string;
    image:any;
    is_active: boolean;
    category_id: string;
    initial_consultation: IInitialConsultation[];
    followup_consultation: IInitialConsultation[];
}