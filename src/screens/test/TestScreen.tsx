import './TestScreen.scss';
import ServiceProviderListComponent from "../admin/service/service-provider-list/ServiceProviderListComponent";

interface TestScreenProps {

}


const TestScreen = (props: TestScreenProps) => {

    return (
        <div style={{margin: '20px'}}>
            <ServiceProviderListComponent serviceId={'11'}/>
        </div>
    );
};

export default TestScreen;
