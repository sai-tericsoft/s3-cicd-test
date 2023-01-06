import "./ComingSoonScreen.scss";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setCurrentNavParams} from "../../store/actions/navigation.action";
import {useLocation} from "react-router-dom";

interface ComingSoonScreenProps {

}

const ComingSoonScreen = (props: ComingSoonScreenProps) => {

    const dispatch = useDispatch();

    const { state }  = useLocation();
    console.log(state);

    useEffect(() => {
        dispatch(setCurrentNavParams("Coming soon"));
    }, [dispatch]);

    return (
        <div className={'ComingSoonScreen'}>
            <div>ComingSoonScreen</div>
        </div>
    );

};

export default ComingSoonScreen;