import "./AttachmentComponent.scss";
import {IAttachment} from "../models/common.model";
import ButtonComponent from "../components/button/ButtonComponent";
import {ImageConfig} from "../../constants";
import FilePreviewThumbnailComponent from "../components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import {useCallback} from "react";

interface AttachmentComponentProps {
    attachment: IAttachment;
    onRemove?: (attachment: IAttachment) => void;
}

const AttachmentComponent = (props: AttachmentComponentProps) => {

    const {onRemove, attachment} = props;

    const handleRemove = useCallback(() => {
        onRemove && onRemove(attachment);
    }, [attachment, onRemove]);

    const handleView = useCallback(() => {

    }, []);

    const handlePrint = useCallback(() => {

    }, []);

    return (
        <div className={'attachment-component'}>
            <div className={'attachment-thumbnail'}>
                <FilePreviewThumbnailComponent file={attachment}/>
            </div>
            <div className={'attachment-actions'}>
                <ButtonComponent prefixIcon={<ImageConfig.EyeIcon/>}
                                 variant={"outlined"}
                                 onClick={handleView}>
                    View
                </ButtonComponent>
                <ButtonComponent color={'error'}
                                 prefixIcon={<ImageConfig.DeleteIcon/>}
                                 variant={"outlined"}
                                 onClick={handleRemove}>
                    Delete
                </ButtonComponent>
                <ButtonComponent prefixIcon={<ImageConfig.PrintIcon/>}
                                 onClick={handlePrint}>
                    Print
                </ButtonComponent>
            </div>
        </div>
    );

};

export default AttachmentComponent;
