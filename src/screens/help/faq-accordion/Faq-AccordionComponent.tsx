import "./Faq-AccordionComponent.scss";
import React, {useCallback, useState} from "react";
import {ImageConfig} from "../../../constants";

interface AccordionComponentProps {
title: any;
}

const FaqAccordionComponent = (props: React.PropsWithChildren<AccordionComponentProps>) => {
  const {title,children } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleText =useCallback(()=>{
    setIsExpanded(!isExpanded)
  },[isExpanded]);

    return (
        <div className={'accordion-component'}>
            <div className={'title-children-wrapper'} >
                <div className={'title'} onClick={handleText}>
                    <div>
                        {title}
                    </div>
                    <div>{isExpanded ? <ImageConfig.CircularShowLess/> :
                        <ImageConfig.CircularShowMore/>}</div>
                </div>
                {
                    isExpanded && (React.Children.count(children)) > 0 &&  <div>
                        {children}
                    </div>
                }

            </div>
        </div>
    );

};

export default FaqAccordionComponent;