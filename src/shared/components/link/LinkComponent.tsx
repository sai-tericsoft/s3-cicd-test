import "./LinkComponent.scss";
import {Link} from "react-router-dom";
import {PropsWithChildren} from "react";

interface LinkComponentProps {
    route: string;
}

const LinkComponent = (props: PropsWithChildren<LinkComponentProps>) => {

    const {route, children} = props;

    return (
        <Link className={'link-component'} to={route}>
            {children}
        </Link>
    );

};

export default LinkComponent;