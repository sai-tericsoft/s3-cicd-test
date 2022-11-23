import "./FilePreviewThumbnailComponent.scss";
import ButtonComponent from "../button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {useCallback, useEffect, useState} from "react";
import AvatarComponent from "../avatar/AvatarComponent";

interface FilePreviewThumbnailComponentProps {
    file: File;
    removable?: boolean;
    removeButtonId?: string;
    onRemove?: (file: File) => void;
}

const FilePreviewThumbnailComponent = (props: FilePreviewThumbnailComponentProps) => {

    const {file, removable, removeButtonId, onRemove} = props;
    const [filePreviewURL, setFilePreviewURL] = useState<string | null>("");
    const [fileName, setFileName] = useState<string>("");

    useEffect(() => {
        console.log(file);
        const name = file.name;
        setFileName(name);
        const type = file.type;
        getFileThumbnail(type, file, (thumbnailURL: string) => {
            setFilePreviewURL(thumbnailURL);
        });
    }, [file]);

    const getFileThumbnail = useCallback((type: string, file: File, cb: (thumbnailURL: string) => void) => {
        if (type.includes('image')) {
            type = "image";
        } else if (type.includes('pdf')) {
            type = "pdf";
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
                cb("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT6khLUE3QpL3AWurCiUYM8MRP_l-fe96D-3KvTtpMnw&s");
                break;
            default:
                cb("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqheWikyrG6Wt9fO4Ht-z9zSJd45DBRjgJ_A&usqp=CAU");
                break;
        }
    }, []);

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
                        filePreviewURL && <AvatarComponent url={filePreviewURL} title={fileName} type={"square"}></AvatarComponent>
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