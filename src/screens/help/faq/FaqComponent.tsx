import "./FaqComponent.scss";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getFAQList} from "../../../store/actions/static-data.action";
import CardComponent from "../../../shared/components/card/CardComponent";
import {ImageConfig} from "../../../constants";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import FaqAccordionComponent from "../faq-accordion/Faq-AccordionComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";

interface FaqComponentProps {

}

const FaqComponent = (props: FaqComponentProps) => {

    const dispatch = useDispatch();
    const {faqList, isFaqListLoading, isFaqListLoaded} = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        dispatch(setCurrentNavParams('Help'))
        dispatch(getFAQList());
    }, [dispatch]);


    return (
        <div className={'faq-component'}>
            {isFaqListLoading && <LoaderComponent/>}
            {
                isFaqListLoaded && <div className={'ts-row'}>
                    {faqList.length ? <div className={'ts-col-12 faq-question-wrapper'}>
                        <CardComponent>
                            <div className={'faq-block-wrapper'}>
                                <div className={'faq-block-content'}>
                                    {faqList.map((faq: any, index) => {
                                        return (
                                            <>
                                                <FaqAccordionComponent title={faq.question}>
                                                    {faq.answer}
                                                </FaqAccordionComponent>
                                                <HorizontalLineComponent className={'divider'}/>


                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={'contact-info-wrapper'}>
                                <div className={'contact-number-wrapper'}>
                                    <div className={'contact-text'}>Do you still have questions?</div>
                                    <div className={'contact-number-icon-wrapper'}>
                                        <div className={'mrg-top-15 mrg-right-10 ts-align-items-center'}>
                                            <ImageConfig.CallIcon/>
                                        </div>
                                        <div className={"contact-number-wrapper"}>(545) 654-5654</div>
                                    </div>
                                </div>
                                <div className={'help-text'}>
                                    Please feel free to give us a call at the facility. We are here to help and look forward
                                    to
                                    assisting you.
                                </div>
                            </div>
                        </CardComponent>
                    </div> : <div>
                        <StatusCardComponent title={'No Data Found'}/>
                    </div>}


                </div>
            }


        </div>
    );


};

export default FaqComponent;