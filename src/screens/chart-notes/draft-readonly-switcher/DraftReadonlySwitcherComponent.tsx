import "./DraftReadonlySwitcherComponent.scss";
import React from "react";

interface DraftReadonlySwitcherComponentProps {
    condition: boolean,
    draft: any,
    readonly: any
}


const DraftReadonlySwitcherComponent = (props: DraftReadonlySwitcherComponentProps) => {

    const {draft, readonly, condition} = props;

    return (
        <>
            {(condition) ? draft : readonly}
        </>
    )
};

export default DraftReadonlySwitcherComponent;
