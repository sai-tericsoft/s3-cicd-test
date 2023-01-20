import "./LinkComponent.scss";
import {Link} from "react-router-dom";
import {PropsWithChildren} from "react";
import {CommonService} from "../../services";

interface LinkComponentProps {
    id?: string;
    route: string;
    onClick?: () => void;
}

const LinkComponent = (props: PropsWithChildren<LinkComponentProps>) => {

    const {id, route, onClick, children} = props;

    return (
        <>
            {
                (route?.length > 0) && <Link onClick={onClick} className={'link-component'} id={id} to={route}>
                    {children}
                </Link>
            }
            {
                (!route && route?.length === 0) && <div className={'link-component'} id={id} onClick={
                    (e) => {
                        onClick && onClick();
                        CommonService._alert.showToast('Coming Soon', 'info');
                    }
                }>
                    {children}
                </div>
            }
        </>
    );

};

export default LinkComponent;
