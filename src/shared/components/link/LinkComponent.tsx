import "./LinkComponent.scss";
import {Link} from "react-router-dom";

interface LinkComponentProps {
    route: string;
}

const LinkComponent = (props: React.PropsWithChildren<LinkComponentProps>) => {

    const {route, children} = props;

    return (
        <Link className={'link-component'} to={route}>
            {children}
        </Link>
    );

};

export default LinkComponent;