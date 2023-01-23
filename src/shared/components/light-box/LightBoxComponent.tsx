import "./LightBoxComponent.scss";
import {IAttachment} from "../../models/common.model";
import 'react-image-lightbox/style.css';
import React, {useCallback, useEffect, useRef, useState} from "react";
import Lightbox from 'react-image-lightbox';
import {CommonService} from "../../services";
import {Subscription} from "rxjs";
import PdfViewerComponent from "../pdf-viewer/PdfViewerComponent";
import ModalComponent from "../modal/ModalComponent";
import StatusCardComponent from "../status-card/StatusCardComponent";
import VideoPlayerComponent from "../video-player/VideoPlayerComponent";

interface LightBoxComponentProps {
}

const CURRENTLY_SUPPORTED_FILE_FORMATS: any = ['image', 'pdf', 'video'];

const LightBoxComponent = (props: LightBoxComponentProps) => {

    const [attachments, setAttachments] = useState<IAttachment[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeAttachment, setActiveAttachment] = useState<IAttachment>(attachments[0]);
    const [activeAttachmentType, setActiveAttachmentType] = useState<string | undefined>(undefined);
    const lightBoxSubjectRef = useRef<Subscription>();

    const closeLightBox = useCallback(() => {
        setIsOpen(false);
    }, []);

    const openLightBox = useCallback(() => {
        setIsOpen(true);
    }, []);

    useEffect(() => {
        if (attachments) {
            setActiveAttachment(attachments[0]);
            openLightBox();
        }
    }, [attachments, openLightBox]);

    useEffect(() => {
        if (activeAttachment) {
            setActiveAttachmentType(CommonService.getNormalizedFileType(activeAttachment.type));
        }
    }, [activeAttachment]);

    useEffect(() => {
        lightBoxSubjectRef.current = CommonService._communications.LightBoxSubject.subscribe((attachments: IAttachment[]) => {
            setAttachments(attachments);
        });
        return () => {
            lightBoxSubjectRef.current?.unsubscribe();
            closeLightBox();
        }
    }, [closeLightBox]);

    return (
        <>
            {(isOpen && activeAttachment) && <>
                <div className={'light-box-component'}>
                    {
                        CURRENTLY_SUPPORTED_FILE_FORMATS.includes(activeAttachmentType) && <>
                            {
                                activeAttachmentType === "image" && <Lightbox
                                    mainSrc={activeAttachment?.url}
                                    onCloseRequest={() => setIsOpen(false)}
                                />
                            }
                            {
                                activeAttachmentType === "pdf" &&
                                <PdfViewerComponent file={activeAttachment.url} title={activeAttachment?.name}
                                                    onClose={closeLightBox}/>
                            }
                            {
                                activeAttachmentType === "video" &&
                                <VideoPlayerComponent url={activeAttachment.url} onClose={closeLightBox}/>
                            }
                        </>
                    }
                    {
                        !CURRENTLY_SUPPORTED_FILE_FORMATS.includes(activeAttachmentType) && <>  <ModalComponent
                            size={"sm"}
                            isOpen={true}
                            onClose={closeLightBox}
                            showClose={true}>
                            <StatusCardComponent title={`File format not supported to preview right now, Coming soon`}>
                            </StatusCardComponent>
                        </ModalComponent>
                        </>
                    }
                </div>
            </>}
        </>
    );

};

export default LightBoxComponent;
