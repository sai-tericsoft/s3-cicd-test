import "./FilePreviewThumbnailComponent.scss";
import ButtonComponent from "../button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {useCallback, useEffect, useState} from "react";
import AvatarComponent from "../avatar/AvatarComponent";
import {IAttachment} from "../../models/common.model";

interface FilePreviewThumbnailComponentProps {
    file: File | IAttachment;
    removable?: boolean;
    removeButtonId?: string;
    onRemove?: (file: File | IAttachment) => void;
}

const FilePreviewThumbnailComponent = (props: FilePreviewThumbnailComponentProps) => {


    const {file, removable, removeButtonId, onRemove} = props;
    const [filePreviewURL, setFilePreviewURL] = useState<string | null>("");
    const [fileName, setFileName] = useState<string>("");

    const getFileThumbnail = useCallback((type: string, file: File, cb: (thumbnailURL: string) => void) => {
        if (type.includes('image')) {
            type = "image";
        } else if (type.includes('pdf')) {
            type = "pdf";
        } else if (type.includes('word')) {
            type = "word";
        } else if (type.includes('spreadsheet')) {
            type = "xls";
        } else {
            type = "application";
        }
        switch (type) {
            case "image":
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    cb(fileReader.result as string);
                };
                fileReader.readAsDataURL(file);
                break;
            case "pdf":
                cb(ImageConfig.PDFIcon);
                break;
            case "doc":
                cb(ImageConfig.WordDocIcon);
                break;
            case "xls":
                cb(ImageConfig.ExcelIcon);
                break;
            default:
                cb(ImageConfig.UnknownFileTypeIcon);
                break;
        }
    }, []);

    useEffect(() => {
        if (file instanceof File) {
            const name = file.name;
            setFileName(name);
            const type = file.type;
            getFileThumbnail(type, file, (thumbnailURL: string) => {
                setFilePreviewURL(thumbnailURL);
            });
        } else {
            setFileName(file.name);
            setFilePreviewURL(file.url);
        }
    }, [getFileThumbnail, file]);

    const handleFileRemove = useCallback(() => {
        if (onRemove) {
            onRemove(file);
        }
    }, [onRemove, file]);

    return (
        <div className={'file-preview-thumbnail-component'}>
            <div className="file-data">
                <div className="file-preview-thumbnail">
                    {
                        filePreviewURL &&
                        <AvatarComponent url={filePreviewURL} title={fileName} type={"square"}></AvatarComponent>
                    }
                </div>
                <div className="file-name">
                    {fileName}
                </div>
            </div>
            <div className="file-options">
                {
                    removable && <ButtonComponent color={"error"}
                                                  variant={"outlined"}
                                                  className={"file-remove"}
                                                  size={"small"}
                                                  id={removeButtonId}
                                                  prefixIcon={<ImageConfig.CloseIcon/>}
                                                  onClick={handleFileRemove}
                    >
                        Remove Image
                    </ButtonComponent>
                }
            </div>
        </div>
    );

};

export default FilePreviewThumbnailComponent;