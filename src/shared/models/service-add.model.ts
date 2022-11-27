export interface IServiceAdd{
    name:string;
    description:string;
    image:any;
    initial_consultation: IInitialConsultation[];
    followup_consultation: IInitialConsultation[];
}

export interface IInitialConsultation {
    title: string;
    consultation_details: IConsultation[];
}

interface IConsultation {
    duration?: number;
    price?: number;
}