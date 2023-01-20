export interface IDryNeedlingAddForm {
    attachment: any;
    comments: any;
    document_date: any;
}

export interface IDryNeedlingEditForm {
    comments: any;
    document_date: any;
}

export interface IConcussionFileAddForm {
    attachment: any;
    comments: string;
    document_date: any;
    concussion_type_id: string;
}

export interface IConcussionFileEditForm {
    comments: string;
    document_date: any;
}

export interface IMedicalRecordDocumentAddForm {
    document: any;
    comments: string;
    document_date: any;
    document_id: any;
}

export interface IMedicalRecordDocumentEditForm {
    document: any;
    document_date: any;
    document_id: string;
}
