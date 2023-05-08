import './TestScreen.scss';
import React, {useCallback, useState} from "react";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import MentionsComponent from "../../shared/components/mentions/MentionsComponent";
import AccordionComponent from "../../shared/components/accordion/AccordionComponent";
import InputComponent from "../../shared/components/form-controls/input/InputComponent";
import TabsWrapperComponent, {
    BasicTabsComponent,
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../shared/components/tabs/TabsComponent";
import MedicalInterventionListComponent
    from "../chart-notes/medical-intervention-list/MedicalInterventionListComponent";
import MedicalRecordAttachmentListComponent
    from "../chart-notes/medical-record-attachment-list/MedicalRecordAttachmentListComponent";
import {useSearchParams} from "react-router-dom";

const users = [
    {
        id: "client_name",
        display: "client_name",
    },
    {
        id: "client_emailid",
        display: "client_emailid",
    },
    {
        id: "provider_name",
        display: "provider_name",
    },
    {
        id: "appointment_date",
        display: "appointment_date",
    },
    {
        id: "appointment_time",
        display: "appointment_time",
    },
    {
        id: "service_category",
        display: "service_category",
    },
    {
        id: "service",
        display: "service",
    },
    {
        id: "appointment_id",
        display: "appointment_id",
    },
];


const TestScreen = () => {
    const [value, setValue] = useState("");
    // const [isExpanded, setIsExpanded] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState<any>("medicalRecord");


    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("activeTab", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);
    return (
        <div className="test-screen">

            {/*<MentionsComponent*/}
            {/*    data={users}*/}
            {/*    value={value}*/}
            {/*    onChange={(value) => setValue(value)}*/}
            {/*    placeholder={"Enter text here"}*/}
            {/*/>*/}

            {/*<ButtonComponent*/}
            {/*    variant={"contained"}*/}
            {/*    onClick={() => console.log(value)}*/}
            {/*    color={"primary"}>Submit</ButtonComponent>*/}
            {/*/!*<AccordionComponent title={"Test Accordion"}*!/*/}
            {/*/!*                    isExpand={isExpanded}*!/*/}
            {/*/!*                    className={'color-red'}*!/*/}
            {/*/!*                    onChange={() => setIsExpanded(!isExpanded)}*!/*/}
            {/*/!*>*!/*/}
            {/*/!*    <InputComponent name={'Accordion'} value={'aa'}/>*!/*/}
            {/*/!*</AccordionComponent>*!/*/}
            <TabsWrapperComponent className={'basic-tabs-wrapper'}>
                <BasicTabsComponent value={currentTab} onUpdate={handleTabChange} variant={"fullWidth"}
                               allowScrollButtonsMobile={false}>

                    <TabComponent label={'Medical Records'} value={"medicalRecord"}/>
                    <TabComponent label={'Attachments'} value={"attachmentList"}/>

                </BasicTabsComponent>
                <TabContentComponent value={"medicalRecord"} selectedTab={currentTab}>
                    <MedicalInterventionListComponent />
                </TabContentComponent>
                <TabContentComponent value={"attachmentList"} selectedTab={currentTab}>
                    <MedicalRecordAttachmentListComponent />
                </TabContentComponent>
            </TabsWrapperComponent>

        </div>
    );
};
export default TestScreen;
