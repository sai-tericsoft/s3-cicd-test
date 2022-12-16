import "./LinkComponent.scss";
import {Link} from "react-router-dom";
import {PropsWithChildren} from "react";

interface LinkComponentProps {
    id?: string;
    route: string;
}

const LinkComponent = (props: PropsWithChildren<LinkComponentProps>) => {

    const {id, route, children} = props;

    return (
        <Link className={'link-component'} id={id} to={route}>
            {children}
        </Link>
    );

};

export default LinkComponent;