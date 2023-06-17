import "./ClientsMainLayoutComponent.scss";
import {Outlet} from "react-router-dom";

interface ClientsMainLayoutComponentProps {

}

const ClientsMainLayoutComponent = (props: ClientsMainLayoutComponentProps) => {

    return (
        <div className={'clients-main-layout-component'}>
            <Outlet/>
        </div>
    );

};

export default ClientsMainLayoutComponent;