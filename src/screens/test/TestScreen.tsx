import './TestScreen.scss';
import ServiceAddScreen from "../admin/service/service-add/ServiceAddScreen";
import ClientAllergiesFormComponent from "../clients/client-allergies-form/ClientAllergiesFormComponent";

interface TestScreenProps {

}

const TestScreen = (props: TestScreenProps) => {


    return (
        <div style={{margin: '20px'}}>
            <ServiceAddScreen/>
        </div>
    );
};

export default TestScreen;
