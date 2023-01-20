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
    attachment: any;
    comments: string;
    document_date: any;
    document_type_id: any;
}

export interface IMedicalRecordDocumentEditForm {
    comments: string;
    document_date: any;
    document_type_id: string;
}
