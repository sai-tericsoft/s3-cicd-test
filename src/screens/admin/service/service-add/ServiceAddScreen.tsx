import "./ServiceAddScreen.scss";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
import {IServiceAdd} from "../../../../shared/models/service-add.model";
import * as Yup from "yup";
import FormikInputComponent from "../../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FilePickerComponent from "../../../../shared/components/file-picker/FilePickerComponent";
import _ from "lodash";
import ErrorComponent from "../../../../shared/components/error/ErrorComponent";
import FilePreviewThumbnailComponent
    from "../../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {ImageConfig, Misc} from "../../../../constants";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormikSelectComponent from "../../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {useParams} from "react-router-dom";

interface ServiceAddComponentProps {
}

const serviceAddFormValidationSchema = Yup.object({
    name: Yup.string()
        .required('The name field is required'),
    description: Yup.string()
        .nullable(),
    image: Yup.mixed()
        .required('The image field is required'),
    initial_consultation: Yup.array(Yup.object({
            title: Yup.string().required("Initial Consultation Title is required"),
            consultation_details: Yup.array(Yup.object({
                duration: Yup.number().required("Duration is required"),
                price: Yup.number().required("Price is required"),
            })),
        })
    ),
    followup_consultation: Yup.array(Yup.object({
            title: Yup.string().required("Followup Consultation Title is required"),
            consultation_details: Yup.array(Yup.object({
                duration: Yup.number().required("Duration is required"),
                price: Yup.number().required("Price is required"),
            })),
        })
    ),
});

const ServiceAddScreen = (props: ServiceAddComponentProps) => {

    const dispatch = useDispatch();
    const {serviceCategoryId} = useParams();

    const [addServiceFormInitialValues] = useState<IServiceAdd>({
        name: "s1 name",
        description: "s1 desc",
        image: "",
        initial_consultation: [
            {
                title: "it1",
                consultation_details: [
                    {
                        duration: 15,
                        price: 5
                    },
                    {
                        duration: 30,
                        price: 15
                    }
                ]
            }
        ],
        followup_consultation: [
            {
                title: "fc1",
                consultation_details: [
                    {
                        duration: 15,
                        price: 6
                    }
                ]
            }
        ],
    });

    const [isServiceAddInProgress, setIsServiceAddInProgress] = useState(false);
    const {consultationDurationList} = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        dispatch(setCurrentNavParams("Add Service", null, true));
    }, [dispatch]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        values["category_id"] = serviceCategoryId;
        console.log(values);
        setIsServiceAddInProgress(true);
        const formData = CommonService.getFormDataFromJSON(values);
        CommonService._serviceAdd.ServiceAddAPICall(formData)
            .then((response: IAPIResponseType<IServiceAdd>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsServiceAddInProgress(false);
                console.log(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsServiceAddInProgress(false);
            })

    }, [serviceCategoryId]);

    return (
        <div className={'service-add-component'}>
            <div className={'service-category-service-add-form'}>
                <FormControlLabelComponent label={"Add New Service"} size={'lg'}/>
                <Formik
                    validationSchema={serviceAddFormValidationSchema}
                    initialValues={addServiceFormInitialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values, touched, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true}>
                                <div>
                                    <Field name={'name'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikInputComponent
                                                    label={'Service Name'}
                                                    placeholder={'Service Name'}
                                                    type={"text"}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }

                                    </Field>
                                    <Field name={'description'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent formikField={field}
                                                                         label={'Service Description'}
                                                                         placeholder={'Service Description'}
                                                                         required={true}
                                                                         fullWidth={true}
                                                />)
                                        }
                                    </Field>
                                    <FieldArray
                                        name="initial_consultation"
                                        render={arrayHelpers => (
                                            <CardComponent title={"Initial Consultation Details"}
                                                           className={"mrg-bottom-20"}
                                                           size={"md"}
                                                           actions={<>
                                                               <ButtonComponent size={"small"}
                                                                                prefixIcon={<ImageConfig.AddIcon/>}
                                                                                onClick={() => {
                                                                                    arrayHelpers.push({
                                                                                        title: "",
                                                                                        consultation_details: [
                                                                                            {
                                                                                                duration: undefined,
                                                                                                price: undefined
                                                                                            }
                                                                                        ]
                                                                                    })
                                                                                }
                                                                                }>
                                                                   Add more
                                                               </ButtonComponent>
                                                           </>
                                                           }>
                                                <div>
                                                    {values?.initial_consultation && values?.initial_consultation?.map((item: any, index: any) => {
                                                        return (
                                                            <div key={index}>
                                                                <div
                                                                    className={"display-flex align-items-center justify-content-space-between mrg-bottom-20"}>
                                                                    <FormControlLabelComponent
                                                                        label={`Initial Consultation Details ${index + 1}`}/>
                                                                    <div>
                                                                        {(index > 0) && <ButtonComponent
                                                                            prefixIcon={<ImageConfig.CloseIcon/>}
                                                                            onClick={() => {
                                                                                arrayHelpers.remove(index);
                                                                            }}
                                                                        >
                                                                            Remove
                                                                        </ButtonComponent>}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <Field
                                                                        name={`initial_consultation[${index}].title`}>
                                                                        {
                                                                            (field: FieldProps) => (
                                                                                <FormikInputComponent
                                                                                    label={'Title'}
                                                                                    placeholder={'Title'}
                                                                                    type={"text"}
                                                                                    required={true}
                                                                                    formikField={field}
                                                                                    fullWidth={true}
                                                                                />
                                                                            )
                                                                        }
                                                                    </Field>
                                                                    <FieldArray
                                                                        name={`initial_consultation[${index}].consultation_details`}
                                                                        render={({push, remove}) => (
                                                                            <div>
                                                                                {values?.initial_consultation[index].consultation_details && values?.initial_consultation[index].consultation_details?.map((item: any, iIndex: any) => {
                                                                                    return (
                                                                                        <div key={iIndex}
                                                                                             className={"display-flex align-items-center"}>
                                                                                            <Field
                                                                                                name={`initial_consultation[${index}].consultation_details[${iIndex}].duration`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikSelectComponent
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                            required={true}
                                                                                                            keyExtractor={item => item.id}
                                                                                                            label={"Duration"}
                                                                                                            options={consultationDurationList}/>
                                                                                                    )
                                                                                                }
                                                                                            </Field>&nbsp;
                                                                                            <Field
                                                                                                name={`initial_consultation[${index}].consultation_details[${iIndex}].price`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikInputComponent
                                                                                                            label={'Price'}
                                                                                                            placeholder={'Price'}
                                                                                                            type={"number"}
                                                                                                            required={true}
                                                                                                            prefix={Misc.CURRENCY_SYMBOL}
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                        />
                                                                                                    )
                                                                                                }
                                                                                            </Field>&nbsp;
                                                                                            {/*{*/}
                                                                                            {/*    iIndex > 0 &&*/}
                                                                                            {/*    <>*/}
                                                                                            {/*        &nbsp;*/}
                                                                                            {/*        <ButtonComponent*/}
                                                                                            {/*            isIconButton={true}*/}
                                                                                            {/*            onClick={() => {*/}
                                                                                            {/*                remove(iIndex);*/}
                                                                                            {/*            }}*/}
                                                                                            {/*        >*/}
                                                                                            {/*            <ImageConfig.CloseIcon/>*/}
                                                                                            {/*        </ButtonComponent>*/}
                                                                                            {/*    </>*/}
                                                                                            {/*}*/}
                                                                                            {
                                                                                                iIndex === values?.initial_consultation[index].consultation_details.length - 1 &&
                                                                                                <ButtonComponent
                                                                                                    isIconButton={true}
                                                                                                    onClick={() => {
                                                                                                        push({
                                                                                                            duration: undefined,
                                                                                                            price: undefined
                                                                                                        })
                                                                                                    }}
                                                                                                >
                                                                                                    <ImageConfig.AddCircleIcon/>
                                                                                                </ButtonComponent>
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </CardComponent>
                                        )}/>
                                    <FieldArray
                                        name="followup_consultation"
                                        render={arrayHelpers => (
                                            <CardComponent title={"Followup Consultation Details"}
                                                           className={"mrg-bottom-20"}
                                                           size={"md"}
                                                           actions={<>
                                                               <ButtonComponent size={"small"}
                                                                                prefixIcon={<ImageConfig.AddIcon/>}
                                                                                onClick={() => {
                                                                                    arrayHelpers.push({
                                                                                        title: "",
                                                                                        consultation_details: [
                                                                                            {
                                                                                                duration: undefined,
                                                                                                price: undefined
                                                                                            }
                                                                                        ]
                                                                                    })
                                                                                }
                                                                                }>
                                                                   Add more
                                                               </ButtonComponent>
                                                           </>
                                                           }>
                                                <div>
                                                    {values?.followup_consultation && values?.followup_consultation?.map((item: any, index: any) => {
                                                        return (
                                                            <div key={index}>
                                                                <div
                                                                    className={"display-flex align-items-center justify-content-space-between mrg-bottom-20"}>
                                                                    <FormControlLabelComponent
                                                                        label={`Followup Consultation Details ${index + 1}`}/>
                                                                    <div>
                                                                        {(index > 0) && <ButtonComponent
                                                                            prefixIcon={<ImageConfig.CloseIcon/>}
                                                                            onClick={() => {
                                                                                arrayHelpers.remove(index);
                                                                            }}
                                                                        >
                                                                            Remove
                                                                        </ButtonComponent>}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <Field
                                                                        name={`followup_consultation[${index}].title`}>
                                                                        {
                                                                            (field: FieldProps) => (
                                                                                <FormikInputComponent
                                                                                    label={'Title'}
                                                                                    placeholder={'Title'}
                                                                                    type={"text"}
                                                                                    required={true}
                                                                                    formikField={field}
                                                                                    fullWidth={true}
                                                                                />
                                                                            )
                                                                        }
                                                                    </Field>
                                                                    <FieldArray
                                                                        name={`followup_consultation[${index}].consultation_details`}
                                                                        render={({push, remove}) => (
                                                                            <div>
                                                                                {values?.followup_consultation[index].consultation_details && values?.followup_consultation[index].consultation_details?.map((item: any, iIndex: any) => {
                                                                                    return (
                                                                                        <div key={iIndex}
                                                                                             className={"display-flex align-items-center"}>
                                                                                            <Field
                                                                                                name={`followup_consultation[${index}].consultation_details[${iIndex}].duration`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikSelectComponent
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                            required={true}
                                                                                                            keyExtractor={item => item.id}
                                                                                                            label={"Duration"}
                                                                                                            options={consultationDurationList}/>
                                                                                                    )
                                                                                                }
                                                                                            </Field>&nbsp;
                                                                                            <Field
                                                                                                name={`followup_consultation[${index}].consultation_details[${iIndex}].price`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikInputComponent
                                                                                                            label={'Price'}
                                                                                                            placeholder={'Price'}
                                                                                                            type={"number"}
                                                                                                            required={true}
                                                                                                            prefix={Misc.CURRENCY_SYMBOL}
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                        />
                                                                                                    )
                                                                                                }
                                                                                            </Field>&nbsp;
                                                                                            {/*{*/}
                                                                                            {/*    iIndex > 0 &&*/}
                                                                                            {/*    <>*/}
                                                                                            {/*        &nbsp;*/}
                                                                                            {/*        <ButtonComponent*/}
                                                                                            {/*            isIconButton={true}*/}
                                                                                            {/*            onClick={() => {*/}
                                                                                            {/*                remove(iIndex);*/}
                                                                                            {/*            }}*/}
                                                                                            {/*        >*/}
                                                                                            {/*            <ImageConfig.CloseIcon/>*/}
                                                                                            {/*        </ButtonComponent>*/}
                                                                                            {/*    </>*/}
                                                                                            {/*}*/}
                                                                                            {
                                                                                                iIndex === values?.followup_consultation[index].consultation_details.length - 1 &&
                                                                                                <ButtonComponent
                                                                                                    isIconButton={true}
                                                                                                    onClick={() => {
                                                                                                        push({
                                                                                                            duration: undefined,
                                                                                                            price: undefined
                                                                                                        })
                                                                                                    }}
                                                                                                >
                                                                                                    <ImageConfig.AddCircleIcon/>
                                                                                                </ButtonComponent>
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </CardComponent>
                                        )}/>
                                    <div className="mrg-bottom-20">
                                        <FormControlLabelComponent label={'Upload Image for Service'}
                                                                   required={true}
                                        />
                                        <>
                                            {(!values.image) && <>
                                                <FilePickerComponent maxFileCount={1}
                                                                     onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                         if (acceptedFiles && acceptedFiles.length > 0) {
                                                                             const file = acceptedFiles[0];
                                                                             setFieldValue('image', file);
                                                                         }
                                                                     }}
                                                                     acceptedFilesText={"PNG, JPG and JPEG files are allowed"}
                                                                     acceptedFileTypes={{
                                                                         'image/*': []
                                                                     }}
                                                />
                                                {
                                                    (_.get(touched, "image") && !!(_.get(errors, "image"))) &&
                                                    <ErrorComponent
                                                        errorText={(_.get(errors, "image"))}/>
                                                }
                                            </>
                                            }
                                        </>
                                        <>
                                            {
                                                (values.image) && <>
                                                    <FilePreviewThumbnailComponent removable={true}
                                                                                   file={values.image}
                                                                                   removeButtonId={"sc_delete_img"}
                                                                                   onRemove={() => {
                                                                                       setFieldValue('image', undefined);
                                                                                   }}/>
                                                </>
                                            }
                                        </>
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isServiceAddInProgress}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"sc_save_btn"}
                                    >
                                        {isServiceAddInProgress ? "Saving" : "Save"}
                                    </ButtonComponent>
                                </div>

                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );

};

export default ServiceAddScreen;