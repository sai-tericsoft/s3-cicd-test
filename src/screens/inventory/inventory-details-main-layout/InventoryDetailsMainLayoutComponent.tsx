import "./InventoryDetailsMainLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface InventoryDetailsMainLayoutComponentProps {

}

const InventoryDetailsMainLayoutComponent = (props: InventoryDetailsMainLayoutComponentProps) => {

    return (
        <Outlet/>
    );

};

export default InventoryDetailsMainLayoutComponent;