import "./BillingMainLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface BillingDetailsMainLayoutComponentProps {

}

const BillingMainLayoutComponent = (props: BillingDetailsMainLayoutComponentProps) => {

    return (
        <Outlet/>
    );

};

export default BillingMainLayoutComponent;
