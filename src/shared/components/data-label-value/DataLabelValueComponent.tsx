import "./DataLabelValueComponent.scss";
import React from "react";

interface DataLabelValueComponentProps {
    label: string;
}

const DataLabelValueComponent = (props: React.PropsWithChildren<DataLabelValueComponentProps>) => {

    const { label, children } = props;

    return (
        <div className={"data-label-value"}>
            <div className={"data-label"}>
                {label}
            </div>
            <div className={"data-value"}>
                {children}
            </div>
        </div>
    );

};

export default DataLabelValueComponent;

// ****************************** USAGE ****************************** //
// <DataLabelValueComponent label={"Facility Name"}>
//     Kinergy sports medicine and Performance
// </DataLabelValueComponent>

// const address = {
//     fNo: "101",
//     city: "Las Vegas",
//     state: "NV 89123 USA"
// }
//
// <DataLabelValueComponent label={"Address"}>
//     { address.fNo }, {address.city}, <br/> {address.state}
// </DataLabelValueComponent>

// ****************************** USAGE ****************************** //