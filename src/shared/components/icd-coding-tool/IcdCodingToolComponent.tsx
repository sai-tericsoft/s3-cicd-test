import "./IcdCodingToolComponent.scss";
import {useEffect, useState} from "react";
import * as ECT from "@whoicd/icd11ect";
import "@whoicd/icd11ect/style.css";

interface IcdCodingToolComponentProps {
    onSelection:Function;
}

const IcdCodingToolComponent = (props: IcdCodingToolComponentProps) => {
    const {onSelection} = props;
    const [iNo] = useState(1); // instance number

    useEffect(() => {
        // configure ECT on mount
        const settings = {
            apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
            autoBind: false
        };

        const callbacks = {
            selectedEntityFunction: (selectedEntity: any) => {
                onSelection(selectedEntity);
                console.log(selectedEntity);
                ECT.Handler.clear(iNo);
            }
        }

        ECT.Handler.configure(settings, callbacks);
        ECT.Handler.bind(iNo); // bind after mount

    }, [iNo,onSelection]); // empty deps array to run only on mount

    return (
        <div className={'icd-coding-tool-component'}>
            <div className={'icd-coding-tool-title'}>ICD-11 Coding Tool v1.6</div>
            <div className={'icd-coding-tool-content-window'}>
                <div className={'icd-coding-search-component'}>
                    <input
                        type="text"
                        className="ctw-input"
                        autoComplete="off"
                        placeholder={'Type for starting the search'}
                        data-ctw-ino={iNo}
                    />
                    {/*<span className="clear" onClick={ECT.Handler.clear('1')}>❌ </span>*/}
                </div>
                <div className="ctw-window" data-ctw-ino={iNo}></div>
            </div>
        </div>
    );

};

export default IcdCodingToolComponent;
