import {useLocation} from "react-router-dom";
import {useEffect} from "react";

interface ScrollComponentProps {

}

const ScrollComponent = (props: ScrollComponentProps) => {

    // Extracts pathname property(key) from an object
    const {pathname} = useLocation();
    // Automatically scrolls to top whenever pathname changes
    useEffect(() => {
        console.log('asdq')
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [pathname]);
    return null;
};

export default ScrollComponent;
