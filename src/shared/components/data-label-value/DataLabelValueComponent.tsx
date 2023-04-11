import "./DataLabelValueComponent.scss";
import React from "react";

interface DataLabelValueComponentProps {
    label: string | React.ReactNode;
    direction?: "row" | "column";
    className?:any;
    id?:string;
}

const DataLabelValueComponent = (props: React.PropsWithChildren<DataLabelValueComponentProps>) => {

    const { label, children,className, id } = props;
    const direction = props.direction || "column";

    return (
        <div className={`data-label-value ${direction} ${className}`}>
            <div className={"data-label"}>
                {label}
            </div>
            <div className={"data-value"} id={id}>
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
