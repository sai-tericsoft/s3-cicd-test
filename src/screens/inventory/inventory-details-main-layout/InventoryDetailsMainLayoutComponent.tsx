import "./InventoryDetailsMainLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface InventoryDetailsMainLayoutComponentProps {

}

const InventoryDetailsMainLayoutComponent = (props: InventoryDetailsMainLayoutComponentProps) => {

    return (
        <div className={'inventory-details-main-layout-component'}>
            <div className="inventory-details-details-main-layout-content-wrapper">
                <Outlet/>
            </div>
        </div>
    );

};

export default InventoryDetailsMainLayoutComponent;