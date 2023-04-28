import "./FaqComponent.scss";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getFAQList} from "../../../store/actions/static-data.action";
import CardComponent from "../../../shared/components/card/CardComponent";
import {ImageConfig} from "../../../constants";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

interface FaqComponentProps {

}

const FaqComponent = (props: FaqComponentProps) => {

    const dispatch = useDispatch();
    const [toggle, setToggle] = useState<any>(null);
    const {faqList} = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        dispatch(getFAQList());
    }, [dispatch]);

    const handleToggle = useCallback((id: any) => {
        if (toggle === id) {
            setToggle(null);
            return false;
        }
        setToggle(id);
    }, [toggle]);

    return (
        <div className={'faq-component'}>
            <div className={'faq-question-wrapper'}>
                <CardComponent>
                    <div className={'faq-block-wrapper'}>
                    {faqList.map((question: any, index) => {
                        return (
                            <>
                                <div className={'faq-question'} key={index}>
                                    <div className={'faq-question-title'} onClick={() => handleToggle(question._id)}>
                                        <div>
                                            {question.question}
                                        </div>
                                        <div>{(question._id === toggle) ? <ImageConfig.CircularShowLess/> :
                                            <ImageConfig.CircularShowMore/>}</div>
                                    </div>
                                    {(question._id === toggle) && <div className={'faq-question-answer'}>
                                        {question.answer}
                                    </div>}

                                </div>
                                <HorizontalLineComponent/>


                            </>
                        )
                    })}
                    </div>

                    <div className={'contact-info-wrapper'}>
                        <div className={'contact-number-wrapper'}>
                            <div className={'contact-text'}>Do you still have questions?</div>
                            <div className={'contact-number-icon-wrapper'}>
                                <div className={'mrg-top-15 mrg-right-10 ts-align-items-center'}><ImageConfig.CallIcon/>
                                </div>
                                <div className={"contact-number-wrapper"}>(545)-654-5654</div>
                            </div>
                        </div>
                        <div className={'help-text'}>
                            Please feel free to give us a call at the facility. We are here to help and look forward to
                            assisting you.
                        </div>
                    </div>
                </CardComponent>
            </div>


        </div>
    );


};

export default FaqComponent;