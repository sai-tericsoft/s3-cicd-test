import "./ServiceCategoryCardComponent.scss";
import {IServiceCategory} from "../../models/service-category.model";
import {NavLink} from "react-router-dom";
import {CommonService} from "../../services";
import ToolTipComponent from "../tool-tip/ToolTipComponent";

interface ServiceCategoryCardComponentProps {
    serviceCategory: IServiceCategory
}

const ServiceCategoryCardComponent = (props: ServiceCategoryCardComponentProps) => {

    const {serviceCategory} = props;

    return (
        <div
            className={`service-category-card ${serviceCategory.is_active ? "active" : "inactive"}`}>
            <div className="service-category-poster"
                 style={{backgroundImage: "url('" + serviceCategory?.image_url + "')"}}
            />
            <div className="service-category-details">
                <ToolTipComponent tooltip={serviceCategory?.name || "-"}>
                    <div className="service-category-name" id={`sc_${serviceCategory?.name}`}>
                        {serviceCategory?.name || "-"}
                    </div>
                </ToolTipComponent>
                <div className="service-category-extra-details">
                    <div className="service-category-service-count" id={`sc_${serviceCategory?.services_count}`}>
                        {serviceCategory?.services_count || 0} Services
                    </div>
                    <div className="service-category-separator"/>
                    <div className={`service-category-status `} id={`sc_${serviceCategory?.is_active}`}>
                        {serviceCategory.is_active ? "Active" : "Inactive"}
                    </div>
                </div>
            </div>
            <NavLink to={CommonService._routeConfig.ComingSoonRoute()}>
                <div className="service-category-view-details" id={`sc_${serviceCategory?.name}`}>
                    View Details
                </div>
            </NavLink>
        </div>
    );

};

export default ServiceCategoryCardComponent;