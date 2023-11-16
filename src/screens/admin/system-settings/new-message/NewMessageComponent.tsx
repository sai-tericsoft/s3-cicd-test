import "./NewMessageComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import AccordionComponent from "../../../../shared/components/accordion/AccordionComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {ISystemSettingsConfig} from "../../../../shared/models/account.model";
import {Misc} from "../../../../constants";
import FormikSelectComponent from "../../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";

interface NewMessageComponentProps {

}

const newMessageInitialValue: any = {
    message: '',
    valid_days: ''
}

const NewMessageComponent = (props: NewMessageComponentProps) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [newMessageFormInitialValue] = useState<any>(_.cloneDeep(newMessageInitialValue));
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const {validDaysList} = useSelector((state: IRootReducerState) => state.staticData);

    const handleChange = useCallback(() => {
        setIsExpanded(!isExpanded)
    }, [isExpanded]);

    const onSubmit = useCallback((values: any, {setErrors, resetForm}: FormikHelpers<any>) => {
        setIsSaving(true);
        CommonService._systemSettings.NewMessageAPICall(values)
            .then((response: IAPIResponseType<ISystemSettingsConfig>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsSaving(false);
                setIsExpanded(false);
                resetForm();
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsSaving(false);
            });
    }, []);

    const handleClose = useCallback((resetForm: any) => {
        setIsExpanded(false);
        resetForm();
    }, []);

    return (
        <div className={'new-message-component'}>
            <div>
                <AccordionComponent title={'New Message'} isExpand={isExpanded} onChange={handleChange}>
                    <div className={'enter-message-text'}>Please enter the new message to be shown.</div>
                    <div>
                        <Formik initialValues={newMessageFormInitialValue}
                                validateOnChange={false}
                                validateOnBlur={true}
                                enableReinitialize={true}
                                validateOnMount={true}
                                onSubmit={onSubmit}>
                            {({values, validateForm, resetForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form className={'t-form'} noValidate={true}>
                                        <Field name={'message'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={''}
                                                        placeholder={'New Message'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <div className={'ts-row days-select-wrapper'}>
                                            <div className={'ts-col-lg-8'}>
                                                {/*<FormControlLabelComponent label={'Number of days'}/>*/}
                                                <div className={'no-of-days'}>Number of days</div>
                                                <div className={'select-text'}>Select the number of days for which the
                                                    message will be displayed.
                                                </div>
                                            </div>
                                            <div className={'ts-col-lg-4'}>
                                                <Field name={'valid_days'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikSelectComponent
                                                                options={validDaysList}
                                                                displayWith={item => item?.title}
                                                                valueExtractor={item => item?.code}
                                                                label={'Select'}
                                                                formikField={field}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                onClick={() => handleClose(resetForm)}
                                                variant={'outlined'}
                                                id={"cancel_btn"}
                                                className={isSaving ? 'mrg-right-15' : ''}
                                            >
                                                Cancel
                                            </ButtonComponent>
                                            <ButtonComponent
                                                isLoading={isSaving}
                                                className={'submit-cta'}
                                                type={"submit"}
                                                disabled={values?.message === ""}
                                                id={"save_btn"}
                                            >
                                                {isSaving ? "Saving" : "Save"}
                                            </ButtonComponent>
                                        </div>

                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                </AccordionComponent>
            </div>
        </div>
    );

};

export default NewMessageComponent;