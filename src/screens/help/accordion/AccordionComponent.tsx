import "./AccordionComponent.scss";
import {useCallback, useState} from "react";
import {ImageConfig} from "../../../constants";

interface AccordionComponentProps {
question: any;
answer: any;

}

const AccordionComponent = (props: AccordionComponentProps) => {
  const { question, answer } = props;
  const [text, setText] = useState<boolean>(false);

  const handleText =useCallback(()=>{
    setText(!text)
  },[text]);

    return (
        <div className={'accordion-component'}>
            <div className={'accordion-question'} >
                <div className={'accordion-question-title'} onClick={handleText}>
                    <div>
                        {question}
                    </div>
                    <div>{text ? <ImageConfig.CircularShowLess/> :
                        <ImageConfig.CircularShowMore/>}</div>
                </div>
                {text && <div className={'accordion-question-answer'}>
                    {answer}
                </div>}

            </div>
        </div>
    );

};

export default AccordionComponent;