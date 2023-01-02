import "./ChartNotesDetailsMainLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface ChartNotesDetailsMainLayoutComponentProps {

}

// const CHART_NOTES_MENU_ITEMS = [
//     {
//         title: "Medical Records",
//         path: "" // TODO: Add path once we have other chart notes types
//     }
// ]

const ChartNotesDetailsMainLayoutComponent = (props: ChartNotesDetailsMainLayoutComponentProps) => {

    // const location: any = useLocation();
    // const title = (location.state && location.state.title) ? location.state.title : CHART_NOTES_MENU_ITEMS[0].title;

    return (
        <div className="chart-notes-details-main-layout">
            {/*<div className="chart-notes-details-main-layout-left-bar">*/}
            {/*    <div className="chart-notes-details-main-layout-title">*/}
            {/*        {title}*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="chart-notes-details-main-layout-content-wrapper">
                <Outlet/>
            </div>
        </div>
    );


};

export default ChartNotesDetailsMainLayoutComponent;
