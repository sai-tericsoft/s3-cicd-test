import "./HelpModuleLayoutScreen.scss";
import {Outlet, useLocation} from "react-router-dom";
import SubMenuListComponent from "../../shared/components/sub-menu-list/SubMenuListComponent";
import {CommonService} from "../../shared/services";

interface HelpModuleLayoutComponentProps {

}

const HELP_MENU_ITEMS = [
    {
        title: "FAQs",
        path: CommonService._routeConfig.FrequentlyAskedQuestions()
    },
    {
        title: "Report an issue",
        path: CommonService._routeConfig.ReportAnIssue()
    }
]

const HelpModuleLayoutScreen = (props: HelpModuleLayoutComponentProps) => {
    const location: any = useLocation();
    const title = (location.state && location.state.title) ? location.state.title : HELP_MENU_ITEMS[0].title;

    return (
        <div className={'help-module-layout'}>
            <div className={"help-module-layout-left-bar"}>
                <div className={"help-module-layout-title"}>
                    {title}
                </div>
                <SubMenuListComponent menuItems={HELP_MENU_ITEMS}/>
            </div>
            <div className={"help-module-content-wrapper"}>
                <Outlet/>
            </div>
        </div>
    );

};

export default HelpModuleLayoutScreen;