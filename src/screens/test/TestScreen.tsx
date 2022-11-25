import './TestScreen.scss';
import ServiceCategoryAddComponent from "../admin/service-categories/service-category-add/ServiceCategoryAddComponent";
import ServiceCategoriesListScreen
    from "../admin/service-categories/service-categories-list/ServiceCategoriesListScreen";
import React from "react";
import DashboardScreen from "../dashboard/DashboardScreen";
import ServiceAddComponent from "../admin/service/service-add/ServiceAddComponent";

interface TestScreenProps {

}


const TestScreen = (props: TestScreenProps) => {

    return (
        <div style={{margin: '20px'}}>
          <ServiceAddComponent/>   </div>
    );
};

export default TestScreen;
