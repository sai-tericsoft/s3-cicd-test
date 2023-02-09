import "./ChartNotesLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface ChartNotesLayoutComponentProps {

}

const ChartNotesLayoutComponent = (props: ChartNotesLayoutComponentProps) => {

    return (
        <Outlet/>
    );

};

export default ChartNotesLayoutComponent;
