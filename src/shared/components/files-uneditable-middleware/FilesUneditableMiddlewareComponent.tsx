import "./FilesUneditableMiddlewareComponent.scss";
import {PropsWithChildren, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import moment from "moment";

interface FilesUneditableMiddlewareComponentProps {
    timeStamp: string;
}

const FilesUneditableMiddlewareComponent = (props: PropsWithChildren<FilesUneditableMiddlewareComponentProps>) => {

    const {children, timeStamp} = props;
    const [canShow, setCanShow] = useState<boolean>(false);
    const {
        currentUser
    } = useSelector((state: IRootReducerState) => state.account);

    useEffect(() => {
        console.log("timeStamp", timeStamp);
        if (timeStamp) {
            console.log('tim if');
            if (currentUser?.uneditable_after_days) {
                console.log('uneditable_after_days if');
                const bits = currentUser?.uneditable_after_days?.split("_");
                const num = bits[0];
                const type = bits[1];
                console.log({num, type});
                const mapping: any = {
                    m: 'minutes',
                    d: 'days'
                }
                if (moment().isSameOrBefore(moment(timeStamp).add(num, mapping[type]))) {
                    console.log('is before if');
                    setCanShow(true);
                } else {
                    console.log('is else');
                    setCanShow(false);
                }
            }
        } else {
            console.log('tim else');
            setCanShow(true);
        }
    }, [currentUser, timeStamp]);

    console.log(currentUser, timeStamp);

    return (
        <>
            {
                canShow && <div className={'files-uneditable-middleware-component'}>
                    {children}
                </div>
            }
        </>
    );

};

export default FilesUneditableMiddlewareComponent;
