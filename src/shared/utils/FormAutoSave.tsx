import React, {useCallback, useEffect, useState} from 'react';
import {FormikProps} from 'formik';
import _ from 'lodash';
import moment, {Moment} from "moment";

interface FormAutoSaveProps {
    delay?: number;
    formikCtx: FormikProps<any>;
    announce?: boolean;
    onUpdating?: (isChanging: boolean) => void;
}

const FormAutoSave = (props: FormAutoSaveProps) => {

    const {formikCtx, announce, onUpdating} = props;
    const delay = props.delay || 3000;

    const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined);
    const [savedAt, setSavedAt] = useState<Moment | undefined>(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSubmit = useCallback(_.debounce(() => {
        return formikCtx.submitForm()
            .then(() => {
                setIsSaved(true);
                setSavedAt(moment());
                if (onUpdating) {
                    onUpdating(false);
                }
            });
    }, delay), [formikCtx.submitForm, onUpdating, delay]);

    useEffect(() => {
        if (formikCtx.dirty) {
            if (onUpdating) {
                onUpdating(true);
            }
            debouncedSubmit();
        }
    }, [debouncedSubmit, onUpdating, formikCtx.dirty, formikCtx.values]);

    useEffect(() => {
        if (formikCtx.isSubmitting) {
            debouncedSubmit.cancel();
        }
    }, [debouncedSubmit, formikCtx.isSubmitting]);

    return (
        <div className="form-auto-save-component">
            {
                announce && <>
                    {formikCtx.isSubmitting ? 'Saving...' : (isSaved ? 'Last changes saved at ' + savedAt?.format() : null)}
                </>
            }
        </div>
    );
};

export default FormAutoSave;
