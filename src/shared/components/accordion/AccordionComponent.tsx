import "./AccordionComponent.scss";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, {useCallback} from "react";


interface AccordionComponentProps {
    className?: string;
    disabled?: boolean;
    isExpand?: boolean;
    onChange?: () => void;
    disableGutters?: boolean;
    title: string;
}


const AccordionComponent = (props: React.PropsWithChildren<AccordionComponentProps>) => {

    const {className, title, children, onChange} = props;
    let {isExpand, disabled, disableGutters} = props;

    disabled = disabled || false;
    isExpand = isExpand || false;
    disableGutters = disableGutters || false;

    const handleChange = useCallback(() => {
        if (onChange) {
            onChange();
        }
    }, [onChange]);

    return (
        <div className={`accordion-component ${className}`}>
            <Accordion disabled={disabled}
                       expanded={isExpand}
                       onChange={handleChange}
                       disableGutters={disableGutters}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    {title}
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