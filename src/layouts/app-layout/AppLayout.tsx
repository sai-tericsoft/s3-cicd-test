import React from "react";
import {Outlet} from "react-router-dom";
import BrandingComponent from "../../shared/components/layout/branding/BrandingComponent";
import SideMenuComponent from "../../shared/components/layout/side-menu/SideMenuComponent";
import HeaderComponent from "../../shared/components/layout/header/HeaderComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../store/reducers";
import {ImageConfig} from "../../constants";
import {setSideMenuView} from "../../store/actions/navigation.action";

export interface AppLayoutProps {
}

const AppLayout = (props: AppLayoutProps) => {
    const {sideMenuView} = useSelector(
        (state: IRootReducerState) => state.navigation
    );
    const dispatch = useDispatch();
    // const [scrollPosition, setScrollPosition] = useState(0);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         setScrollPosition(window.pageYOffset);
    //     };
    //
    //     window.addEventListener("scroll", handleScroll);
    //
    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);
    //
    // useEffect(() => {
    //     const handleBeforeUnload = () => {
    //         localStorage.setItem("scrollPosition", scrollPosition.toString());
    //     };
    //
    //     window.addEventListener("beforeunload", handleBeforeUnload);
    //
    //     return () => {
    //         window.removeEventListener("beforeunload", handleBeforeUnload);
    //     };
    // }, [scrollPosition]);
    //
    // useEffect(() => {
    //     const storedScrollPosition = localStorage.getItem("scrollPosition");
    //     if (storedScrollPosition) {
    //         setScrollPosition(parseInt(storedScrollPosition));
    //     }
    // }, []);

    return (
        <div className="app-layout">
            <div className={`side-bar-holder ${sideMenuView}-view`}>
                <div className="logo-holder">
                    <BrandingComponent/>
                </div>
                <div className="side-menu-holder">
                    <SideMenuComponent/>
                </div>
                <div
                    className="side-menu-toggle-icon"
                    onClick={() => {
                        dispatch(
                            setSideMenuView(
                                sideMenuView === "default" ? "compact" : "default"
                            )
                        );
                    }}
                >
                    {sideMenuView === "default" && <ImageConfig.LeftArrow/>}
                    {sideMenuView === "compact" && <ImageConfig.RightArrow/>}
                </div>
            </div>
            <div className="header-and-page-container">
                <div className="header-holder">
                    <HeaderComponent/>
                </div>
                <div className="page-content-holder" id={"page-content-holder"}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
