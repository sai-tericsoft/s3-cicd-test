import "./FilePreviewThumbnailComponent.scss";
import ButtonComponent from "../button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {useCallback, useEffect, useState} from "react";
import AvatarComponent from "../avatar/AvatarComponent";
import {IAttachment} from "../../models/common.model";
import IconButtonComponent from "../icon-button/IconButtonComponent";
import {CommonService} from "../../services";
import ToolTipComponent from "../tool-tip/ToolTipComponent";

interface FilePreviewThumbnailComponentProps {
    variant?: "compact" | "detailed";
    file: File | IAttachment;
    removeButtonId?: string;
    onRemove?: (file: File | IAttachment) => void;
}

const FilePreviewThumbnailComponent = (props: FilePreviewThumbnailComponentProps) => {

    const {file, removeButtonId, onRemove} = props;
    const [filePreviewURL, setFilePreviewURL] = useState<string | null>("");
    const [fileName, setFileName] = useState<string>("");
    const variant = props.variant || "detailed";

    const getFileThumbnail = useCallback((type: string, file: File | IAttachment, cb: (thumbnailURL: string) => void) => {
        type = CommonService.getNormalizedFileType(type);
        switch (type) {
            case "image":
                if (file instanceof File) {
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                        cb(fileReader.result as string);
                    };
                    fileReader.readAsDataURL(file);
                } else {
                    cb(file.url);
                }
                break;
            // case "pdf":
            //     cb(ImageConfig.PDFIcon);
            //     break;
            // case "doc":
            //     cb(ImageConfig.WordDocIcon);
            //     break;
            // case "xls":
            //     cb(ImageConfig.ExcelIcon);
            //     break;
            default:
                cb(ImageConfig.UnknownFileTypeIcon);
                break;
        }
    }, []);

    useEffect(() => {
        if (file instanceof File) {
            const name = file.name;
            setFileName(name);
        } else {
            setFileName(file.name);
        }
        const type = file.type;
        getFileThumbnail(type, file, (thumbnailURL: string) => {
            setFilePreviewURL(thumbnailURL);
        });
    }, [getFileThumbnail, file]);

    const handleFileRemove = useCallback(() => {
        if (onRemove) {
            onRemove(file);
        }
    }, [onRemove, file]);

    return (
        <div className={'file-preview-thumbnail-component ' + variant}>
            <div className="file-data">
                <div className="file-preview-thumbnail">
                    {
                        filePreviewURL &&
                        <AvatarComponent url={filePreviewURL} title={fileName} type={"square"}></AvatarComponent>
                    }
                </div>
                <ToolTipComponent tooltip={fileName}>
                    <div className="file-name">
                        {fileName}
                    </div>
                </ToolTipComponent>
            </div>
            <div className="file-options">
                {
                    onRemove && <>
                        {
                            variant === "detailed" && <ButtonComponent
                                color={"error"}
                                variant={"outlined"}
                                size={"small"}
                                className={"file-remove"}
                                id={removeButtonId}
                                prefixIcon={<ImageConfig.CloseIcon/>}
                                onClick={handleFileRemove}
                            >
                                Remove
                            </ButtonComponent>
                        }
                        {
                            variant === "compact" && <IconButtonComponent
                                className={"file-remove"}
                                id={removeButtonId}
                                onClick={handleFileRemove}
                            >
                                <ImageConfig.CloseIcon/>
                            </IconButtonComponent>
                        }
                    </>
                }
            </div>
        </div>
    );

};

export default FilePreviewThumbnailComponent;
