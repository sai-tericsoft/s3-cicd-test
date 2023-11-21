import "./DefaultMessageComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig, Misc} from "../../../../constants";
import AccordionComponent from "../../../../shared/components/accordion/AccordionComponent";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import _ from "lodash";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {ISystemSettingsConfig} from "../../../../shared/models/account.model";
import NewMessageComponent from "../new-message/NewMessageComponent";
import DrawerComponent from "../../../../shared/components/drawer/DrawerComponent";
import AllMessageHistoryComponent from "../all-message-history/AllMessageHistoryComponent";

interface DefaultMessageComponentProps {
    defaultMessage?: any;
}

const defaultMessageInitialValue: any = {
    default_message: ''
}

const DefaultMessageComponent = (props: DefaultMessageComponentProps) => {

    const {defaultMessage} = props;
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [defaultMessageFormInitialValue, setDefaultMessageFormInitialValue] = useState<any>(_.cloneDeep(defaultMessageInitialValue));
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);

    const openHistoryDrawer = useCallback(() => {
        setIsHistoryDrawerOpen(true)
    }, []);

    const closeHistoryDrawer = useCallback(() => {
        setIsHistoryDrawerOpen(false)
    }, [])

    const handleChange = useCallback(() => {
        setIsExpanded(!isExpanded)
    }, [isExpanded]);

    useEffect(() => {
        setDefaultMessageFormInitialValue({
            default_message: defaultMessage?.default_message
        })
    }, [defaultMessage])

    const onSubmit = useCallback((values: any, {setErrors, resetForm}: FormikHelpers<any>) => {
        setIsSaving(true);
        CommonService._systemSettings.SaveSystemSettingsAPICall(values)
            .then((response: IAPIResponseType<ISystemSettingsConfig>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsSaving(false);
                setIsExpanded(false);
                // resetForm();
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
        <div className={'default-message-component'}>
            <CardComponent title={'Message Board'}
                           actions={<><ButtonComponent onClick={openHistoryDrawer} size={"small"}
                                                       prefixIcon={<ImageConfig.History/>}>
                               History
                           </ButtonComponent></>}>
                <div className={'news-update-text'}>
                    Send the latest news, updates and software upgrades to the team.
                </div>
                <div>
                    <AccordionComponent title={'Default Message'} isExpand={isExpanded} onChange={handleChange}>
                        <div className={'enter-message-text'}>Please enter a default message that will be saved and
                            shown to all system users by default on the message board.
                        </div>
                        <div>
                            <Formik initialValues={defaultMessageFormInitialValue}
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
                                            <div className={'default-message-box'}>
                                                <Field name={'default_message'}>
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
                                            <div className="t-form-actions">
                                                <ButtonComponent
                                                    onClick={() => handleClose(resetForm)}
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
                                                    disabled={values?.default_message === "" || CommonService.isEqual(values, defaultMessageInitialValue)}
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
                <NewMessageComponent/>
            </CardComponent>
            <DrawerComponent isOpen={isHistoryDrawerOpen}
                             showClose={true}
                             closeOnEsc={false}
                             closeOnBackDropClick={true}
                             closeButtonId={"sc_close_btn"}
                             onClose={closeHistoryDrawer}>
                <AllMessageHistoryComponent/>
            </DrawerComponent>
        </div>
    );

};

export default DefaultMessageComponent;