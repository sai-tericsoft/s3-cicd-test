export interface ICommonType {
    code: any;
    title: string;
}

export interface IConsultationDuration {
    _id: string;
    code: string;
    title: string;
}

export interface IBodyPart {
    _id: string;
    name: string;
    sides: (string)[] | null;
    movements: (IMovementsEntity)[] | null;
    special_tests?: (string)[] | null;
    default_body_side: string;
}
export interface IMovementsEntity {
    name: string;
    applicable_rom?: (string)[] | null;
    applicable_sides?: (string)[] | null;
}

export interface IBodyPartROMConfig {
    body_part: IBodyPart,
    sides: string[],
}

