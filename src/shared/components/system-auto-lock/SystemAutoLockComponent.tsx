import "./SystemAutoLockComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useEffect} from "react";
import {setSystemLocked} from "../../../store/actions/account.action";
import ModalComponent from "../modal/ModalComponent";
import LoginScreen from "../../../screens/auth/login/LoginScreen";
import moment from "moment";

interface SystemAutoLockComponentProps {

}

const SystemAutoLockComponent = (props: SystemAutoLockComponentProps) => {

    const {
        account
    } = useSelector((state: IRootReducerState) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        const interval = setInterval(() => {
            if (account) {
                console.log(account);
                if (moment().unix() === account?.lastActivityTime ? account?.lastActivityTime + 10 : 0) {
                    dispatch(setSystemLocked(true));
                    clearInterval(interval);
                }
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [account]);

    return (
        <div className={'system-auto-lock-component'}>
            <ModalComponent isOpen={(account.isSystemLocked && !!account.token)} fullWidth={false} size={"sm"}>
                <LoginScreen/>
            </ModalComponent>
        </div>
    );

};

export default SystemAutoLockComponent;
