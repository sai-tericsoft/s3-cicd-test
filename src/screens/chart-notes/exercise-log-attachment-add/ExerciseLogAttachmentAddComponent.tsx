import "./ExerciseLogAttachmentAddComponent.scss";
import {useCallback} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import {Misc} from "../../../constants";

interface ExerciseLogAttachmentAddComponentProps {

}

const ExerciseLogAttachmentAddComponent = (props: ExerciseLogAttachmentAddComponentProps) => {

    const {interventionId} = useParams();
    // const [searchParams, setSearchParams] = useSearchParams();
    // console.log(searchParams.get('__interventionId'))

    const handleFileSubmit = useCallback((values:any) => {
        console.log(values.target.files);
        const formData = CommonService.getFormDataFromJSON({attachment:values.target.files[0]});
        CommonService._chartNotes.AddExerciseLogAttachment(interventionId, formData)
            .then((response) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
            }).catch((error) => {
            CommonService._alert.showToast(error[Misc.API_RESPONSE_MESSAGE_KEY], "error");
        })
    }, [interventionId])

    return (
        <div className={'exercise-log-attachment-add-component'}>
            <input type={"file"} onChange={handleFileSubmit}/>
        </div>
    );

};

export default ExerciseLogAttachmentAddComponent;