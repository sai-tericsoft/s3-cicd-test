import "./ThankYouNoteComponent.scss";
import AccordionComponent from "../../../../shared/components/accordion/AccordionComponent";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik} from "formik";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../../shared/services";
import * as Yup from "yup";
import FooterNoteComponent from "../footer-note/FooterNoteComponent";
import {Misc} from "../../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {getBillingSettings} from "../../../../store/actions/billings.action";
import {IRootReducerState} from "../../../../store/reducers";

interface ThankYouNoteComponentProps {

}

const defaultThankYouNote: any = {
    default_thankyou_note: ''
}
const ThankYouNoteValidationSchema = Yup.object().shape({
    default_thankyou_note: Yup.string().max(90, ' '),
});

const ThankYouNoteComponent = (props: ThankYouNoteComponentProps) => {

    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [thankYouNoteInitialValue, setThankYouNoteInitialValue] = useState<any>(_.cloneDeep(defaultThankYouNote));
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const {
        billingSettings,
    } = useSelector((state: IRootReducerState) => state.billings);

    useEffect(() => {
        dispatch(getBillingSettings())
    }, [dispatch]);

    const onSubmit = useCallback((values: any, {setErrors, resetForm}: any) => {
        setIsSaving(true);
        const payload = {
            ...values,
        }
        CommonService._billingsService.AddBillingSettings(payload)
            .then((response: any) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsSaving(false);
                setIsExpanded(false);
            }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error, true);
            setIsExpanded(false);
            setIsSaving(false);
        });
    }, []);

    const handleChange = useCallback(() => {
        setIsExpanded(!isExpanded)
    }, [isExpanded]);

    useEffect(() => {
        setThankYouNoteInitialValue({
            default_thankyou_note: billingSettings?.default_thankyou_note
        });
    }, [billingSettings]);

    return (
        <div className={'thank-you-note-component'}>

            <div className={'thank-you-note-wrapper'}>
                <AccordionComponent title={'Thank You Note'} isExpand={isExpanded} onChange={handleChange}>
                    <div className={'enter-message-text'}>Please enter a default note that will be saved and
                        displayed
                        at the bottom of all invoices and receipts.
                    </div>
                    <div>
                        <Formik initialValues={thankYouNoteInitialValue}
                                validationSchema={ThankYouNoteValidationSchema}
                                validateOnChange={false}
                                validateOnBlur={true}
                                enableReinitialize={true}
                                validateOnMount={true}
                                onSubmit={onSubmit}>
                            {({values, validateForm, resetForm, isValid}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form className={'t-form'} noValidate={true}>
                                        <div className={'default-message-box'}>
                                            <Field name={'default_thankyou_note'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikTextAreaComponent
                                                            label={'Enter your message here'}
                                                            placeholder={' '}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className={'ts-col-md-12'}>
                                            {(values.default_thankyou_note?.length) > 90 ?
                                                <div className={'alert-error'}>Characters
                                                    Limit:{(values.default_thankyou_note?.length)}/90</div> :
                                                <div className={'no-alert'}>Characters
                                                    Limit:{(values.default_thankyou_note?.length)}/90</div>}
                                        </div>
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                onClick={() => resetForm()}
                                                variant={'outlined'}
                                                className={isSaving ? 'mrg-right-15' : ''}
                                                id={"cancel_btn"}
                                            >
                                                Cancel
                                            </ButtonComponent>
                                            <ButtonComponent
                                                isLoading={isSaving}
                                                className={'submit-cta'}
                                                type={"submit"}
                                                id={"save_btn"}
                                                disabled={!isValid || values?.default_thankyou_note === "" || CommonService.isEqual(values, defaultThankYouNote)}
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

            <FooterNoteComponent/>


        </div>
    );

};

export default ThankYouNoteComponent;