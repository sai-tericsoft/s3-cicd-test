export interface IAttachment {
    name: string;
    type: string;
    key: string;
    url: string;
}

export interface IGender {
    _id: string;
    code: string;
    title: string;
}

export interface IPhoneType {
    _id: string;
    code: string;
    title: string;
}

export interface ILanguage {
    _id: string;
    code: string;
    title: string;
}

export interface IRelationship {
    _id: string;
    code: string;
    title: string;
}

export interface IEmploymentStatus {
    _id: string;
    code: string;
    title: string;
}

export interface ITextValue {
    value: string;
    text?: string;
}

export interface IMedicalHistoryOption {
    _id: string;
    title: string;
}

export interface ISurgicalHistoryOption {
    _id: string;
    title: string;
}

export interface IMusculoskeletalHistoryOption {
    _id: string;
    title: string;
}
