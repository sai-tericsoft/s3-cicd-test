import "./BillingDetailsMainLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface BillingDetailsMainLayoutComponentProps {

}

const BillingDetailsMainLayoutComponent = (props: BillingDetailsMainLayoutComponentProps) => {

    return (
        <Outlet/>
    );

};

export default BillingDetailsMainLayoutComponent;