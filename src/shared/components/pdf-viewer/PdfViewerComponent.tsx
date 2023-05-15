import "./PdfViewerComponent.scss";
import IconButtonComponent from "../icon-button/IconButtonComponent";
import {ImageConfig} from "../../../constants";
import {Document, Page, pdfjs} from "react-pdf";
import React, {useCallback} from "react";
import LoaderComponent from "../loader/LoaderComponent";
import StatusCardComponent from "../status-card/StatusCardComponent";
import ButtonComponent from "../button/ButtonComponent";

interface PdfViewerComponentProps {
    title?: string;
    file: any;
    onClose: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;

const PdfViewerComponent = (props: PdfViewerComponentProps) => {

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const {file, title, onClose} = props;
    const [totalPages, setTotalPages] = React.useState(0);
    const [pageScale, setPageScale] = React.useState(1);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isLoadedError, setIsLoadedError] = React.useState(false);

    const onDocumentLoadSuccess = useCallback((e: any) => {
        setIsLoading(false);
        setIsLoadedError(false);
        setTotalPages(e.numPages);
    }, []);

    const onDocumentLoadError = useCallback((e: any) => {
        setIsLoading(false);
        setIsLoadedError(true);
        setTotalPages(e.numPages);
    }, []);

    const handleZoomIn = useCallback(() => {
        if (pageScale < MAX_SCALE) {
            setPageScale(pageScale + 0.2);
        }
    }, [pageScale]);

    const handleZoomOut = useCallback(() => {
        if (pageScale > MIN_SCALE) {
            setPageScale(pageScale - 0.2);
        }
    }, [pageScale]);

    const handleNext = useCallback(() => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    }, [pageNumber, totalPages]);

    const handlePrevious = useCallback(() => {
        if (pageNumber > 0) {
            setPageNumber(pageNumber - 1);
        }
    }, [pageNumber]);

    return (
        <div className={'pdf-container'}>
            <div className={'pdf-header'}>
                <div className={'pdf-header-title'}>
                    {title}
                </div>
                <IconButtonComponent className={"pdf-close-btn"} onClick={onClose}>
                    <ImageConfig.CloseIcon/>
                </IconButtonComponent>
            </div>
            <div className="pdf-content-container">
                {
                    isLoading && <LoaderComponent/>
                }
                {
                    isLoadedError && <StatusCardComponent title={"Error loading pdf"}/>
                }
                <Document renderMode={'canvas'} file={file}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={onDocumentLoadError}
                >
                    <Page pageNumber={pageNumber} scale={pageScale}/>
                </Document>
            </div>
            <div className="pdf-footer">
                <div className="button-container">
                    <ButtonComponent size={"small"} onClick={handleZoomIn} disabled={pageScale >= 3}>
                        Zoom +
                    </ButtonComponent>&nbsp;&nbsp;
                    <ButtonComponent size={"small"} onClick={handleZoomOut} disabled={pageScale <= 0.3}>
                        Zoom -
                    </ButtonComponent>
                </div>
                <div className="page-text">
                    Page {pageNumber} of {totalPages}
                </div>
                <div className="button-container">
                    <ButtonComponent size={"small"} onClick={handlePrevious} disabled={pageNumber === 1}>
                        ‹ Previous
                    </ButtonComponent>&nbsp;&nbsp;
                    <ButtonComponent size={"small"} onClick={handleNext} disabled={pageNumber === totalPages}>
                        Next ›
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );

};

export default PdfViewerComponent;
