import "./IcdCodingToolComponent.scss";
import {useEffect, useState} from "react";
import * as ECT from "@whoicd/icd11ect";
import "@whoicd/icd11ect/style.css";
interface IcdCodingToolComponentProps {

}

const IcdCodingToolComponent = (props: IcdCodingToolComponentProps) => {
    const [iNo] = useState(1); // instance number

    useEffect(() => {
        // configure ECT on mount
        const settings = {
            apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
            autoBind: false
        };

        const callbacks = {
            selectedEntityFunction: (selectedEntity:any) => {
                alert(`ICD-11 code selected: ${selectedEntity.code}`);
                ECT.Handler.clear(iNo);
            }
        }

        ECT.Handler.configure(settings, callbacks);
        ECT.Handler.bind(iNo); // bind after mount

    }, []); // empty deps array to run only on mount

    return (
        <div>
            <h1>[React] Embedded Coding Tool v1.6</h1>

            Type for starting search:

            <input
                type="text"
                className="ctw-input"
                autoComplete="off"
                data-ctw-ino={iNo}
            />

            <div className="ctw-window" data-ctw-ino={iNo}></div>
        </div>
    );

};

export default IcdCodingToolComponent;
