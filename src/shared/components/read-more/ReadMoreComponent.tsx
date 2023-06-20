import "./ReadMoreComponent.scss";
import {PropsWithChildren, useState} from "react";

interface ReadMoreComponentProps {

}

const ReadMoreComponent = (props: PropsWithChildren<ReadMoreComponentProps>) => {
    const {children}: any = props;

    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    return (
        <div className={'read-more-component'}>
            {isReadMore ? children.slice(0, 200) : children}
            {children.length > 150 && <span onClick={toggleReadMore} className="read-or-hide">
         {isReadMore ? "...read more" : " show less"}
      </span>}
        </div>
    );

};

export default ReadMoreComponent;