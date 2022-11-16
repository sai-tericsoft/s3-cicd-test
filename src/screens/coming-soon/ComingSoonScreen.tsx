import "./ComingSoonScreen.scss";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setCurrentNavParams} from "../../store/actions/navigation.action";

interface ComingSoonScreenProps {

}

const ComingSoonScreen = (props: ComingSoonScreenProps) => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setCurrentNavParams("Coming soon"));
    }, []);

    return (
        <div className={'ComingSoonScreen'}>
            <div>ComingSoonScreen</div>
        </div>
    );

};

export default ComingSoonScreen;