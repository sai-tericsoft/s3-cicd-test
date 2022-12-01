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
