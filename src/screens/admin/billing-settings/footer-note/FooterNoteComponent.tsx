import "./FooterNoteComponent.scss";
import {Field, FieldProps, Form, Formik} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../../shared/services";
import AccordionComponent from "../../../../shared/components/accordion/AccordionComponent";
import _ from "lodash";
import * as Yup from "yup";
import {Misc} from "../../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {getBillingSettings} from "../../../../store/actions/billings.action";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";

interface FooterNoteComponentProps {

}

const defaultFooterNote: any = {
    footer_note: '',
    footer_note_second_line: '',
}
const FooterNoteValidationSchema = Yup.object().shape({
    footer_note: Yup.string().max(90, ' '),
    footer_note_second_line: Yup.string().max(90, ' '),
});

const FooterNoteComponent = (props: FooterNoteComponentProps) => {

    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [footerNoteInitialValue, setFooterNoteInitialValue] = useState<any>(_.cloneDeep(defaultFooterNote));
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const {
        billingSettings,
    } = useSelector((state: IRootReducerState) => state.billings);
    console.log('billingSettings', billingSettings);


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
            setIsSaving(false);
            CommonService.handleErrors(setErrors, error, true);
            setIsExpanded(false);
        });
    }, []);

    const handleChange = useCallback(() => {
        setIsExpanded(!isExpanded)
    }, [isExpanded]);

    useEffect(() => {
        setFooterNoteInitialValue({footer_note: billingSettings?.footer_note})
    }, [billingSettings]);

    return (
        <div className={'footer-note-component'}>
            <div className={'footer-note-wrapper'}>
                <AccordionComponent title={'Footer Note'} isExpand={isExpanded} onChange={handleChange}>
                    <div className={'enter-message-text'}>Please enter a default message that will be displayed in the
                        footer of all invoices and receipts.
                    </div>
                    <div>
                        <Formik initialValues={footerNoteInitialValue}
                                validationSchema={FooterNoteValidationSchema}
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
                                            <FormControlLabelComponent label={"Footer Line 1"}/>
                                            <Field name={'footer_note'}>
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
                                            {(values.footer_note?.length) > 90 ?
                                                <div className={'alert-error'}>Characters
                                                    Limit: {(values?.footer_note?.length)}/90</div> :
                                                <div className={'no-alert'}>Characters
                                                    Limit: {(values?.footer_note?.length)}/90</div>}
                                        </div>
                                        <div className={'default-message-box'}>
                                            <FormControlLabelComponent label={"Footer Line 2"}/>
                                            <Field name={'footer_note_second_line'}>
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
                                            {(values.footer_note_second_line?.length) > 90 ?
                                                <div className={'alert-error'}>Characters
                                                    Limit: {(values?.footer_note_second_line?.length)}/90</div> :
                                                <div className={'no-alert'}>Characters
                                                    Limit: {(values?.footer_note_second_line?.length)}/90</div>}
                                        </div>


                                        <div className="t-form-actions mrg-bottom-0">
                                            <ButtonComponent
                                                onClick={() => resetForm()}
                                                variant={'outlined'}
                                                className={isSaving ? 'mrg-right-10' : ''}
                                                id={"cancel_btn"}
                                            >
                                                Cancel
                                            </ButtonComponent>
                                            &nbsp;&nbsp;
                                            <ButtonComponent
                                                isLoading={isSaving}
                                                className={'submit-cta'}
                                                type={"submit"}
                                                id={"save_btn"}
                                                disabled={!isValid || values?.footer_note === "" || CommonService.isEqual(values, defaultFooterNote)}
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

export default FooterNoteComponent;