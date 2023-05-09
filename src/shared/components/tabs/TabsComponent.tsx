import './TabsComponent.scss'
import React, {useCallback} from "react";
import {Tab, Tabs, Typography} from "@mui/material";

interface TabsWrapperComponentProps {
    className?: string;
}

const TabsWrapperComponent = (props: React.PropsWithChildren<TabsWrapperComponentProps>) => {

    const {className, children} = props;
    return (
        <div className={`t-tabs-wrapper ${className}`}>
            {children}
        </div>
    );

};

interface TabsComponentProps {
    value?: any;
    orientation?: "vertical" | "horizontal";
    color?: 'secondary' | 'primary';
    centered?: boolean;
    variant?: 'standard' | 'scrollable' | 'fullWidth';
    className?: string;
    scrollButtons?: 'auto' | true | false;
    allowScrollButtonsMobile?: boolean;
    onUpdate?: (event: React.SyntheticEvent, value: string)=> void;
}

const TabsComponent = (props: React.PropsWithChildren<TabsComponentProps>) => {

    const {onUpdate, value, className, centered, allowScrollButtonsMobile, children, ...rest} = props;
    let {color, orientation, scrollButtons, variant} = props;
    if (!color) color = "primary";
    if (!variant) variant = "standard";
    if (!scrollButtons) scrollButtons = false;
    if (!orientation) orientation = "horizontal";

    const handleChange = useCallback((event: React.SyntheticEvent, value: string) => {
        if (onUpdate) {
            onUpdate(event, value);
        }
    }, [onUpdate]);

    return (
        <div className={`t-tabs ${className} ${color}`}>
            <Tabs
                value={value}
                orientation={orientation}
                textColor={color}
                indicatorColor={color}
                className={`t-tabs-header ${className}`}
                centered={true}
                onChange={handleChange}
                variant={variant}
                scrollButtons={scrollButtons}
                allowScrollButtonsMobile={allowScrollButtonsMobile}
                {...rest}
            >
                {children}
            </Tabs>
        </div>
    );
};

const BasicTabsComponent = (props: React.PropsWithChildren<TabsComponentProps>) => {

    const {onUpdate, value, className, allowScrollButtonsMobile, children} = props;
    let {color, orientation, scrollButtons} = props;
    if (!color) color = "primary";
    if (!scrollButtons) scrollButtons = false;
    if (!orientation) orientation = "horizontal";

    const handleChange = useCallback((event: React.SyntheticEvent, value: string) => {
        if (onUpdate) {
            onUpdate(event, value);
        }
    }, [onUpdate]);

    return (
        <div className={`t-basic-tabs ${className} ${color}`}>
            <Tabs
                value={value}
                orientation={orientation}
                textColor={color}
                indicatorColor={color}
                className={`t-tabs-header ${className}`}
                onChange={handleChange}
                scrollButtons={scrollButtons}
                allowScrollButtonsMobile={allowScrollButtonsMobile}
            >
                {children}
            </Tabs>
        </div>
    );
};

interface TabComponentProps {
    label: string;
    className?: string;
    wrapped?: boolean;
    disabled?: boolean;
    icon?: string | React.ReactElement;
    iconPosition?: "top" | "start" | "end" | "bottom";
    value: string | number;
    onClick?: Function;
}

const TabComponent = (props: TabComponentProps) => {

    const {label, icon, onClick, wrapped, disabled, className, ...rest} = props;
    let {iconPosition} = props;
    if (!iconPosition) iconPosition = "start";

    const handleClick = useCallback(() => {
        if (onClick) {
            onClick(props.value);
        }
    }, [onClick, props]);

    return (
        <Tab label={label}
             disabled={disabled}
             icon={icon || ''}
             onClick={handleClick}
             iconPosition={iconPosition}
             className={`t-tab ${className}`}
             id={`tab-${props.value}`}
             aria-controls={`tab-${props.value}`}
             wrapped={wrapped}
             {...rest}/>
    );

}

interface TabContentComponentProps {
    value: string | number;
    selectedTab: string | number;
    className?: string;
}

const TabContentComponent = (props: React.PropsWithChildren<TabContentComponentProps>) => {

    const {value, selectedTab, className, children, ...rest} = props;

    return (
        <div
            role="tabpanel"
            className={`t-tab-panel ${className}`}
            hidden={value !== selectedTab}
            id={`tabpanel-${value}`}
            aria-labelledby={`simple-tab-${value}`}
            {...rest}
        >
            {value === selectedTab && (
                <Typography component="div">{children}</Typography>
            )}
        </div>
    );
}

export default TabsWrapperComponent;

export {
    TabComponent,
    TabsComponent,
    BasicTabsComponent,
    TabContentComponent
};


// ****************************** USAGE *************************
//
// const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");
//
// return (
//     <div style={{width: '50%', margin: "auto"}}>
//         <TabsWrapperComponent>
//             <TabsComponent
//                 value={activeTab}
//                 allowScrollButtonsMobile={false}
//                 onUpdate={(e: any, v: any) => {
//                     setActiveTab(v);
//                 }}
//             >
//                  <TabComponent label="Tab1" value={"tab1"} onClick={(e: any)=>{
//                         console.log(e);}}/>
//                     <TabComponent label="Tab2" value={"tab2"}/>
//             </TabsComponent>
//             <TabContentComponent selectedTab={activeTab} value={"tab1"}>
//                 Tab1 Content
//             </TabContentComponent>
//             <TabContentComponent selectedTab={activeTab} value={"tab2"}>
//                 Tab2 Content
//             </TabContentComponent>
//         </TabsWrapperComponent>
//     </div>
// )
//
// ******************************** USAGE *************************
