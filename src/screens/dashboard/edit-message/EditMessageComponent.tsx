import "./EditMessageComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {getAllMessageHistory} from "../../../store/actions/dashboard.action";
import {useDispatch} from "react-redux";
import {Misc} from "../../../constants";

interface EditMessageComponentProps {
    messageObject: any;
    onBack: () => void;
    closeMessageDrawer: () => void;
}

const EditMessageInitialValue: any = {
    message: ''
}

const EditMessageComponent = (props: EditMessageComponentProps) => {
    const dispatch = useDispatch();
    const {messageObject, onBack, closeMessageDrawer} = props;
    const [editMessageInitialValue, setEditMessageInitialValue] = useState<any>(_.cloneDeep(EditMessageInitialValue));

    useEffect(() => {
        setEditMessageInitialValue({
            message: messageObject?.message
        })
    }, [messageObject]);


    const handleMessageSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values}
        CommonService._dashboardService.editDashboardMessage(messageObject?._id, payload)
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast( "Message updated successfully!", "success");
                dispatch(getAllMessageHistory());
                onBack();
                closeMessageDrawer();
            }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error, true);
        })
    }, [messageObject, dispatch, onBack, closeMessageDrawer]);

    return (
        <div className={'edit-message-component'}>
            <FormControlLabelComponent label={'Edit Message'} className={'flex-0'} size={'lg'}/>
            <Formik initialValues={editMessageInitialValue}
                    onSubmit={handleMessageSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                {({values, isValid, touched, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [values, validateForm]);
                    return (
                        <Form className={'t-form'} noValidate={true}>
                            <div className={'ts-row ts-justify-content-center'}>
                                <div className={'ts-col-lg-12 message-container'}>
                                    <Field name={'message'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent formikField={field}
                                                                         label={''}
                                                                         fullWidth={true}
                                                                         placeholder={'Enter your message'}/>
                                            )
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div className={'t-form-actions'}>
                                <ButtonComponent id={"cancel_btn"} variant={'outlined'} onClick={onBack}>
                                    Cancel
                                </ButtonComponent>
                                &nbsp;
                                <ButtonComponent className={'submit-cta'} id={"save_btn"} variant={'contained'}
                                                 color={'primary'}
                                                 disabled={!isValid} type={'submit'}>
                                    Save
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default EditMessageComponent;