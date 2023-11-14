import "./BillingStatsCardComponent.scss";
import {CommonService} from "../../../shared/services";

interface BillingStatsCardComponentProps {
    title: string;
    icon: any;
    amount: string;
}

const BillingStatsCardComponent = (props: BillingStatsCardComponentProps) => {
    const {title, icon, amount} = props;
    return (
        <div className={'billing-stats-card-component'}>
            <div className={'billing-stats-card-wrapper'}>
                <div className={'billing-stats-card-icon'}>{icon}</div>
                <div className={'billing-stats-card-title-amount-wrapper'}>
                    <div className={'billing-stats-card-amount'}>${+amount > 0 ? CommonService.convertToDecimals(amount) : '0.00'}</div>
                    <div className={'billing-stats-card-title'}>{title}</div>
                </div>
            </div>
        </div>
    );

};

export default BillingStatsCardComponent;