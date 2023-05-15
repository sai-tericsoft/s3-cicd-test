import "./pageLoaderComponent.scss";

import React from 'react';

interface PageLoaderComponentProps {

}

const PageLoaderComponent = (props: PageLoaderComponentProps) => {
    return (
        <div className="page-loading">
            <div>Loading...</div>
        </div>
    )
};

export default PageLoaderComponent;