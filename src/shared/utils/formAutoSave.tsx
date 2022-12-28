// import { useEffect, FC, useCallback } from "react";
// import { FormikValues, useFormikContext } from "formik";
// import { omit, isEqual } from "lodash";
//
// interface FormAutoSaveProps {
//     delay?: number;
//     onSubmit?: (v: FormikValues) => void;
// }
//
// const FormAutoSave: FC<FormAutoSaveProps> = ({ delay = 300, onSubmit }) => {
//     const { values, errors, initialValues } = useFormikContext<FormikValues>();
//
//     const isSameValueAsInitialValue = async (v: FormikValues) =>
//         isEqual(v, initialValues);
//
//     const onFormSubmit = useCallback(async () => {
//         const v: FormikValues = omit(values, Object.keys(errors));
//         if (onSubmit && !(await isSameValueAsInitialValue(v))) onSubmit(v);
//     }, [values, initialValues, errors]);
//
//     // add delay of 300ms by default, or whatever delay prop is
//     useEffect(() => {
//         const timer = setTimeout(() => onFormSubmit(), delay);
//         return () => clearTimeout(timer);
//     }, [values, errors]);
//
//     return null;
// };
//
// export default FormAutoSave;


import React, {useCallback, useEffect, useState} from 'react';
import {FormikProps} from 'formik';
import _ from 'lodash';
import moment, {Moment} from "moment";

interface FormAutoSaveProps {
    delay?: number;
    formikCtx: FormikProps<any>;
}

const FormAutoSave = (props: FormAutoSaveProps) => {

    const {formikCtx} = props;
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
        debouncedSubmit();
    }, [debouncedSubmit, formikCtx.values]);

    useEffect(() => {
        if (formikCtx.isSubmitting) {
            debouncedSubmit.cancel();
        }
    }, [debouncedSubmit, formikCtx.isSubmitting]);


    return (
        <p className="text-center text-success">
            {formikCtx.isSubmitting ? 'Saving...' : (isSaved ? 'Last changes saved at ' + savedAt?.format() : null)}
        </p>
    );
};

export default FormAutoSave;
