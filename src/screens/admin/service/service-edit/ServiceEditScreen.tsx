import "./ServiceEditScreen.scss";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
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
import {useNavigate, useParams} from "react-router-dom";
import IconButtonComponent from "../../../../shared/components/icon-button/IconButtonComponent";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import {IService} from "../../../../shared/models/service.model";

interface ServiceEditComponentProps {
}

const CONSULTATION_DURATION_SLOT = {
    duration: undefined,
    price: undefined
};

const CONSULTATION_BLOCK = {
    title: "",
    consultation_details: [
        CONSULTATION_DURATION_SLOT
    ]
}

const ServiceEditFormInitialValues: IService = {
    name: "",
    description: "",
    image: "",
    category_id: "",
    is_active: false,
    initial_consultation: [
        CONSULTATION_BLOCK
    ],
    followup_consultation: [
        CONSULTATION_BLOCK
    ],
};


const serviceEditFormValidationSchema = Yup.object({
    name: Yup.string()
        .required('The name field is required'),
    description: Yup.string()
        .nullable(),
    image: Yup.mixed()
        .required('The image field is required'),
});

const ServiceEditScreen = (props: ServiceEditComponentProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {serviceId} = useParams();
    const [serviceDetails, setServiceDetails] = useState<IService | undefined>(undefined);
    const [isServiceDetailsLoading, setIsServiceDetailsLoading] = useState<boolean>(false);
    const [isServiceDetailsLoaded, setIsServiceDetailsLoaded] = useState<boolean>(false);
    const [isServiceDetailsLoadingFailed, setIsServiceDetailsLoadingFailed] = useState<boolean>(false);

    const [editServiceFormInitialValues, setEditServiceFormInitialValues] = useState<IService>(_.cloneDeep(ServiceEditFormInitialValues));

    const [isServiceEditInProgress, setIsServiceEditInProgress] = useState(false);
    const {consultationDurationList} = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        dispatch(setCurrentNavParams("Edit Service", null, () => {
            if (serviceId){
                navigate(CommonService._routeConfig.ServiceDetails(serviceId));
            }
        }));
    }, [navigate, serviceId, dispatch]);

    const fetchServiceDetails = useCallback((serviceId: string) => {
        setIsServiceDetailsLoading(true);
        CommonService._serviceCategory.ServiceDetailsAPICall(serviceId, {})
            .then((response: IAPIResponseType<IService>) => {
                setServiceDetails(response.data);
                setIsServiceDetailsLoading(false);
                setIsServiceDetailsLoaded(true);
                setIsServiceDetailsLoadingFailed(false);
            }).catch((error: any) => {
            setServiceDetails(undefined);
            setIsServiceDetailsLoading(false);
            setIsServiceDetailsLoaded(false);
            setIsServiceDetailsLoadingFailed(true);
        })
    }, []);

    useEffect(() => {
        if (serviceId) {
            fetchServiceDetails(serviceId);
        }
    }, [serviceId, fetchServiceDetails]);

    useEffect(() => {
        if (serviceDetails) {
            console.log(serviceDetails);
            if (serviceDetails.initial_consultation.length === 0) {
                serviceDetails.initial_consultation = [CONSULTATION_BLOCK];
            }
            if (serviceDetails.followup_consultation.length === 0) {
                serviceDetails.followup_consultation = [CONSULTATION_BLOCK];
            }
            setEditServiceFormInitialValues({
                name: serviceDetails.name,
                description: serviceDetails.description,
                image: serviceDetails.image,
                category_id: serviceDetails.category_id,
                is_active: serviceDetails.is_active,
                initial_consultation: serviceDetails.initial_consultation,
                followup_consultation: serviceDetails.followup_consultation
            });
        }
    }, [serviceDetails]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (serviceId) {
            if (!(values.image instanceof File)) {
                delete values.image;
            }
            setIsServiceEditInProgress(true);
            const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['duration_details'])};
            const formData = CommonService.getFormDataFromJSON(payload);
            CommonService._service.ServiceEditAPICall(serviceId, formData)
                .then((response: IAPIResponseType<IService>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setIsServiceEditInProgress(false);
                    if (serviceId) {
                        navigate(CommonService._routeConfig.ServiceDetails(serviceId));
                    }
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error);
                    setIsServiceEditInProgress(false);
                });
        }
    }, [navigate, serviceId]);

    return (
        <div className={'service-add-component'}>
            <div className={'service-category-service-edit-form'}>
                {
                    isServiceDetailsLoading && <LoaderComponent/>
                }
                {
                    isServiceDetailsLoadingFailed && <StatusCardComponent title={"Failed to fetch service details"}/>
                }
                {
                    isServiceDetailsLoaded && <Formik
                        validationSchema={serviceEditFormValidationSchema}
                        initialValues={editServiceFormInitialValues}
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
                                    <div className={"ts-row"}>
                                        <div className="ts-col-lg-10">
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
                                                            titleCase={true}
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
                                                                                 fullWidth={true}
                                                        />)
                                                }
                                            </Field>
                                        </div>
                                    </div>
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
                                                                                    arrayHelpers.push(_.cloneDeep(CONSULTATION_BLOCK))
                                                                                }
                                                                                }>
                                                                   Add more
                                                               </ButtonComponent>
                                                           </>
                                                           }>
                                                <>
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
                                                                <div className={"ts-row"}>
                                                                    <div className="ts-col-lg-10">
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
                                                                    </div>
                                                                </div>
                                                                <FieldArray
                                                                    name={`initial_consultation[${index}].consultation_details`}
                                                                    render={({push, remove}) => (
                                                                        <div>
                                                                            {values?.initial_consultation[index].consultation_details && values?.initial_consultation[index].consultation_details?.map((item: any, iIndex: any) => {
                                                                                return (
                                                                                    <div key={iIndex}
                                                                                         className={"ts-row"}>
                                                                                        <div className="ts-col-lg-5">
                                                                                            <Field
                                                                                                name={`initial_consultation[${index}].consultation_details[${iIndex}].duration`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikSelectComponent
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                            keyExtractor={item => item.id}
                                                                                                            label={"Duration"}
                                                                                                            options={consultationDurationList}/>
                                                                                                    )
                                                                                                }
                                                                                            </Field>
                                                                                        </div>
                                                                                        <div className="ts-col-lg-5">
                                                                                            <Field
                                                                                                name={`initial_consultation[${index}].consultation_details[${iIndex}].price`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikInputComponent
                                                                                                            label={'Price'}
                                                                                                            placeholder={'Price'}
                                                                                                            type={"number"}
                                                                                                            prefix={Misc.CURRENCY_SYMBOL}
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                        />
                                                                                                    )
                                                                                                }
                                                                                            </Field>
                                                                                        </div>
                                                                                        <div className="ts-col-lg-2">
                                                                                            {
                                                                                                iIndex === values?.initial_consultation[index].consultation_details.length - 1 &&
                                                                                                <IconButtonComponent
                                                                                                    onClick={() => {
                                                                                                        push(_.cloneDeep(CONSULTATION_DURATION_SLOT));
                                                                                                    }}
                                                                                                >
                                                                                                    <ImageConfig.AddCircleIcon/>
                                                                                                </IconButtonComponent>
                                                                                            }
                                                                                            {
                                                                                                iIndex > 0 &&
                                                                                                <>
                                                                                                    &nbsp;
                                                                                                    <IconButtonComponent
                                                                                                        onClick={() => {
                                                                                                            remove(iIndex);
                                                                                                        }}
                                                                                                    >
                                                                                                        <ImageConfig.DeleteIcon/>
                                                                                                    </IconButtonComponent>
                                                                                                </>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    )
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </>
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
                                                                                    arrayHelpers.push(_.cloneDeep(CONSULTATION_BLOCK))
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
                                                                <div className={"ts-row"}>
                                                                    <div className="ts-col-lg-10">
                                                                        <Field
                                                                            name={`followup_consultation[${index}].title`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikInputComponent
                                                                                        label={'Title'}
                                                                                        placeholder={'Title'}
                                                                                        type={"text"}
                                                                                        formikField={field}
                                                                                        fullWidth={true}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </div>
                                                                </div>
                                                                <FieldArray
                                                                    name={`followup_consultation[${index}].consultation_details`}
                                                                    render={({push, remove}) => (
                                                                        <div>
                                                                            {values?.followup_consultation[index].consultation_details && values?.followup_consultation[index].consultation_details?.map((item: any, iIndex: any) => {
                                                                                return (
                                                                                    <div key={iIndex}
                                                                                         className={"ts-row"}>
                                                                                        <div className="ts-col-lg-5">
                                                                                            <Field
                                                                                                name={`followup_consultation[${index}].consultation_details[${iIndex}].duration`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikSelectComponent
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                            keyExtractor={item => item.id}
                                                                                                            label={"Duration"}
                                                                                                            options={consultationDurationList}/>
                                                                                                    )
                                                                                                }
                                                                                            </Field>
                                                                                        </div>
                                                                                        <div className="ts-col-lg-5">
                                                                                            <Field
                                                                                                name={`followup_consultation[${index}].consultation_details[${iIndex}].price`}>
                                                                                                {
                                                                                                    (field: FieldProps) => (
                                                                                                        <FormikInputComponent
                                                                                                            label={'Price'}
                                                                                                            placeholder={'Price'}
                                                                                                            type={"number"}
                                                                                                            prefix={Misc.CURRENCY_SYMBOL}
                                                                                                            formikField={field}
                                                                                                            fullWidth={true}
                                                                                                        />
                                                                                                    )
                                                                                                }
                                                                                            </Field>
                                                                                        </div>
                                                                                        <div className="ts-col-lg-2">
                                                                                            {
                                                                                                iIndex === values?.followup_consultation[index].consultation_details.length - 1 &&
                                                                                                <IconButtonComponent
                                                                                                    onClick={() => {
                                                                                                        push(_.cloneDeep(CONSULTATION_DURATION_SLOT));
                                                                                                    }}
                                                                                                >
                                                                                                    <ImageConfig.AddCircleIcon/>
                                                                                                </IconButtonComponent>
                                                                                            }
                                                                                            {
                                                                                                iIndex > 0 &&
                                                                                                <>
                                                                                                    &nbsp;
                                                                                                    <IconButtonComponent
                                                                                                        onClick={() => {
                                                                                                            remove(iIndex);
                                                                                                        }}
                                                                                                    >
                                                                                                        <ImageConfig.DeleteIcon/>
                                                                                                    </IconButtonComponent>
                                                                                                </>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    )
                                                                    }
                                                                />
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
                                                                     acceptedFileTypes={["png", "jpg", "jpeg"]}
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
                                    <div className="t-form-actions">
                                        <ButtonComponent
                                            isLoading={isServiceEditInProgress}
                                            type={"submit"}
                                            fullWidth={true}
                                            id={"sc_save_btn"}
                                        >
                                            {isServiceEditInProgress ? "Saving" : "Save"}
                                        </ButtonComponent>
                                    </div>

                                </Form>
                            )
                        }}
                    </Formik>
                }
            </div>
        </div>
    );

};

export default ServiceEditScreen;