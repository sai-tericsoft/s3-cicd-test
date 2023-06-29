import "./SignaturePadComponent.scss";
import SignatureCanvas from 'react-signature-canvas';
import React, {useCallback, useRef, useState} from "react";
import LinkComponent from "../link/LinkComponent";

interface SignaturePadComponentProps {
    showPreview?: boolean;
    image?: any;
    onSign?: (signImage: string | null) => void;
}

const SignaturePadComponent = (props: SignaturePadComponentProps) => {

    const {showPreview, onSign} = props;
    const sigCanvasRef = useRef<any>();
    const [isDrawing, setIsDrawing] = useState(false);
    const [signImage, setSignImage] = useState<any>(null);


    const handleDrawEnd = useCallback(() => {
        const signImage = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
        setSignImage(signImage);
        if (onSign) {
            onSign(signImage)
        }
        setIsDrawing(false);
    }, [onSign]);

    // useEffect(() => {
    //     if (image) {
    //         setSignImage(image);
    //         if (sigCanvasRef.current) {
    //             sigCanvasRef.current.fromDataURL(image);
    //         }
    //     }
    // }, [image]);


    const handleClearSign = useCallback(() => {
        if (sigCanvasRef.current) {
            sigCanvasRef.current.clear();
            setSignImage(null);
            if (onSign) {
                onSign(null)
            }
        }
    }, [onSign]);

    return (
        <div className={'signature-pad-component'}>
            <div className={'signature-pad-container'}>
                <div className={'signature-pad'} style={{cursor: 'url(sign.svg), auto'}}>
                    <SignatureCanvas
                        ref={sigCanvasRef}
                        clearOnResize={false}
                        canvasProps={{className: 'signature-pad-canvas'}}
                        onBegin={() => setIsDrawing(true)}
                        onEnd={() => handleDrawEnd()}
                    />
                    {
                        (!isDrawing && !signImage) && <div id={"sign_pad"} className={'signature-pad-helper-text'}>
                            Sign Here
                        </div>
                    }
                </div>
                <div className="signature-pad-options">
                    {signImage && <LinkComponent onClick={handleClearSign}>
                        <div className={'signature-pad-clear pdd-top-15'}>
                            Clear Signature
                        </div>
                    </LinkComponent>}
                </div>
            </div>
            {(signImage && showPreview) && <div className={'signature-pad-image-preview'}>
                <img src={signImage} alt={'sign-preview'} style={{height: '60px', width: '120px'}}/>
            </div>}
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
