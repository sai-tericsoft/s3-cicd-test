import "./IcdCodingToolComponent.scss";
import React from "react";
import * as ECT from "@whoicd/icd11ect";
import "@whoicd/icd11ect/style.css";

interface ParentComponentProps {
    onCodeSelect: (selectedCode: any) => void;
}

class IcdCodingToolComponent extends React.Component<ParentComponentProps> {
    iNo = 1;

    constructor(props: ParentComponentProps) {
        super(props);

        // configure the ECT
        const settings = {
            apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
            autoBind: false,
        };
        const callbacks = {
            selectedEntityFunction: (selectedEntity: any) => {
                // Call the parent component's callback function with the selected code
                this.props.onCodeSelect(selectedEntity);

                // Clear the search results
                // ECT.Handler.clear(this.iNo);
            },
        };
        ECT.Handler.configure(settings, callbacks);
    }

    componentDidMount() {
        // Manual binding only after the component has been mounted
        ECT.Handler.bind(this.iNo);
    }

    render() {
        return (
            <div className={'icd-coding-tool-component'}>
                <div className={'icd-coding-tool-title'}>ICD-11 Coding Tool v1.6</div>
                <div className={'icd-coding-tool-content-window'}>
                    <div className={'icd-coding-search-component'}>
                        <input
                            type="text"
                            className="ctw-input"
                            autoComplete="off"
                            data-ctw-ino={this.iNo}
                        />
                        <div className="ctw-window" data-ctw-ino={this.iNo}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default IcdCodingToolComponent;
