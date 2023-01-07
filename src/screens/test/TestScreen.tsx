import './TestScreen.scss';
import React  from 'react';
import ICDCodeListComponent from "../chart-notes/ICD-code-list/ICDCodeListComponent";

const TestScreen: React.FC = () => {

        return (
            <>
            {/*<ServiceAddScreen/>*/}
                <ICDCodeListComponent/>
        </>

    );
};

export default TestScreen;