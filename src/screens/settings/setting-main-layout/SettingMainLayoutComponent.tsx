import "./SettingMainLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface SettingMainLayoutComponentProps {

}

const SettingMainLayoutComponent = (props: SettingMainLayoutComponentProps) => {

    return (
        <div className={'setting-main-layout-component'}>
            <Outlet/>
        </div>
    );

};

export default SettingMainLayoutComponent;