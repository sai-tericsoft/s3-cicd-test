import "./AccordionComponent.scss";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, {useCallback, useEffect} from "react";
import {CommonService} from "../../services";
import ChipComponent from "../chip/ChipComponent";


interface AccordionComponentProps {
    className?: string;
    disabled?: boolean;
    isExpand?: boolean;
    onChange?: (isExpanded: boolean) => void;
    disableGutters?: boolean;
    title: string;
    forActivityLog?: boolean;
    disableExpanding?: boolean;
    subTitle?: string;
    name?: string;
    actions?: any;
    statusLabel?: string;
}


const AccordionComponent = (props: React.PropsWithChildren<AccordionComponentProps>) => {

    const {className,statusLabel,actions, title,name, children,subTitle, onChange,disableExpanding,forActivityLog} = props;
    let {isExpand, disabled, disableGutters} = props;
    const [isExpanded, setIsExpanded] = React.useState<any>(props.isExpand);

    disabled = disabled || false;
    isExpand = isExpand || false;
    disableGutters = disableGutters || false;

    const handleChange = useCallback((isExpand: any) => {
        setIsExpanded(isExpand);
        if (onChange) {
            onChange(isExpand);
        }
    }, [onChange]);

    useEffect(() => {
        setIsExpanded(isExpand);
    }, [isExpand]);


    return (
        <div className={`accordion-component ${className}`}>
            <Accordion disabled={disabled}
                       expanded={isExpanded}
                       onChange={(e, isExpanded) => {
                           if (disableExpanding) {
                               e.stopPropagation()
                           } else {
                               handleChange(isExpanded)
                           }
                       }}
                       disableGutters={disableGutters}>
                <AccordionSummary
                    expandIcon={!disableExpanding ? <ExpandMoreIcon/> : <span className={'MuiAccordionSummary-expandIconWrapper'}></span>}
                    className="accordion-summary"
                >
                    <div className={"accordian-title-status-wrapper"}>
                        <div className="accordian-tile">
                            {title && (!forActivityLog ? CommonService.Capitalize(title): CommonService.capitalizeFirstLetterOfEachWord(title))}
                        </div>
                        <div className="accordian-sub-tile">
                            {subTitle}
                        </div>
                        {
                            name && <div className="accordian-user-name">
                                {CommonService.capitalizeFirstLetterOfEachWord( name)}
                            </div>
                        }
                        {statusLabel && <div className="accordian-status">
                            <ChipComponent
                                label={statusLabel}/>
                        </div>}
                    </div>
                    <div className="accordian-actions"
                         onClick={(e) => e.stopPropagation()}>
                        {actions}
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        (React.Children.count(children)) > 0 && <div>
                            {children}
                        </div>
                    }
                </AccordionDetails>
            </Accordion>
        </div>
    );

};

export default AccordionComponent;
