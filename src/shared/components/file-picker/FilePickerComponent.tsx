import "./FilePickerComponent.scss";
import {useDropzone} from "react-dropzone";
import {useCallback, useState} from "react";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../services";
import ButtonComponent from "../button/ButtonComponent";

interface FilePickerComponentProps {
    showDropZone?: boolean;
    id?: string;
    uploadText?: string;
    acceptedFilesText?: string;
    onFilesDrop?: (acceptedFiles: any[], rejectedFiles: any[]) => void;
    acceptedFileTypes?: IFileType[];
    multiple?: boolean;
    maxFileCount?: number;
    maxFileSize?: number;
    disabled?: boolean;
}

const TOO_MANY_FILES_ERROR_CODE = "too-many-files";
const INVALID_FILE_TYPE_ERROR_CODE = "file-invalid-type";
const LARGE_FILE_TYPE_ERROR_CODE = "file-too-large";

type IFileType = "png" | "jpg" | "jpeg" | "pdf";

const fileTypeMappings: any = {
    "png": 'image/png',
    "jpg": 'image/jpg',
    "jpeg": 'image/jpeg',
    "pdf": "application/pdf"
}

const FilePickerComponent = (props: FilePickerComponentProps) => {

    const getConvertedFileTypes = useCallback((acceptedFileTypes: IFileType[] | undefined) => {
        const mappings: any = {};
        acceptedFileTypes?.forEach((fileType) => {
            const mapping = fileTypeMappings[fileType];
            mappings[mapping] = [];
        });
        return mappings;
    }, []);

    const [acceptedFileTypes] = useState(getConvertedFileTypes(props.acceptedFileTypes));

    const {acceptedFilesText, id, disabled, maxFileCount, onFilesDrop, multiple} = props;
    const uploadText = props.uploadText || "Drag and drop or browse to choose a file";
    const showDropZone = props.showDropZone !== undefined ? props.showDropZone : true;
    const maxFileSize = props.maxFileSize !== undefined ? props.maxFileSize : 100;

    const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
        // console.log("acceptedFiles", acceptedFiles);
        console.log("rejectedFiles", rejectedFiles);
        acceptedFiles.forEach((file: any) => {
            const reader = new FileReader();
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result;
                console.log(binaryStr);
            }
            reader.readAsArrayBuffer(file)
        });

        if (rejectedFiles) {
            let maxCountErrorShown = false;
            let invalidFileTypeErrorShown = false;
            rejectedFiles.forEach((item: any) => {
                const itemErrorCodes = item.errors && item.errors.map((error: any) => error.code);
                if (itemErrorCodes?.includes(TOO_MANY_FILES_ERROR_CODE)) {
                    if (!maxCountErrorShown) {
                        CommonService._alert.showToast('Maximum allowed files: ' + maxFileCount, 'error');
                        maxCountErrorShown = true;
                    }
                }
                if (itemErrorCodes?.includes(INVALID_FILE_TYPE_ERROR_CODE)) {
                    if (!invalidFileTypeErrorShown) {
                        CommonService._alert.showToast('Please select valid file type', 'error');
                        invalidFileTypeErrorShown = true;
                    }
                }
                if (itemErrorCodes?.includes(LARGE_FILE_TYPE_ERROR_CODE)) {
                    if (!invalidFileTypeErrorShown) {
                        CommonService._alert.showToast('Please select file within specified size', 'error');
                        invalidFileTypeErrorShown = true;
                    }
                }
            })
        }
        if (onFilesDrop) {
            onFilesDrop(acceptedFiles, rejectedFiles);
        }
    }, [maxFileCount, onFilesDrop]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject
    } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        multiple: multiple,
        maxFiles: maxFileCount,
        disabled: disabled,
        maxSize: maxFileSize * 1024 * 1024
    });

    return (
        <>
            {
                showDropZone &&
                <div className={`file-picker-wrapper ${isDragActive ? "drag-active" : ""}`} {...getRootProps()} >
                    <input id={id} {...getInputProps()} />
                    <div className="file-dnd-icon">
                        <ImageConfig.UploadIcon/>
                    </div>
                    <div className="file-dnd-title">
                        {uploadText}
                    </div>
                    {acceptedFilesText && <div className="accepted-files-type-text">
                        {acceptedFilesText}
                    </div>}
                    {
                        isDragReject && <div className="">

                        </div>
                    }
                </div>
            }
            {
                !showDropZone && <div {...getRootProps()}>
                    <input id={id} {...getInputProps()} />
                    <ButtonComponent variant={"outlined"}
                                     prefixIcon={<ImageConfig.AddIcon/>}
                    >
                        Add Document
                    </ButtonComponent>
                </div>
            }
        </>
    );

};

export default FilePickerComponent;

// ****************************** USAGE ****************************** //

// <FilePickerComponent
//     acceptedFileTypes={{
//         'image/*': []
//     }}
//     maxFileCount={2}
//     acceptedFilesText={"PNG, JPG and JPEG files are allowed"}/>

// ****************************** USAGE ****************************** //
