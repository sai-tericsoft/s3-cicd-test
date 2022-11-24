import "./FilePickerComponent.scss";
import {useDropzone} from "react-dropzone";
import {useCallback} from "react";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../services";

interface FilePickerComponentProps {
    id?: string;
    uploadText?: string;
    acceptedFilesText?: string;
    onFilesDrop?: (acceptedFiles: any[], rejectedFiles: any[]) => void;
    acceptedFileTypes?: any;
    multiple?: boolean;
    maxFileCount?: number;
    disabled?: boolean;
}

const TOO_MANY_FILES_ERROR_CODE = "too-many-files";
const INVALID_FILE_TYPE_ERROR_CODE = "file-invalid-type";

const FilePickerComponent = (props: FilePickerComponentProps) => {

    const {acceptedFilesText, id, disabled, maxFileCount, onFilesDrop, acceptedFileTypes, multiple} = props;
    const uploadText = props.uploadText || "Drag and drop or browse to choose a file";

    const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
        // console.log("acceptedFiles", acceptedFiles);
        // console.log("rejectedFiles", rejectedFiles);
        acceptedFiles.forEach((file: any) => {
            const reader = new FileReader();
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result;
                // console.log(binaryStr);
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
    } = useDropzone({onDrop, accept: acceptedFileTypes, multiple: multiple, maxFiles: maxFileCount, disabled: disabled});

    return (
        <div id={id} className={`file-picker-wrapper ${isDragActive ? "drag-active" : ""}`} {...getRootProps()} >
            <input {...getInputProps()} />
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
    );

};

export default FilePickerComponent;