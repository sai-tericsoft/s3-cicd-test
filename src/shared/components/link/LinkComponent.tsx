import "./LinkComponent.scss";
import {Link} from "react-router-dom";
import {PropsWithChildren} from "react";
import {CommonService} from "../../services";

interface LinkComponentProps {
    disabled?: boolean;
    id?: string;
    route?: string;
    onClick?: () => void;
    behaviour?: 'spa' | 'redirect';
    className?: any;
}

const LinkComponent = (props: PropsWithChildren<LinkComponentProps>) => {

    const {id, route, disabled, onClick, children, className} = props;
    const behaviour = props.behaviour || 'spa';

    return (
        <>
            {
                (route && route?.length > 0) && <>
                    {
                        behaviour === 'spa' &&
                        <Link onClick={onClick} className={`link-component ${className} ${disabled ? 'disabled' : ''}`} id={id}
                              to={route}>
                            {children}
                        </Link>
                    }
                    {
                        behaviour === 'redirect' &&
                        <a onClick={onClick} className={`link-component ${className} ${disabled ? 'disabled' : ''}`}
                           id={id}
                           href={route}
                           target={'_blank'} rel={'noreferrer'}>
                            {children}
                        </a>
                    }
                </>
            }
            {
                (!route || route?.length === 0) &&
                <div className={`link-component ${className} ${disabled ? 'disabled' : ''}`} id={id} onClick={
                    (e) => {
                        if (!onClick) {
                            CommonService._alert.showToast('Coming Soon', 'info');
                        } else {
                            onClick();
                        }
                    }
                }>
                    {children}
                </div>
            }
        </>
    );

};

export default LinkComponent;
