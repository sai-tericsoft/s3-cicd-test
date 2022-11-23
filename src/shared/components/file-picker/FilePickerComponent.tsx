import "./FilePickerComponent.scss";
import {useDropzone} from "react-dropzone";
import {useCallback} from "react";
import {ImageConfig} from "../../../constants";

interface FilePickerComponentProps {
    uploadText?: string;
    acceptedFilesText?: string;
    onFilesDrop?: (acceptedFiles: any[], rejectedFiles: any[]) => void;
    acceptedFileTypes?: any;
    multiple?: boolean;
    maxFiles?: number;
    disabled?: boolean;
}

const FilePickerComponent = (props: FilePickerComponentProps) => {

    const {acceptedFilesText, disabled, maxFiles, onFilesDrop, acceptedFileTypes, multiple} = props;
    const uploadText = props.uploadText || "Drag and drop or browse to choose a file";

    const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
        console.log("acceptedFiles", acceptedFiles);
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
        if (onFilesDrop) {
            onFilesDrop(acceptedFiles, rejectedFiles);
        }
    }, [onFilesDrop]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject
    } = useDropzone({onDrop, accept: acceptedFileTypes, multiple: multiple, maxFiles: maxFiles, disabled: disabled});

    return (
        <div className={`file-picker-wrapper ${isDragActive ? "drag-active" : ""}`} {...getRootProps()} >
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