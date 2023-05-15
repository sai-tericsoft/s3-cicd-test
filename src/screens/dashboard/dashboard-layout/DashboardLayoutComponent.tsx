import "./DashboardLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface DashboardLayoutComponentProps {

}

const DashboardLayoutComponent = (props: DashboardLayoutComponentProps) => {

    return (
        <div className={'dashboard-layout-component'}>
           <Outlet/>
        </div>
    );

};

export default DashboardLayoutComponent;