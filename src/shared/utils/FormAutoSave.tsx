import React, {useCallback, useEffect, useState} from 'react';
import {FormikProps} from 'formik';
import _ from 'lodash';
import moment, {Moment} from "moment";

interface FormAutoSaveProps {
    delay?: number;
    formikCtx: FormikProps<any>;
    announce?: boolean;
}

const FormAutoSave = (props: FormAutoSaveProps) => {

    const {formikCtx, announce} = props;
    const delay = props.delay || 5000;

    const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined);
    const [savedAt, setSavedAt] = useState<Moment | undefined>(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSubmit = useCallback(_.debounce(() => {
        return formikCtx.submitForm()
            .then(() => {
                setIsSaved(true);
                setSavedAt(moment());
            });
    }, delay), [formikCtx.submitForm, delay]);

    useEffect(() => {
        if (formikCtx.dirty) {
            debouncedSubmit();
        }
    }, [debouncedSubmit, formikCtx.values]);

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
