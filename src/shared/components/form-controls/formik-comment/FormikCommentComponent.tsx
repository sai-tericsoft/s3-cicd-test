import {FieldProps} from "formik";
import {ImageConfig} from "../../../../constants";
import IconButtonComponent from "../../icon-button/IconButtonComponent";

interface FormikCommentComponentProps {
    formikField: FieldProps;
    onClick: () => void;
}

const FormikCommentComponent = (props: FormikCommentComponentProps) => {

    const {
        formikField,
        onClick,
    } = props;

    const {field} = formikField;
    const {value} = field;

    return (
        <div className={'comment-component'}>
            <IconButtonComponent
                color={value ? "primary" : "inherit"}
                onClick={onClick}>
                {
                    value ? <ImageConfig.ChatIcon/> : <ImageConfig.CommentAddIcon/>
                }
            </IconButtonComponent>
        </div>
    );

};

export default FormikCommentComponent;
