
export interface ITableWrapperRefreshSubject {
    moduleName: string;
}

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

export interface IReferralType {
    _id: string;
    title: string;
    code: string;
}

export interface ISocialMediaPlatform {
    _id: string;
    title: string;
    code: string;
}

export interface ICommunicationModeType {
    _id: string;
    title: string;
    code: string;
}

export interface IBodyPart {
    _id: string;
    name: string;
    sides: string[];
}

export interface IInjuryType {
    _id: string;
    title: string;
}

export interface ICaseStatus {
    _id : string,
    title:string,
    code: string
}

export interface IProgressReportStat {
    _id : string,
    name:string,
    results: string[]
}


export interface I8MinuteRuleChartItem {
    _id : string,
    time:string,
    units: number
}

export interface IConcussionFileType {
    _id: string;
    type: string;
}

export interface IMedicalRecordDocumentType {
    _id: string;
    type: string;
}

export interface ISystemAutoLockDurationOption {
    _id: string;
    title: string;
    code: number;
}

export interface IFilesUneditableAfterOption {
    _id: string;
    title: string;
    code: number;
}

export type BillingType = 'invoice' | 'receipt';
