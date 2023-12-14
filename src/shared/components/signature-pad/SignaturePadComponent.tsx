import "./SignaturePadComponent.scss";
import SignatureCanvas from 'react-signature-canvas';
import React, {useCallback, useRef, useState} from "react";
import LinkComponent from "../link/LinkComponent";

interface SignaturePadComponentProps {
    showPreview?: boolean;
    image?: any;
    onSign?: (signImage: string | null) => void;
    onClear?: () => void;
}

const SignaturePadComponent: React.FC<SignaturePadComponentProps> = ({showPreview, onSign, onClear}) => {
    const sigCanvasRef = useRef<SignatureCanvas | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signImage, setSignImage] = useState<string | null>(null);
    const [isSigned,setIsSigned] = useState<boolean>(false);

    const handleDrawEnd = useCallback(() => {
        if (sigCanvasRef.current) {
            const trimmedCanvas = sigCanvasRef.current.getTrimmedCanvas();
            const newSignImage = trimmedCanvas.toDataURL('image/png');
            setSignImage(newSignImage);
            setIsDrawing(false);
        }
    }, []);

    const handleSaveSign = useCallback(() => {
        if (onSign) {
            const imageToSave = signImage || (sigCanvasRef.current ? sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png') : null);
            onSign(imageToSave);
        }
        setIsSigned(true)
    }, [onSign,signImage]);

    const handleClearSign = useCallback(() => {
        if (sigCanvasRef.current) {
            sigCanvasRef.current.clear();
            setSignImage(null);
            setIsSigned(false)
        }
        if (onClear) {
            onClear();
        }
    }, [onClear]);

    return (
        <div className={'signature-pad-component'}>
            <div className={'signature-pad-container'}>
                <div className={'signature-pad'} style={{cursor: 'url(sign.svg), auto'}}>
                    <SignatureCanvas
                        ref={(ref) => (sigCanvasRef.current = ref)}
                        clearOnResize={false}
                        canvasProps={{className: 'signature-pad-canvas'}}
                        onBegin={() => setIsDrawing(true)}
                        onEnd={handleDrawEnd}
                    />
                    {(!isDrawing && !signImage) && (
                        <div id={'sign_pad'} className={'signature-pad-helper-text'}>
                            Please sign here
                        </div>
                    )}
                </div>
                <div className="signature-pad-options">
                    {signImage && (
                        <LinkComponent onClick={handleClearSign}>
                            <div className={'signature-pad-clear pdd-top-15'}>Clear Signature</div>
                        </LinkComponent>
                    )}
                    {(signImage  && !isSigned) && (
                        <LinkComponent onClick={handleSaveSign}>
                            <div className={'signature-pad-save pdd-top-15'}>Save Signature</div>
                        </LinkComponent>
                    )}
                </div>
            </div>
            {(signImage && showPreview) && (
                <div className={'signature-pad-image-preview'}>
                    <img src={signImage} alt={'sign-preview'} style={{height: '60px', width: '120px'}}/>
                </div>
            )}
        </div>
    );
};

export default SignaturePadComponent;


// ****************************** USAGE ****************************** //

//
// <SignaturePadComponent showPreview={true} onSign={(signImage) => {
//     console.log(signImage);
// }}/>

// ****************************** USAGE ****************************** //
