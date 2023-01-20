import "./AttachmentComponent.scss";
import {IAttachment} from "../models/common.model";
import ButtonComponent from "../components/button/ButtonComponent";
import {ImageConfig} from "../../constants";
import FilePreviewThumbnailComponent from "../components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import {useCallback} from "react";
import {CommonService} from "../services";

interface AttachmentComponentProps {
    attachment: IAttachment;
    onDelete?: (attachment: IAttachment) => void;
    isDeleting?: boolean;
}

const AttachmentComponent = (props: AttachmentComponentProps) => {

    const {onDelete, isDeleting, attachment} = props;

    const handleDelete = useCallback(() => {
        onDelete && onDelete(attachment);
    }, [attachment, onDelete]);

    const handleView = useCallback(() => {
        CommonService._communications.LightBoxSubject.next([attachment]);
    }, [attachment]);

    const handlePrint = useCallback(() => {
        CommonService.printAttachment(attachment);
    }, [attachment]);

    return (
        <div className={'attachment-component'}>
            <div className={'attachment-thumbnail'}>
                <FilePreviewThumbnailComponent file={attachment}/>
            </div>
            <div className={'attachment-actions'}>
                <ButtonComponent prefixIcon={<ImageConfig.EyeIcon/>}
                                 variant={"outlined"}
                                 onClick={handleView}
                                 disabled={isDeleting}>
                    View
                </ButtonComponent>
                <ButtonComponent color={'error'}
                                 prefixIcon={<ImageConfig.DeleteIcon/>}
                                 variant={"outlined"}
                                 onClick={handleDelete}
                                 isLoading={isDeleting}
                                 disabled={isDeleting}>
                    Delete
                </ButtonComponent>
                <ButtonComponent prefixIcon={<ImageConfig.PrintIcon/>}
                                 onClick={handlePrint}
                                 disabled={isDeleting || !['image', 'pdf'].includes(CommonService.getNormalizedFileType(attachment?.type))}>
                    Print
                </ButtonComponent>
            </div>
        </div>
    );

};

export default AttachmentComponent;
