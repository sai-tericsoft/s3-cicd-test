import "./LinkComponent.scss";
import {Link} from "react-router-dom";
import {PropsWithChildren} from "react";
import {CommonService} from "../../services";

interface LinkComponentProps {
    id?: string;
    route?: string;
    onClick?: () => void;
    behaviour?: 'spa' | 'redirect';
}

const LinkComponent = (props: PropsWithChildren<LinkComponentProps>) => {

    const {id, route, onClick, children} = props;
    const behaviour = props.behaviour || 'spa';

    return (
        <>
            {
                (route && route?.length > 0) && <>
                    {
                        behaviour === 'spa' && <Link onClick={onClick} className={'link-component'} id={id} to={route}>
                            {children}
                        </Link>
                    }
                    {
                        behaviour === 'redirect' && <a onClick={onClick} className={'link-component'}
                                                       id={id}
                                                       href={route}
                                                       target={'_blank'} rel={'noreferrer'}>
                            {children}
                        </a>
                    }
                </>
            }
            {
                (!route || route?.length === 0) && <div className={'link-component'} id={id} onClick={
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
