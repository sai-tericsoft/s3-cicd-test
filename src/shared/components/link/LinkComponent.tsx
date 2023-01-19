import "./LinkComponent.scss";
import {Link} from "react-router-dom";
import {PropsWithChildren} from "react";
import {CommonService} from "../../services";

interface LinkComponentProps {
    id?: string;
    route: string;
}

const LinkComponent = (props: PropsWithChildren<LinkComponentProps>) => {

    const {id, route, children} = props;

    return (
        <>
            {
                (route?.length > 0) && <Link className={'link-component'} id={id} to={route}>
                    {children}
                </Link>
            }
            {
                (!route && route?.length === 0) && <div className={'link-component'} id={id} onClick={
                    (e) => {
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
